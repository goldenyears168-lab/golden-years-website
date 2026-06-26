import { supabase, SUPABASE_URL } from '@/lib/supabase';
import { BookingError, BookingErrorCode } from './domain/errors';
import { getBookingFormFields } from './booking-form-fields';
import { buildBookRpcParams, buildClientFields, STORE_LABELS } from './booking-payload';
import { displayFromServiceEnum, serviceIdToEnum } from './service-mapping';
import type { AdditionalField, BookingResult } from './types';
import type { StoreKey } from './config';

const USE_APPOINTMENTS_V2 = import.meta.env.VITE_USE_APPOINTMENTS_V2 === 'true';

function mapRpcError(message: string): string {
  if (
    message.includes('slot_not_available') ||
    message.includes('已有預約') ||
    message.includes('未開放') ||
    message.includes('無效') ||
    message.includes('請選擇') ||
    message.includes('找不到') ||
    message.includes('slot_not_found') ||
    message.includes('無法取消') ||
    message.includes('請最晚於')
  ) {
    if (message.includes('slot_not_available')) {
      return '此時段剛被預訂，請重新選擇';
    }
    if (message.includes('slot_not_found')) {
      return '找不到此時段，請重新整理後再試';
    }
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

  if (USE_APPOINTMENTS_V2) {
    const { error } = await supabase.rpc('list_available_slots', {
      p_service: 'portrait',
      p_store: '中山店',
      p_date_from: '2099-01-01',
      p_date_to: '2099-01-01',
    });
    if (error) {
      return {
        ok: false,
        backend: 'supabase-v2',
        supabaseConfigured: true,
        diagnostics: error.message,
      };
    }
    return { ok: true, backend: 'supabase-v2', supabaseConfigured: true };
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
  slotIds: Record<string, Record<string, string>>;
};

type SlotRpcEntry = string | { time?: string; appointment_id?: string };

function parseSlotRpcData(data: unknown): SlotsResponse {
  const raw = (data ?? {}) as Record<string, SlotRpcEntry[]>;
  const slotsByDate: Record<string, string[]> = {};
  const slotIds: Record<string, Record<string, string>> = {};

  for (const [date, entries] of Object.entries(raw)) {
    const times: string[] = [];
    const idsForDate: Record<string, string> = {};

    for (const entry of entries ?? []) {
      if (typeof entry === 'string') {
        times.push(entry);
        continue;
      }
      const time = entry.time?.slice(0, 5);
      if (!time) continue;
      times.push(time);
      if (entry.appointment_id) {
        idsForDate[time] = entry.appointment_id;
      }
    }

    if (times.length > 0) {
      slotsByDate[date] = times;
      if (Object.keys(idsForDate).length > 0) {
        slotIds[date] = idsForDate;
      }
    }
  }

  return { slotsByDate, slotIds };
}

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
  if (USE_APPOINTMENTS_V2) {
    const service = serviceIdToEnum(serviceId);
    if (!service) {
      throw new BookingError('無效的服務項目', BookingErrorCode.API_ERROR);
    }

    const { data, error } = await supabase.rpc('list_available_slots', {
      p_service: service,
      p_store: STORE_LABELS[storeKey],
      p_date_from: dateFrom,
      p_date_to: dateTo,
    });

    throwIfRpcError(error);
    return parseSlotRpcData(data);
  }

  const { data, error } = await supabase.rpc('list_website_slots', {
    _service_id: serviceId,
    _store_name: STORE_LABELS[storeKey],
    _date_from: dateFrom,
    _date_to: dateTo,
  });

  throwIfRpcError(error);
  const slotsByDate = (data ?? {}) as Record<string, string[]>;
  return { slotsByDate, slotIds: {} };
}

export async function fetchAdditionalFields(serviceId: number): Promise<AdditionalField[]> {
  return getBookingFormFields(serviceId);
}

export type BookPayload = {
  serviceId: number;
  storeKey: StoreKey;
  date: string;
  time: string;
  appointmentId?: string;
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
  if (USE_APPOINTMENTS_V2) {
    if (!payload.appointmentId) {
      throw new BookingError(
        '找不到此時段，請重新整理後再試',
        BookingErrorCode.API_ERROR,
      );
    }

    const clientFields = buildClientFields(payload);
    const { data, error } = await supabase.rpc('book_slot', {
      p_appointment_id: payload.appointmentId,
      p_client_name: payload.client.name,
      p_client_email: payload.client.email,
      p_client_phone: payload.client.phone,
      p_client_fields: clientFields,
    });

    throwIfRpcError(error);

    const result = data as { code?: string; appointment_id?: string };
    const code = result.code ?? '';
    const appointmentId = result.appointment_id ?? payload.appointmentId;
    const startDateTime = `${payload.date} ${payload.time.slice(0, 5)}`;

    return {
      require_confirm: false,
      bookings: [
        {
          id: appointmentId,
          code,
          start_date_time: startDateTime,
          end_date_time: startDateTime,
          is_confirmed: '1',
          hash: appointmentId,
        },
      ],
    };
  }

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

function mapAppointmentPreview(data: Record<string, unknown>): WebsiteBookingPreview {
  const service = String(data.service ?? '');
  const { shootType, makeupAddon } = displayFromServiceEnum(service);
  const clientFields = (data.client_fields ?? {}) as Record<string, unknown>;
  const makeupFromFields =
    typeof clientFields.makeup_addon === 'string' ? clientFields.makeup_addon : null;

  const serviceIdMap: Record<string, number> = {
    id_photo: 3,
    portrait: 4,
    group_photo: 5,
    id_photo_makeup: 16,
    portrait_makeup: 12,
    group_photo_makeup: 14,
    makeup_only: 17,
  };

  const startsAt = String(data.shoot_datetime ?? data.starts_at ?? '');
  const status = String(data.status ?? '');
  const isCancelled = status === 'available' || status.includes('cancel');

  return {
    id: String(data.id ?? data.booking_uuid ?? ''),
    booking_uuid: String(data.booking_uuid ?? data.id ?? ''),
    code: String(data.code ?? ''),
    store_name: String(data.store_name ?? data.store ?? ''),
    shoot_datetime: startsAt,
    shoot_type: shootType,
    makeup_addon:
      makeupFromFields ?? (makeupAddon !== '不需加購' ? makeupAddon : null),
    service_id: serviceIdMap[service] ?? 0,
    status: isCancelled ? 'cancelled' : status,
    can_cancel: Boolean(data.can_cancel),
    cancel_block_reason:
      typeof data.cancel_block_reason === 'string' ? data.cancel_block_reason : null,
  };
}

export async function fetchBookingByToken(token: string): Promise<WebsiteBookingPreview> {
  if (USE_APPOINTMENTS_V2) {
    const { data, error } = await supabase.rpc('get_appointment', { _token: token });
    throwIfRpcError(error);
    return mapAppointmentPreview((data ?? {}) as Record<string, unknown>);
  }

  const { data, error } = await supabase.rpc('get_website_booking', { _token: token });
  throwIfRpcError(error);
  return data as WebsiteBookingPreview;
}

export async function cancelBookingByToken(token: string): Promise<WebsiteBookingPreview> {
  if (USE_APPOINTMENTS_V2) {
    const { error } = await supabase.rpc('cancel_appointment', { _token: token });
    throwIfRpcError(error);
    return fetchBookingByToken(token);
  }

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

export { USE_APPOINTMENTS_V2 };
