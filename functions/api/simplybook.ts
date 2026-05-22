interface Env {
  SIMPLYBOOK_COMPANY_LOGIN: string;
  SIMPLYBOOK_API_KEY: string;
  SIMPLYBOOK_API_SECRET: string;
  SIMPLYBOOK_LOGIN_URL: string;
  SIMPLYBOOK_API_URL: string;
}

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type JsonRpcResponse = {
  result?: unknown;
  error?: { message?: string; code?: number | string };
};

type BookingRpcResult = {
  require_confirm?: boolean;
  bookings?: Array<{
    id: string | number;
    hash: string;
    code?: string;
    start_date_time?: string;
    end_date_time?: string;
    is_confirmed?: string;
  }>;
};

let cachedToken: { value: string; expiresAt: number } | null = null;

/** MD5 hex (Workers 預設無 node:crypto，不依賴 nodejs_compat) */
function md5Hex(input: string): string {
  const bytes = new TextEncoder().encode(input);

  const words = new Uint32Array(((bytes.length + 8) >>> 6) + 1 << 4);
  const view = new Uint8Array(words.buffer);
  view.set(bytes);
  view[bytes.length] = 0x80;
  const bitLen = bytes.length * 8;
  words[words.length - 2] = bitLen >>> 0;
  words[words.length - 1] = (bitLen / 0x100000000) >>> 0;

  const K = new Uint32Array(64);
  for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000) >>> 0;

  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let offset = 0; offset < words.length; offset += 16) {
    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let i = 0; i < 64; i++) {
      let f: number;
      let g: number;
      if (i < 16) {
        f = (b & c) | (~b & d);
        g = i;
      } else if (i < 32) {
        f = (d & b) | (~d & c);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        f = b ^ c ^ d;
        g = (3 * i + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * i) % 16;
      }

      const tmp = d;
      d = c;
      c = b;
      const sum = (a + f + K[i] + words[offset + g]) >>> 0;
      b = (b + ((sum << S[i]) | (sum >>> (32 - S[i])))) >>> 0;
      a = tmp;
    }

    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }

  const toHex = (n: number) => {
    const out = new Uint8Array(4);
    out[0] = n & 0xff;
    out[1] = (n >>> 8) & 0xff;
    out[2] = (n >>> 16) & 0xff;
    out[3] = (n >>> 24) & 0xff;
    return Array.from(out, (b) => b.toString(16).padStart(2, "0")).join("");
  };

  return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
}

function requireEnv(env: Env): Env {
  const missing = (
    [
      "SIMPLYBOOK_COMPANY_LOGIN",
      "SIMPLYBOOK_API_KEY",
      "SIMPLYBOOK_API_SECRET",
      "SIMPLYBOOK_LOGIN_URL",
      "SIMPLYBOOK_API_URL",
    ] as const
  ).filter((key) => !env[key]?.trim());

  if (missing.length > 0) {
    throw new Error(`Missing SimplyBook env: ${missing.join(", ")}`);
  }
  return env;
}

async function getToken(env: Env): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  const res = await fetch(env.SIMPLYBOOK_LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "getToken",
      params: [env.SIMPLYBOOK_COMPANY_LOGIN, env.SIMPLYBOOK_API_KEY],
      id: 1,
    }),
  });

  const rawText = await res.text();
  let data: JsonRpcResponse;
  try {
    data = JSON.parse(rawText) as JsonRpcResponse;
  } catch {
    throw new Error(`SimplyBook token: invalid JSON (status ${res.status}): ${rawText.slice(0, 200)}`);
  }

  if (data.error) {
    throw new Error(`SimplyBook token error: ${data.error.message ?? JSON.stringify(data.error)}`);
  }

  const token = String(data.result);
  cachedToken = { value: token, expiresAt: Date.now() + 50 * 60 * 1000 };
  return token;
}

