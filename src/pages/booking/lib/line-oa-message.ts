import type { BookingSummary } from '../types';

/**
 * SSOT：haoshi-erp/src/shared/lib/line-oa-message.ts
 * 修改格式時兩邊須同步（haoshi-erp 有 tests/line-oa-message.test.ts）。
 */

/** 預填訊息第一行；line-webhook 以此前綴解析 booking code */
export const BOOKING_CODE_LINE_PREFIX = '預約編號：';

function formatTimePart(t: string): string {
  return t.slice(0, 5);
}

export function buildBookingLinePrefillMessage(summary: BookingSummary): string {
  const { booking, serviceLabel, storeLabel, client } = summary;
  const start = booking.start_date_time;
  const [datePart, timePart] = start.includes(' ') ? start.split(' ') : [start, ''];
  const timeFormatted = timePart ? formatTimePart(timePart) : '';

  const lines: string[] = [`${BOOKING_CODE_LINE_PREFIX}${booking.code}`];

  if (client.name?.trim()) {
    lines.push(`姓名：${client.name.trim()}`);
  }
  if (client.phone?.trim()) {
    lines.push(`電話：${client.phone.trim()}`);
  }

  lines.push(`服務：${serviceLabel}`);
  lines.push(`店別：${storeLabel}`);
  lines.push(`日期：${datePart}${timeFormatted ? ` ${timeFormatted}` : ''}`);

  return lines.join('\n');
}
