import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

// ── 優先讀取環境變數，若未設定則使用 fallback 憑證 ──
const FALLBACK_COMPANY = "goldenyearsportrait2";
const FALLBACK_API_KEY = "7bcce4caaefa3ee16aac9ef225d6e28eafcb0ee31059fb8c78d72aa9ac7879db";
const FALLBACK_API_SECRET = "51f5f93c1200350ed1ac95f055b64ff7d0c801b7bd849113993b073a9ec4de43";

const SIMPLYBOOK_COMPANY_LOGIN = Deno.env.get("SIMPLYBOOK_COMPANY_LOGIN") || FALLBACK_COMPANY;
const SIMPLYBOOK_API_KEY = Deno.env.get("SIMPLYBOOK_API_KEY") || FALLBACK_API_KEY;
const SIMPLYBOOK_API_SECRET = Deno.env.get("SIMPLYBOOK_API_SECRET") || FALLBACK_API_SECRET;
const SIMPLYBOOK_LOGIN_URL = Deno.env.get("SIMPLYBOOK_LOGIN_URL") || "https://user-api.simplybook.me/login/";
const SIMPLYBOOK_API_URL = Deno.env.get("SIMPLYBOOK_API_URL") || "https://user-api.simplybook.me/";

type JsonRpcResponse = {
  result?: unknown;
  error?: { message?: string; code?: number | string };
};

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  console.log("[SimplyBook] Fetching token... company:", SIMPLYBOOK_COMPANY_LOGIN, "apiKey length:", SIMPLYBOOK_API_KEY.length);
  const res = await fetch(SIMPLYBOOK_LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "getToken",
      params: [SIMPLYBOOK_COMPANY_LOGIN, SIMPLYBOOK_API_KEY],
      id: 1,
    }),
  });

  const rawText = await res.text();
  console.log("[SimplyBook] Token response status:", res.status, "body:", rawText.slice(0, 500));
  let data: JsonRpcResponse;
  try {
    data = JSON.parse(rawText) as JsonRpcResponse;
  } catch {
    throw new Error(`SimplyBook token: invalid JSON (status ${res.status}): ${rawText.slice(0, 500)}`);
  }

  if (data.error) {
    throw new Error(`SimplyBook token error: ${JSON.stringify(data.error)}`);
  }
  const token = String(data.result);
  cachedToken = { value: token, expiresAt: Date.now() + 50 * 60 * 1000 };
  console.log("[SimplyBook] Token obtained successfully, length:", token.length);
  return token;
}

async function rpc(method: string, params: unknown[]): Promise<unknown> {
  const token = await getToken();

  console.log("[SimplyBook] RPC call:", method, "params:", JSON.stringify(params).slice(0, 200));
  const res = await fetch(SIMPLYBOOK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Company-Login": SIMPLYBOOK_COMPANY_LOGIN,
      "X-Token": token,
    },
    body: JSON.stringify({ jsonrpc: "2.0", method, params, id: 1 }),
  });

  const rawText = await res.text();
  console.log("[SimplyBook] RPC response status:", res.status, "body:", rawText.slice(0, 500));
  let data: JsonRpcResponse;
  try {
    data = JSON.parse(rawText) as JsonRpcResponse;
  } catch {
    throw new Error(`SimplyBook ${method}: invalid JSON (status ${res.status}): ${rawText.slice(0, 500)}`);
  }

  if (data.error) {
    throw new Error(`SimplyBook ${method} error: ${JSON.stringify(data.error)}`);
  }
  return data.result;
}

type BookingRpcResult = {
  require_confirm?: boolean;
  bookings?: Array<{ id: string | number; hash: string; code?: string; start_date_time?: string; end_date_time?: string; is_confirmed?: string }>;
  id?: string | number;
  hash?: string;
  code?: string;
};

// ── 簡化版：暫時不使用 MD5 確認，直接回傳原始結果 ──
async function confirmIfNeeded(result: BookingRpcResult) {
  if (!result.require_confirm || !SIMPLYBOOK_API_SECRET) return result;
  console.log("[SimplyBook] Booking requires confirmation but auto-confirm is disabled. Returning raw result.");
  return result;
}

