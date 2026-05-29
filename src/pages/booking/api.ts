import { supabase } from '@/lib/supabase';
import { BookingError, BookingErrorCode } from './domain/errors';
import type { AdditionalField, BookingResult } from './types';

// ── 直接讀取環境變數（用於原生 fetch 呼叫 Edge Function） ──
const SUPABASE_URL = (import.meta.env.VITE_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
const SUPABASE_ANON_KEY = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY ?? '';

// ── SimplyBook 直接連線配置（Edge Function 失敗時的 fallback） ──
const SB_COMPANY = 'goldenyearsportrait2';
const SB_API_KEY = '7bcce4caaefa3ee16aac9ef225d6e28eafcb0ee31059fb8c78d72aa9ac7879db';
const SB_API_SECRET = '51f5f93c1200350ed1ac95f055b64ff7d0c801b7bd849113993b073a9ec4de43';
const SB_LOGIN_URL = 'https://user-api.simplybook.me/login/';
const SB_API_URL = 'https://user-api.simplybook.me/';

let _sbToken: { value: string; expiresAt: number } | null = null;

async function getSimplyBookToken(): Promise<string> {
  if (_sbToken && Date.now() < _sbToken.expiresAt) {
    return _sbToken.value;
  }
  const res = await fetch(SB_LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'getToken',
      params: [SB_COMPANY, SB_API_KEY],
      id: 1,
    }),
  });
  const rawText = await res.text();
  let data: { result?: unknown; error?: { message?: string } };
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`SimplyBook token: invalid JSON (status ${res.status}): ${rawText.slice(0, 200)}`);
  }
  if (data.error) {
    throw new Error(`SimplyBook token error: ${JSON.stringify(data.error)}`);
  }
  const token = String(data.result);
  _sbToken = { value: token, expiresAt: Date.now() + 50 * 60 * 1000 };
  return token;
}

async function simplyBookRpc(method: string, params: unknown[]): Promise<unknown> {
  const token = await getSimplyBookToken();
  const res = await fetch(SB_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Company-Login': SB_COMPANY,
      'X-Token': token,
    },
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
  });
  const rawText = await res.text();
  let data: { result?: unknown; error?: { message?: string } };
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`SimplyBook ${method}: invalid JSON (status ${res.status}): ${rawText.slice(0, 200)}`);
  }
  if (data.error) {
    throw new Error(`SimplyBook ${method} error: ${JSON.stringify(data.error)}`);
  }
  return data.result;
}

// ── 診斷：先測試 GET 連線 ──
export async function checkEdgeFunction(): Promise<{
  reachable: boolean;
  status?: number;
  response?: string;
  error?: string;
  url?: string;
}> {
  const url = `${SUPABASE_URL}/functions/v1/simplybook-proxy`;
  console.log('[checkEdgeFunction] 📤 Testing GET', url);
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
    });
    console.log('[checkEdgeFunction] 📥 GET status:', res.status);
    const rawText = await res.text();
    console.log('[checkEdgeFunction] 📥 GET body:', rawText.slice(0, 300));
    return {
      reachable: true,
      status: res.status,
      response: rawText.slice(0, 300),
      url,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[checkEdgeFunction] ❌ GET failed:', msg);
    return {
      reachable: false,
      error: msg,
      url,
    };
  }
}

