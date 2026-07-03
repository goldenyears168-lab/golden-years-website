export type StoreKey = 'zhongshan' | 'gongguan';

export const STORES: { key: StoreKey; label: string }[] = [
  { key: 'zhongshan', label: '中山店' },
  { key: 'gongguan', label: '公館店' },
];

export const DAYS_AHEAD = 14;

/** 官網最短提前預約時間（小時）；須與 DB website_min_booking_lead_hours() 一致 */
export const MIN_BOOKING_LEAD_HOURS = 22;

/** 拍攝前 N 小時內僅能人工取消（線上取消連結不可用） */
export const MIN_ONLINE_CANCEL_HOURS_BEFORE = 24;

export const LINE_OFFICIAL_URL = 'https://line.me/R/ti/p/@goldenyearsphoto';

export const STORAGE_KEY = 'gy_booking_summary';
