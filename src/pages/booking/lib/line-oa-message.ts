import type { BookingSummary } from '../types';

/** 預填訊息第一行格式；line-webhook 以此前綴解析 booking code */
export const BOOKING_CODE_LINE_PREFIX = '預約編號：';

function formatTimePart(t: string): string {
  return t.slice(0, 5);
}

export function buildBookingLinePrefillMessage(summary: BookingSummary): string {
  const { booking, serviceLabel, storeLabel, client, arrivalTime } = summary;
  const start = booking.start_date_time;
  const [datePart, timePart] = start.includes(' ') ? start.split(' ') : [start, ''];
  const timeFormatted = timePart ? formatTimePart(timePart) : '';

  const lines = [
    '【好時有影 · 預約確認】',
    `${BOOKING_CODE_LINE_PREFIX}${booking.code}`,
  ];

  if (client.name?.trim()) {
    lines.push(`姓名：${client.name.trim()}`);
  }
  if (client.phone?.trim()) {
    lines.push(`電話：${client.phone.trim()}`);
  }

  lines.push(`服務：${serviceLabel}`);
  lines.push(`店別：${storeLabel}`);
  lines.push(`日期：${datePart}${timeFormatted ? ` ${timeFormatted}` : ''}`);

  if (arrivalTime?.trim()) {
    lines.push(`建議到店：${datePart} ${arrivalTime.trim()}`);
  }

  lines.push('', '請確認後按傳送，我們將為您綁定 LINE 通知。');

  return lines.join('\n');
}