serve(async (req) => {
  console.log("[EdgeFunction] Request received:", req.method, req.url);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // ── GET 健康檢查：最簡單的連線測試 ──
  if (req.method === "GET") {
    const url = new URL(req.url);
    const path = url.pathname;
    console.log("[EdgeFunction] GET request path:", path);

    const credsStatus = {
      company: SIMPLYBOOK_COMPANY_LOGIN,
      apiKeySet: !!SIMPLYBOOK_API_KEY,
      apiSecretSet: !!SIMPLYBOOK_API_SECRET,
      apiKeyLength: SIMPLYBOOK_API_KEY.length,
      usingFallback: SIMPLYBOOK_API_KEY === FALLBACK_API_KEY,
    };
    console.log("[EdgeFunction] Health check:", JSON.stringify(credsStatus));

    return new Response(
      JSON.stringify({ ok: true, message: "Edge Function is running", ...credsStatus }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.json();
    console.log("[EdgeFunction] Request body:", JSON.stringify(body).slice(0, 300));
    const { action, ...params } = body as Record<string, unknown>;

    if (!action) {
      return new Response(
        JSON.stringify({ message: "Missing action", error: "Missing action" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "health") {
      const credsStatus = {
        company: SIMPLYBOOK_COMPANY_LOGIN,
        apiKeySet: !!SIMPLYBOOK_API_KEY,
        apiSecretSet: !!SIMPLYBOOK_API_SECRET,
        apiKeyLength: SIMPLYBOOK_API_KEY.length,
        usingFallback: SIMPLYBOOK_API_KEY === FALLBACK_API_KEY,
      };
      console.log("[EdgeFunction] Health check:", JSON.stringify(credsStatus));
      return new Response(
        JSON.stringify({ ok: true, ...credsStatus }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "slots") {
      const serviceId = Number(params.serviceId);
      const providerId = Number(params.providerId);
      const dateFrom = String(params.dateFrom ?? "");
      const dateTo = String(params.dateTo ?? "");

      if (!serviceId || !providerId || !dateFrom || !dateTo) {
        return new Response(
          JSON.stringify({ message: "Missing parameters", error: "Missing parameters" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("[EdgeFunction] Fetching slots for service", serviceId, "provider", providerId, "from", dateFrom, "to", dateTo);
      const matrix = (await rpc("getStartTimeMatrix", [
        dateFrom,
        dateTo,
        serviceId,
        providerId,
        1,
      ])) as Record<string, string[]>;

      return new Response(
        JSON.stringify({ data: { slotsByDate: matrix ?? {} } }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "fields") {
      const serviceId = Number(params.serviceId);
      if (!serviceId) {
        return new Response(
          JSON.stringify({ message: "Missing serviceId", error: "Missing serviceId" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const fields = (await rpc("getAdditionalFields", [serviceId])) as unknown[];
      return new Response(
        JSON.stringify({ data: { fields: fields ?? [] } }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "book") {
      const serviceId = Number(params.serviceId);
      const providerId = Number(params.providerId);
      const date = String(params.date ?? "");
      const time = String(params.time ?? "");
      const client = params.client as { name?: string; email?: string; phone?: string } | undefined;
      const additional = (params.additional ?? {}) as Record<string, string>;

      if (!serviceId || !providerId || !date || !time || !client?.name || !client?.email || !client?.phone) {
        return new Response(
          JSON.stringify({ message: "Missing required booking fields", error: "Missing required booking fields" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      let raw = (await rpc("book", [
        serviceId,
        providerId,
        date,
        time,
        client,
        additional,
      ])) as BookingRpcResult;

      raw = await confirmIfNeeded(raw);

      const bookings = (raw.bookings ?? []).map((b) => ({
        id: String(b.id),
        code: b.code ?? "",
        start_date_time: b.start_date_time ?? `${date} ${time}`,
        end_date_time: b.end_date_time ?? "",
        is_confirmed: b.is_confirmed ?? "1",
        hash: b.hash,
      }));

      return new Response(
        JSON.stringify({
          data: {
            require_confirm: Boolean(raw.require_confirm),
            bookings,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Unknown action", error: "Unknown action" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[EdgeFunction] Caught error:", err);
    const errMsg = err instanceof Error ? err.message : "API error";
    const errStack = err instanceof Error ? err.stack : undefined;
    return new Response(
      JSON.stringify({
        message: errMsg,
        error: errMsg,
        details: errStack,
      }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