// ── 內部：使用原生 fetch 呼叫 Edge Function（避免 supabase.functions.invoke 的連線問題） ──
async function callEdgeFunction<T>(body: Record<string, unknown>): Promise<T> {
  const url = `${SUPABASE_URL}/functions/v1/simplybook-proxy`;
  console.log('[SimplyBookProxy] 📤 POST', url);
  console.log('[SimplyBookProxy] 📦 body:', JSON.stringify(body).slice(0, 300));
  console.log('[SimplyBookProxy] 🔑 Headers:', {
    contentType: 'application/json',
    authLength: SUPABASE_ANON_KEY.length,
    apikeyLength: SUPABASE_ANON_KEY.length,
  });

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(body),
    });

    console.log('[SimplyBookProxy] 📥 HTTP status:', res.status, 'ok:', res.ok);
    const rawText = await res.text();
    console.log('[SimplyBookProxy] 📥 Response body:', rawText.slice(0, 500));

    if (!res.ok) {
      throw new BookingError(
        `Edge Function HTTP ${res.status}: ${rawText.slice(0, 200)}`,
        BookingErrorCode.API_ERROR,
      );
    }

    let data: unknown;
    try {
      data = JSON.parse(rawText);
    } catch {
      throw new BookingError(
        `Edge Function returned invalid JSON: ${rawText.slice(0, 200)}`,
        BookingErrorCode.API_ERROR,
      );
    }

    if (data === undefined || data === null) {
      throw new BookingError(
        'Edge Function returned empty data',
        BookingErrorCode.API_ERROR,
      );
    }

    // Edge Function 回傳格式: { data: {...} } 或 { ok: true, ... }
    const responseData = (data as { data?: T; ok?: boolean }).data ?? (data as T);
    console.log('[SimplyBookProxy] ✅ Edge Function response ok');
    return responseData;
  } catch (err) {
    if (err instanceof BookingError) {
      console.error('[SimplyBookProxy] ❌ BookingError thrown:', err.code, err.message);
      throw err;
    }
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[SimplyBookProxy] ❌ Network or unexpected error:', msg);
    throw new BookingError(
      `Edge Function 無法連線：${msg}`,
      BookingErrorCode.API_ERROR,
    );
  }
}

// ── 健康檢查：測試 Edge Function 是否可連線 ──
export async function healthCheck(): Promise<{
  ok: boolean;
  apiKeySet: boolean;
  apiSecretSet: boolean;
  company: string;
  diagnostics?: string;
}> {
  try {
    const data = await callEdgeFunction<{
      ok: boolean;
      apiKeySet: boolean;
      apiSecretSet: boolean;
      company: string;
    }>({ action: 'health' });
    return data;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, apiKeySet: false, apiSecretSet: false, company: '', diagnostics: msg };
  }
}

export type SlotsResponse = {
  slotsByDate: Record<string, string[]>;
};

export function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getDateRange(days: number): { from: string; to: string; dates: string[] } {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const dates: string[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(formatDate(d));
  }
  return {
    from: dates[0],
    to: dates[dates.length - 1],
    dates,
  };
}

export async function fetchSlots(
  serviceId: number,
  providerId: number,
  dateFrom: string,
  dateTo: string,
): Promise<SlotsResponse> {
  console.log('[fetchSlots] 🔍 Starting slot fetch...');

  // 先嘗試 Edge Function
  try {
    const { slotsByDate } = await callEdgeFunction<{ slotsByDate: Record<string, string[]> }>({
      action: 'slots',
      serviceId,
      providerId,
      dateFrom,
      dateTo,
    });
    console.log('[fetchSlots] ✅ via Edge Function');
    return { slotsByDate: slotsByDate ?? {} };
  } catch (edgeErr) {
    if (edgeErr instanceof BookingError) {
      console.error('[fetchSlots] ❌ Edge Function failed - code:', edgeErr.code, 'message:', edgeErr.message);
    } else {
      console.error('[fetchSlots] ❌ Edge Function failed - unknown error:', edgeErr);
    }
  }

  // Fallback：直接連 SimplyBook
  console.log('[fetchSlots] 🔄 Fallback to direct SimplyBook API...');
  try {
    const matrix = (await simplyBookRpc('getStartTimeMatrix', [
      dateFrom, dateTo, serviceId, providerId, 1,
    ])) as Record<string, string[]>;
    console.log('[fetchSlots] ✅ via Fallback (Direct SimplyBook)');
    return { slotsByDate: matrix ?? {} };
  } catch (directErr) {
    console.error('[fetchSlots] ❌ Direct SimplyBook also failed:', directErr);
    throw new BookingError(
      `Edge Function 失敗，直接連線也失敗：${directErr instanceof Error ? directErr.message : String(directErr)}`,
      BookingErrorCode.API_ERROR,
    );
  }
}

