import { supabase, SUPABASE_URL } from '@/lib/supabase';
import { BookingError, BookingErrorCode } from './domain/errors';
import { getBookingFormFields } from './booking-form-fields';
import { buildBookRpcParams, STORE_LABELS } from './booking-payload';
import type { AdditionalField, BookingResult } from './types';
import type { StoreKey } from './config';

function mapRpcError(message: string): string {
  if (
    message.includes('已有預約') ||
    message.includes('未開放') ||
    message.includes('無效') ||
    message.includes('請選擇') ||
    message.includes('找不到') ||
    message.includes('無法取消') ||
    message.includes('請最晚於')
  ) {
    return message;
  }
  return message || '預約系統暫時無法處理您的請求，請稍後再試，或聯繫官方 LINE。';
}

function throwIfRpcError(error: { message: string } | null): void {
  if (!error) return;
  throw new BookingError(mapRpcError(error.message), BookingErrorCode.API_ERROR);
}

export async function healthCheck(): Promise<{
  ok: boolean;
  backend?: string;
  supabaseConfigured?: boolean;
  diagnostics?: string;
}> {
  const configured = Boolean(SUPABASE_URL && import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY);
  if (!configured) {
    return { ok: false, supabaseConfigured: false, diagnostics: 'Supabase 未設定' };
  }

  const { error } = await supabase.rpc('list_website_slots', {
    _service_id: 4,
    _store_name: '中山店',
    _date_from: '2099-01-01',
    _date_to: '2099-01-01',
  });

  if (error) {
    return {
      ok: false,
      backend: 'supabase',
      supabaseConfigured: true,
      diagnostics: error.message,
    };
  }

  return { ok: true, backend: 'supabase', supabaseConfigured: true };
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
  storeKey: StoreKey,
  dateFrom: string,
  dateTo: string,
): Promise<SlotsResponse> {
  const { data, error } = await supabase.rpc('list_website_slots', {
    _service_id: serviceId,
    _store_name: STORE_LABELS[storeKey],
    _date_from: dateFrom,
    _date_to: dateTo,
  });

  throwIfRpcError(error);

  const slotsByDate = (data ?? {}) as Record<string, string[]>;
  return { slotsByDate };
}

export async function fetchAdditionalFields(serviceId: number): Promise<AdditionalField[]> {
  return getBookingFormFields(serviceId);
}

export type BookPayload = {
  serviceId: number;
  storeKey: StoreKey;
  date: string;
  time: string;
  client: { name: string; email: string; phone: string };
  additional: Record<string, string>;
};

type BookRpcResult = {
  id: string;
  code: string;
  start_date_time: string;
  end_date_time: string;
  is_confirmed: string;
};

export async function submitBooking(payload: BookPayload): Promise<BookingResult> {
  const params = buildBookRpcParams(payload);
  const { data, error } = await supabase.rpc('book_website_slot', params);

  throwIfRpcError(error);

  const booking = data as BookRpcResult;
  return {
    require_confirm: false,
    bookings: [
      {
        ...booking,
        hash: booking.id,
      },
    ],
  };
}

export type WebsiteBookingPreview = {
  id: string;
  booking_uuid: string;
  code: string;
  store_name: string;
  shoot_datetime: string;
  shoot_type: string;
  makeup_addon: string | null;
  service_id: number;
  status: string;
  can_cancel: boolean;
  cancel_block_reason: string | null;
};

export async function fetchBookingByToken(token: string): Promise<WebsiteBookingPreview> {
  const { data, error } = await supabase.rpc('get_website_booking', { _token: token });
  throwIfRpcError(error);
  return data as WebsiteBookingPreview;
}

export async function cancelBookingByToken(token: string): Promise<WebsiteBookingPreview> {
  const { data, error } = await supabase.rpc('cancel_website_booking', { _token: token });
  throwIfRpcError(error);
  return data as WebsiteBookingPreview;
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

export {
  ADDON_MAKEUP_OPTIONS,
  STANDALONE_MAKEUP_OPTIONS,
  calculateArrivalTime,
  detectMakeupStyle,
  getMakeupDurationMinutes,
  getMakeupEarlyMinutes,
  getMakeupStyleLabel,
  isStandaloneMakeupLabel,
  subtractMinutesFromTime,
} from './arrival-time';
