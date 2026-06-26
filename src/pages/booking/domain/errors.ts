export const BookingErrorCode = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  SLOTS_UNAVAILABLE: 'SLOTS_UNAVAILABLE',
  FIELDS_LOAD_FAILED: 'FIELDS_LOAD_FAILED',
  SUBMIT_FAILED: 'SUBMIT_FAILED',
  PROVIDER_NOT_FOUND: 'PROVIDER_NOT_FOUND',
  API_ERROR: 'API_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const;

export type BookingErrorCode =
  (typeof BookingErrorCode)[keyof typeof BookingErrorCode];

export class BookingError extends Error {
  code: BookingErrorCode;
  statusCode?: number;

  constructor(message: string, code: BookingErrorCode, statusCode?: number) {
    super(message);
    this.name = 'BookingError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export const BookingErrorMessages: Record<BookingErrorCode, string> = {
  [BookingErrorCode.NETWORK_ERROR]: '網路連線異常，請檢查網路後再試。',
  [BookingErrorCode.SLOTS_UNAVAILABLE]: '查詢可預約時段失敗，請重新整理頁面或聯繫官方 LINE。',
  [BookingErrorCode.FIELDS_LOAD_FAILED]: '無法載入預約表單，請重新整理頁面後再試。',
  [BookingErrorCode.SUBMIT_FAILED]: '預約提交失敗，請稍後再試，或聯繫官方 LINE。',
  [BookingErrorCode.PROVIDER_NOT_FOUND]: '找不到該服務的攝影師資料，請重新選擇分店，或聯繫客服協助。',
  [BookingErrorCode.API_ERROR]: '系統暫時無法處理，請稍後再試。',
  [BookingErrorCode.VALIDATION_ERROR]: '表單資料不完整，請確認後再試。',
};

export function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