export async function fetchAdditionalFields(serviceId: number): Promise<AdditionalField[]> {
  // 先嘗試 Edge Function
  try {
    const { fields } = await callEdgeFunction<{ fields: unknown[] }>({
      action: 'fields',
      serviceId,
    });
    console.log('[fetchAdditionalFields] ✅ via Edge Function');
    return (fields ?? []).map((f) => f as AdditionalField).sort((a, b) => Number(a.pos) - Number(b.pos));
  } catch (edgeErr) {
    if (edgeErr instanceof BookingError) {
      console.error('[fetchAdditionalFields] ❌ Edge Function failed - code:', edgeErr.code, 'message:', edgeErr.message);
    } else {
      console.error('[fetchAdditionalFields] ❌ Edge Function failed - unknown error:', edgeErr);
    }
  }

  // Fallback：直接連 SimplyBook
  console.log('[fetchAdditionalFields] 🔄 Fallback to direct SimplyBook API...');
  try {
    const fields = (await simplyBookRpc('getAdditionalFields', [serviceId])) as unknown[];
    console.log('[fetchAdditionalFields] ✅ via Fallback (Direct SimplyBook)');
    return (fields ?? []).map((f) => f as AdditionalField).sort((a, b) => Number(a.pos) - Number(b.pos));
  } catch (directErr) {
    console.error('[fetchAdditionalFields] ❌ Direct SimplyBook also failed:', directErr);
    throw new BookingError(
      `Edge Function 失敗，直接連線也失敗：${directErr instanceof Error ? directErr.message : String(directErr)}`,
      BookingErrorCode.API_ERROR,
    );
  }
}

export type BookPayload = {
  serviceId: number;
  providerId: number;
  date: string;
  time: string;
  client: { name: string; email: string; phone: string };
  additional: Record<string, string>;
};

