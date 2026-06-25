import { crypto } from 'jsr:@std/crypto';

// ─────────────────────────────────────────────
// SimplyBook Proxy Edge Function
// Handles: health | slots | fields | book
// ─────────────────────────────────────────────

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
};

const SB_LOGIN_URL = 'https://user-api.simplybook.me/login/';
const SB_API_URL = 'https://user-api.simplybook.me/';

/* ── 從 Edge Function Secrets 讀取 ── */
const COMPANY = Deno.env.get('SIMPLYBOOK_COMPANY') ?? '';
const API_KEY = Deno.env.get('SIMPLYBOOK_API_KEY') ?? '';
const API_SECRET = Deno.env.get('SIMPLYBOOK_API_SECRET') ?? '';

/* ── 記憶體快取 token ── */
let _token: { value: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (_token && Date.now() < _token.expiresAt) {
    return _token.value;
  }
  const res = await fetch(SB_LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'getToken',
      params: [COMPANY, API_KEY],
      id: 1,
    }),
  });
  const rawText = await res.text();
  let data: { result?: string; error?: { message?: string } };
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`Token invalid JSON (status ${res.status}): ${rawText.slice(0, 200)}`);
  }
  if (data.error) {
    throw new Error(`Token error: ${JSON.stringify(data.error)}`);
  }
  const token = data.result ?? '';
  _token = { value: token, expiresAt: Date.now() + 50 * 60 * 1000 };
  return token;
}

async function callRpc(method: string, params: unknown[]): Promise<unknown> {
  const token = await getToken();
  const res = await fetch(SB_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Company-Login': COMPANY,
      'X-Token': token,
    },
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
  });
  const rawText = await res.text();
  let data: { result?: unknown; error?: { message?: string } };
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`RPC ${method} invalid JSON (status ${res.status}): ${rawText.slice(0, 200)}`);
  }
  if (data.error) {
    throw new Error(`RPC ${method} error: ${JSON.stringify(data.error)}`);
  }
  return data.result;
}

/* ── 計算 require_confirm 簽名 ── */
async function computeConfirmSignature(bookingId: string, hash: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${bookingId}${hash}${API_SECRET}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function confirmBooking(bookingId: string, hash: string): Promise<unknown> {
  const signature = await computeConfirmSignature(bookingId, hash);
  return callRpc('confirmBooking', [bookingId, hash, signature]);
}

/* ── JSON 回應輔助 ── */
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

function errorResponse(message: string, status = 500): Response {
  return jsonResponse({ error: message }, status);
}

/* ── 主 handler ── */
async function handler(req: Request): Promise<Response> {
  // OPTIONS 預檢
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  // GET 健康檢查（給前端 checkEdgeFunction 用）
  if (req.method === 'GET') {
    return jsonResponse({
      ok: true,
      apiKeySet: Boolean(COMPANY && API_KEY),
      apiSecretSet: Boolean(API_SECRET),
      company: COMPANY,
      message: 'SimplyBook Proxy is running',
    });
  }

  // 只處理 POST
  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return errorResponse('Invalid JSON body', 400);
  }

  const { action } = body;

  /* ── health ── */
  if (action === 'health') {
    return jsonResponse({
      ok: true,
      apiKeySet: Boolean(COMPANY && API_KEY),
      apiSecretSet: Boolean(API_SECRET),
      company: COMPANY,
    });
  }

  /* ── slots ── */
  if (action === 'slots') {
    const serviceId = Number(body.serviceId);
    const providerId = Number(body.providerId);
    const dateFrom = String(body.dateFrom ?? '');
    const dateTo = String(body.dateTo ?? '');

    if (!serviceId || !providerId || !dateFrom || !dateTo) {
      return errorResponse('Missing serviceId, providerId, dateFrom, or dateTo', 400);
    }

    try {
      const matrix = (await callRpc('getStartTimeMatrix', [
        dateFrom, dateTo, serviceId, providerId, 1,
      ])) as Record<string, string[]>;
      return jsonResponse({ slotsByDate: matrix ?? {} });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResponse(`SimplyBook slots error: ${msg}`, 502);
    }
  }

  /* ── fields ── */
  if (action === 'fields') {
    const serviceId = Number(body.serviceId);
    if (!serviceId) {
      return errorResponse('Missing serviceId', 400);
    }

    try {
      const fields = (await callRpc('getAdditionalFields', [serviceId])) as unknown[];
      return jsonResponse({ fields: fields ?? [] });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResponse(`SimplyBook fields error: ${msg}`, 502);
    }
  }

  /* ── book ── */
  if (action === 'book') {
    const serviceId = Number(body.serviceId);
    const providerId = Number(body.providerId);
    const date = String(body.date ?? '');
    const time = String(body.time ?? '');
    const client = body.client as Record<string, string> | undefined;
    const additional = body.additional as Record<string, string> | undefined;

    if (!serviceId || !providerId || !date || !time || !client) {
      return errorResponse('Missing required booking parameters', 400);
    }

    try {
      const raw = (await callRpc('book', [
        serviceId,
        providerId,
        date,
        time,
        client,
        additional ?? {},
      ])) as {
        bookings?: Array<{
          id: string | number;
          hash: string;
          code?: string;
          start_date_time?: string;
          end_date_time?: string;
          is_confirmed?: string;
        }>;
        require_confirm?: boolean;
      };

      const requireConfirm = Boolean(raw.require_confirm);

      // 若需要確認，使用 API Secret 自動確認
      if (requireConfirm && raw.bookings) {
        for (const b of raw.bookings) {
          try {
            await confirmBooking(String(b.id), b.hash);
          } catch (confirmErr) {
            console.error('confirmBooking failed:', confirmErr);
          }
        }
      }

      const bookings = (raw.bookings ?? []).map((b) => ({
        id: String(b.id),
        code: b.code ?? '',
        start_date_time: b.start_date_time ?? `${date} ${time}`,
        end_date_time: b.end_date_time ?? '',
        is_confirmed: b.is_confirmed ?? '1',
      }));

      return jsonResponse({ require_confirm: false, bookings });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResponse(`SimplyBook book error: ${msg}`, 502);
    }
  }

  return errorResponse(`Unknown action: ${String(action)}`, 400);
}

Deno.serve(handler);
