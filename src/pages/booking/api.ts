import type { AdditionalField, BookingResult } from './types';

const SIMPLYBOOK_API =
  (import.meta.env.VITE_SIMPLYBOOK_API as string | undefined)?.trim().replace(/\/$/, '') ||
  '/api/simplybook';

type ProxyBody = Record<string, unknown>;

type ProxySuccess<T> = { data: T };
type ProxyFailure = { error: string };

async function simplybookProxy<T>(body: ProxyBody): Promise<T> {
  const res = await fetch(SIMPLYBOOK_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const contentType = res.headers.get('content-type') ?? '';
  const raw = await res.text();

  if (!contentType.includes('application/json')) {
    throw new Error(
      res.ok
        ? '預約系統回應格式異常，請稍後再試，或聯繫官方 LINE。'
        : `預約系統暫時無法連線（${res.status}），請稍後再試，或聯繫官方 LINE。`,
    );
  }

  let json: Partial<ProxySuccess<T>> & ProxyFailure;
  try {
    json = JSON.parse(raw) as Partial<ProxySuccess<T>> & ProxyFailure;
  } catch {
    throw new Error('預約系統回應格式異常，請稍後再試，或聯繫官方 LINE。');
  }

  if (!res.ok || json.error) {
    throw new Error(json.error ?? `SimplyBook API error (${res.status})`);
  }

  if (!('data' in json) || json.data === undefined) {
    throw new Error('SimplyBook API: empty response');
  }

  return json.data;
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
  const { slotsByDate } = await simplybookProxy<{ slotsByDate: Record<string, string[]> }>({
    action: 'slots',
    serviceId,
    providerId,
    dateFrom,
    dateTo,
  });

  return { slotsByDate: slotsByDate ?? {} };
}

export async function fetchAdditionalFields(serviceId: number): Promise<AdditionalField[]> {
  const { fields } = await simplybookProxy<{ fields: unknown[] }>({
    action: 'fields',
    serviceId,
  });
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

export async function submitBooking(payload: BookPayload): Promise<BookingResult> {
  return simplybookProxy<BookingResult>({
    action: 'book',
    serviceId: payload.serviceId,
    providerId: payload.providerId,
    date: payload.date,
    time: payload.time,
    client: payload.client,
    additional: payload.additional,
  });
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