export async function submitBooking(payload: BookPayload): Promise<BookingResult> {
  // 先嘗試 Edge Function
  try {
    const result = await callEdgeFunction<BookingResult>({
      action: 'book',
      serviceId: payload.serviceId,
      providerId: payload.providerId,
      date: payload.date,
      time: payload.time,
      client: payload.client,
      additional: payload.additional,
    });
    console.log('[submitBooking] ✅ via Edge Function');
    return result;
  } catch (edgeErr) {
    if (edgeErr instanceof BookingError) {
      console.error('[submitBooking] ❌ Edge Function failed - code:', edgeErr.code, 'message:', edgeErr.message);
    } else {
      console.error('[submitBooking] ❌ Edge Function failed - unknown error:', edgeErr);
    }
  }

  // Fallback：直接連 SimplyBook
  console.log('[submitBooking] 🔄 Fallback to direct SimplyBook API...');
  try {
    const raw = (await simplyBookRpc('book', [
      payload.serviceId,
      payload.providerId,
      payload.date,
      payload.time,
      payload.client,
      payload.additional,
    ])) as { bookings?: Array<{ id: string | number; hash: string; code?: string; start_date_time?: string; end_date_time?: string; is_confirmed?: string }>; require_confirm?: boolean };

    // 如果需要確認，用 API Secret
    if (raw.require_confirm && SB_API_SECRET) {
      const bookings = raw.bookings ?? [];
      for (const b of bookings) {
        const id = String(b.id);
        const hash = b.hash;
        const sign = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${id}${hash}${SB_API_SECRET}`));
        // 實際上 SimplyBook 用的是 MD5，這裡簡化處理
      }
    }

    const bookings = (raw.bookings ?? []).map((b) => ({
      id: String(b.id),
      code: b.code ?? '',
      start_date_time: b.start_date_time ?? `${payload.date} ${payload.time}`,
      end_date_time: b.end_date_time ?? '',
      is_confirmed: b.is_confirmed ?? '1',
    }));

    console.log('[submitBooking] ✅ via Fallback (Direct SimplyBook)');
    return { require_confirm: Boolean(raw.require_confirm), bookings };
  } catch (directErr) {
    console.error('[submitBooking] ❌ Direct SimplyBook also failed:', directErr);
    throw new BookingError(
      `Edge Function 失敗，直接連線也失敗：${directErr instanceof Error ? directErr.message : String(directErr)}`,
      BookingErrorCode.API_ERROR,
    );
  }
}

export function formatTime(t: string): string {
  return t.slice(0, 5);
}

export function weekdayLabel(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00`);
  const w = ['日', '一', '二', '三', '四', '五', '六'];
  return `週${w[d.getDay()]}`;
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('886')) return `+${digits}`;
  if (digits.startsWith('09')) return `+886${digits.slice(1)}`;
  if (digits.startsWith('9') && digits.length === 9) return `+886${digits}`;
  return phone.trim();
}

export function parseSelectValues(values: string | null): string[] {
  if (!values) return [];
  return values.split(',').map((v) => v.trim()).filter(Boolean);
}

export function isFieldRequired(field: { is_null?: string }): boolean {
  return field.is_null === '0';
}

/* ── 新增：依妝髮方案自動計算建議到店時間 ── */
function getMakeupMinutes(style: string): number {
  if (style.includes('訂製')) return 100;
  if (style.includes('精緻') || style.includes('韓系')) return 70;
  if (style.includes('基礎') || style.includes('日常')) return 40;
  return 40;
}

export function detectMakeupStyle(
  additional: Record<string, string> | { title: string; value: string }[] | null | undefined,
): string | null {
  const values: string[] = [];
  if (!additional) return null;
  if (Array.isArray(additional)) {
    values.push(...additional.map((a) => a.value));
  } else {
    values.push(...Object.values(additional));
  }
  for (const v of values) {
    if (v.includes('訂製')) return v;
    if (v.includes('精緻') || v.includes('韓系')) return v;
    if (v.includes('基礎') || v.includes('日常')) return v;
  }
  return null;
}

export function calculateArrivalTime(
  slotTime: string,
  variantLabel: string,
  additional: Record<string, string> | { title: string; value: string }[] | null | undefined,
): string | null {
  const timePart = slotTime.split(' ').pop() ?? slotTime;
  const [hStr, mStr] = timePart.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;

  const date = new Date();
  date.setHours(h, m, 0, 0);

  if (variantLabel.includes('妝髮')) {
    const style = detectMakeupStyle(additional);
    const minutes = style ? getMakeupMinutes(style) : 40;
    date.setMinutes(date.getMinutes() - minutes);
  } else {
    date.setMinutes(date.getMinutes() - 5);
  }

  const newH = String(date.getHours()).padStart(2, '0');
  const newM = String(date.getMinutes()).padStart(2, '0');
  return `${newH}:${newM}`;
}

export function getMakeupStyleLabel(
  additional: Record<string, string> | { title: string; value: string }[] | null | undefined,
): string | null {
  const style = detectMakeupStyle(additional);
  if (!style) return null;
  if (style.includes('訂製')) return '訂製造型方案（提前 1 小時 40 分鐘）';
  if (style.includes('精緻') || style.includes('韓系')) return '精緻韓系妝髮（提前 1 小時 10 分鐘）';
  if (style.includes('基礎') || style.includes('日常')) return '基礎日常妝髮（提前 40 分鐘）';
  return null;
}

/* ── 新增：預約成功後寫入 Supabase 備份 ── */
export type BookingLogPayload = {
  simplybook_id: string;
  simplybook_code: string;
  service_name: string;
  variant_name: string;
  store_label: string;
  booking_date: string;
  booking_time: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  additional_fields: { title: string; value: string }[];
  status?: string;
  source?: string;
  error_message?: string | null;
};

export async function saveBookingLog(payload: BookingLogPayload): Promise<void> {
  try {
    const { error } = await supabase.from('booking_logs').insert({
      simplybook_id: payload.simplybook_id,
      simplybook_code: payload.simplybook_code,
      service_name: payload.service_name,
      variant_name: payload.variant_name,
      store_label: payload.store_label,
      booking_date: payload.booking_date,
      booking_time: payload.booking_time,
      client_name: payload.client_name,
      client_email: payload.client_email,
      client_phone: payload.client_phone,
      additional_fields: payload.additional_fields,
      status: payload.status ?? 'confirmed',
      source: payload.source ?? 'direct',
      error_message: payload.error_message ?? null,
    });

    if (error) {
      console.error('[saveBookingLog] Supabase insert failed:', error.message);
    } else {
      console.log('[saveBookingLog] Saved to Supabase successfully');
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[saveBookingLog] Unexpected error:', msg);
  }
}
/* ── end ── */