async function rpc(env: Env, method: string, params: unknown[]): Promise<unknown> {
  const token = await getToken(env);

  const res = await fetch(env.SIMPLYBOOK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Company-Login": env.SIMPLYBOOK_COMPANY_LOGIN,
      "X-Token": token,
    },
    body: JSON.stringify({ jsonrpc: "2.0", method, params, id: 1 }),
  });

  const rawText = await res.text();
  let data: JsonRpcResponse;
  try {
    data = JSON.parse(rawText) as JsonRpcResponse;
  } catch {
    throw new Error(`SimplyBook ${method}: invalid JSON (status ${res.status}): ${rawText.slice(0, 200)}`);
  }

  if (data.error) {
    throw new Error(`SimplyBook ${method} error: ${data.error.message ?? JSON.stringify(data.error)}`);
  }
  return data.result;
}

async function confirmIfNeeded(env: Env, result: BookingRpcResult): Promise<BookingRpcResult> {
  if (!result.require_confirm || !env.SIMPLYBOOK_API_SECRET) return result;

  for (const b of result.bookings ?? []) {
    const id = String(b.id);
    const hash = b.hash;
    const sign = md5Hex(`${id}${hash}${env.SIMPLYBOOK_API_SECRET}`);
    await rpc(env, "confirmBooking", [Number(id), sign]);
  }
  return result;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export async function onRequest(context: { request: Request; env: Env }) {
  if (context.request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (context.request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const env = requireEnv(context.env);
    const body = (await context.request.json()) as Record<string, unknown>;
    const { action, ...params } = body;

    if (!action || typeof action !== "string") {
      return jsonResponse({ error: "Missing action" }, 400);
    }

    if (action === "health") {
      await getToken(env);
      return jsonResponse({ ok: true });
    }

    if (action === "slots") {
      const serviceId = Number(params.serviceId);
      const providerId = Number(params.providerId);
      const dateFrom = String(params.dateFrom ?? "");
      const dateTo = String(params.dateTo ?? "");

      if (!serviceId || !providerId || !dateFrom || !dateTo) {
        return jsonResponse({ error: "Missing parameters" }, 400);
      }

      const matrix = (await rpc(env, "getStartTimeMatrix", [
        dateFrom,
        dateTo,
        serviceId,
        providerId,
        1,
      ])) as Record<string, string[]>;

      return jsonResponse({ data: { slotsByDate: matrix ?? {} } });
    }

    if (action === "fields") {
      const serviceId = Number(params.serviceId);
      if (!serviceId) {
        return jsonResponse({ error: "Missing serviceId" }, 400);
      }

      const fields = (await rpc(env, "getAdditionalFields", [serviceId])) as unknown[];
      return jsonResponse({ data: { fields: fields ?? [] } });
    }

    if (action === "book") {
      const serviceId = Number(params.serviceId);
      const providerId = Number(params.providerId);
      const date = String(params.date ?? "");
      const time = String(params.time ?? "");
      const client = params.client as { name?: string; email?: string; phone?: string } | undefined;
      const additional = (params.additional ?? {}) as Record<string, string>;

      if (!serviceId || !providerId || !date || !time || !client?.name || !client?.email || !client?.phone) {
        return jsonResponse({ error: "Missing required booking fields" }, 400);
      }

      let raw = (await rpc(env, "book", [
        serviceId,
        providerId,
        date,
        time,
        client,
        additional,
      ])) as BookingRpcResult;

      raw = await confirmIfNeeded(env, raw);

      type RawBooking = {
        id: string | number;
        code?: string;
        start_date_time?: string;
        end_date_time?: string;
        is_confirmed?: string;
        hash: string;
      };

      const bookings = ((raw.bookings ?? []) as RawBooking[]).map((b) => ({
        id: String(b.id),
        code: b.code ?? "",
        start_date_time: b.start_date_time ?? `${date} ${time}`,
        end_date_time: b.end_date_time ?? "",
        is_confirmed: b.is_confirmed ?? "1",
        hash: b.hash,
      }));

      return jsonResponse({
        data: {
          require_confirm: Boolean(raw.require_confirm),
          bookings,
        },
      });
    }

    return jsonResponse({ error: "Unknown action" }, 404);
  } catch (err) {
    console.error("SimplyBook proxy error:", err);
    return jsonResponse(
      { error: err instanceof Error ? err.message : "API error" },
      502,
    );
  }
};
