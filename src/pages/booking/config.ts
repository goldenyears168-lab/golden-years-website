export type StoreKey = 'zhongshan' | 'gongguan';

export type ServiceItem = {
  id: number;
  label: string;
  description: string;
  providers: Record<StoreKey, number>;
};

/** 六個服務項目（與 SimplyBook 後台一致） */
export const SERVICES: ServiceItem[] = [
  {
    id: 4,
    label: '形象照',
    description: '專業形象照、求職履歷照、個人寫真（單拍攝無化妝）',
    providers: { zhongshan: 13, gongguan: 18 },
  },
  {
    id: 12,
    label: '加購妝髮 · 形象照',
    description: '形象照搭配專業妝髮服務',
    providers: { zhongshan: 5, gongguan: 19 },
  },
  {
    id: 5,
    label: '合照',
    description: '情侶寫真、朋友合照、寵物合照（單拍攝無化妝）',
    providers: { zhongshan: 13, gongguan: 18 },
  },
  {
    id: 14,
    label: '加購妝髮 · 合照',
    description: '合照搭配專業妝髮服務',
    providers: { zhongshan: 5, gongguan: 19 },
  },
  {
    id: 3,
    label: '證件照',
    description: '韓式證件照、護照照、駕照照（單拍攝無化妝）',
    providers: { zhongshan: 13, gongguan: 18 },
  },
  {
    id: 16,
    label: '加購妝髮 · 證件照',
    description: '證件照搭配專業妝髮服務',
    providers: { zhongshan: 5, gongguan: 19 },
  },
];

export const STORES: { key: StoreKey; label: string }[] = [
  { key: 'zhongshan', label: '中山店' },
  { key: 'gongguan', label: '公館店' },
];

export const DAYS_AHEAD = 14;

export const LINE_OFFICIAL_URL = 'https://line.me/R/ti/p/@614cnqns';

export const STORAGE_KEY = 'gy_booking_summary';