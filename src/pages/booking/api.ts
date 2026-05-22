import type { AdditionalField, BookingResult } from './types';

// Direct SimplyBook API client — bypasses broken Edge Function
const SIMPLYBOOK_COMPANY_LOGIN = "goldenyearsportrait2";
const SIMPLYBOOK_API_KEY = "7bcce4caaefa3ee16aac9ef225d6e28eafcb0ee31059fb8c78d72aa9ac7879db";
const SIMPLYBOOK_API_SECRET = "51f5f93c1200350ed1ac95f055b64ff7d0c801b7bd849113993b073a9ec4de43";
const SIMPLYBOOK_LOGIN_URL = "https://user-api.simplybook.me/login/";
const SIMPLYBOOK_API_URL = "https://user-api.simplybook.me/";

type JsonRpcResponse = {
  result?: unknown;
  error?: { message?: string; code?: number | string };
};

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

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

async function simplybookRpc(method: string, params: unknown[]): Promise<unknown> {
  const token = await getToken();

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
  const matrix = (await simplybookRpc("getStartTimeMatrix", [
    dateFrom,
    dateTo,
    serviceId,
    providerId,
    1,
  ])) as Record<string, string[]>;

  return { slotsByDate: matrix ?? {} };
}

export async function fetchAdditionalFields(serviceId: number): Promise<AdditionalField[]> {
  const fields = (await simplybookRpc("getAdditionalFields", [serviceId])) as unknown[];
  return (fields ?? []).map((f) => f as AdditionalField).sort((a, b) => Number(a.pos) - Number(b.pos));
}

export type BookPayload = {
  serviceId: number;
  providerId: number;
  date: string;
  time: string;
  client: { name: string; email: string; phone: string };
  additional: Record<string, string>;
};

type BookingRpcResult = {
  require_confirm?: boolean;
  bookings?: Array<{ id: string | number; hash: string; code?: string; start_date_time?: string; end_date_time?: string; is_confirmed?: string }>;
  id?: string | number;
  hash?: string;
  code?: string;
};

// MD5 helper for confirmBooking
async function md5Hash(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("MD5", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function confirmIfNeeded(result: BookingRpcResult) {
  if (!result.require_confirm || !SIMPLYBOOK_API_SECRET) return result;

  const bookings = result.bookings ?? [];
  for (const b of bookings) {
    const id = String(b.id);
    const hash = b.hash;
    const sign = await md5Hash(`${id}${hash}${SIMPLYBOOK_API_SECRET}`);
    await simplybookRpc("confirmBooking", [Number(id), sign]);
  }
  return result;
}

export async function submitBooking(payload: BookPayload): Promise<BookingResult> {
  let raw = (await simplybookRpc("book", [
    payload.serviceId,
    payload.providerId,
    payload.date,
    payload.time,
    payload.client,
    payload.additional,
  ])) as BookingRpcResult;

  raw = await confirmIfNeeded(raw);

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
    start_date_time: b.start_date_time ?? `${payload.date} ${payload.time}`,
    end_date_time: b.end_date_time ?? "",
    is_confirmed: b.is_confirmed ?? "1",
    hash: b.hash,
  }));

  return {
    require_confirm: Boolean(raw.require_confirm),
    bookings,
  };
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
  // 從最長時間開始優先匹配，避免「精緻韓系」被「基礎」誤匹配
  if (style.includes('訂製')) return 100;
  if (style.includes('精緻') || style.includes('韓系')) return 70;
  if (style.includes('基礎') || style.includes('日常')) return 40;
  return 40; // 預設保守估計
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
    // 非妝髮服務統一提前 5 分鐘抵達
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

/* ── end ── */