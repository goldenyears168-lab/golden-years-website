import { supabase } from '@/lib/supabase';
import { BookingError, BookingErrorCode } from './domain/errors';
import { getBookingFormFields } from './booking-form-fields';
import { buildClientFields, STORE_LABELS } from './booking-payload';
import { displayFromServiceEnum, type AppointmentService } from './service-mapping';
import type { AdditionalField, BookingResult } from './types';
import type { StoreKey } from './config';

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
  service: AppointmentService,
  storeKey: StoreKey,
  dateFrom: string,
  dateTo: string,
): Promise<SlotsResponse> {
  const { data, error } = await supabase.rpc('list_available_slots', {
    p_service: service,
    p_store: STORE_LABELS[storeKey],
    p_date_from: dateFrom,
    p_date_to: dateTo,
  });

  throwIfRpcError(error);
  return parseSlotRpcData(data);
}

export async function fetchAdditionalFields(service: AppointmentService): Promise<AdditionalField[]> {
  return getBookingFormFields(service);
}

export type BookPayload = {
  service: AppointmentService;
  storeKey: StoreKey;
  date: string;
  time: string;
  appointmentId?: string;
  client: { name: string; email: string; phone: string };
  additional: Record<string, string>;
};

export async function submitBooking(payload: BookPayload): Promise<BookingResult> {
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

export type WebsiteBookingPreview = {
  id: string;
  booking_uuid: string;
  code: string;
  store_name: string;
  shoot_datetime: string;
  shoot_type: string;
  makeup_addon: string | null;
  service: AppointmentService;
  status: string;
  can_cancel: boolean;
  cancel_block_reason: string | null;
};

function mapAppointmentPreview(data: Record<string, unknown>): WebsiteBookingPreview {
  const service = String(data.service ?? '') as AppointmentService;
  const { shootType, makeupAddon } = displayFromServiceEnum(service);
  const clientFields = (data.client_fields ?? {}) as Record<string, unknown>;
  const makeupFromFields =
    typeof clientFields.makeup_addon === 'string' ? clientFields.makeup_addon : null;

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
    service,
    status: isCancelled ? 'cancelled' : status,
    can_cancel: Boolean(data.can_cancel),
    cancel_block_reason:
      typeof data.cancel_block_reason === 'string' ? data.cancel_block_reason : null,
  };
}

export async function fetchBookingByToken(token: string): Promise<WebsiteBookingPreview> {
  const { data, error } = await supabase.rpc('get_appointment', { _token: token });
  throwIfRpcError(error);
  return mapAppointmentPreview((data ?? {}) as Record<string, unknown>);
}

export async function cancelBookingByToken(token: string): Promise<WebsiteBookingPreview> {
  const { data, error } = await supabase.rpc('cancel_appointment', { _token: token });
  throwIfRpcError(error);
  const appointmentId = (data as { appointment_id?: string } | null)?.appointment_id;
  return fetchBookingByToken(appointmentId ?? token);
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
  detectMakeupTier,
  getMakeupDurationMinutes,
  getMakeupEarlyMinutes,
  getMakeupStyleLabel,
  isStandaloneMakeupLabel,
  resolveMakeupEarlyMinutes,
  subtractMinutesFromTime,
} from './arrival-time';
