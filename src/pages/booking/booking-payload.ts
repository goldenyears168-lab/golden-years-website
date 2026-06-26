import type { StoreKey } from './config';

export const STORE_LABELS: Record<StoreKey, string> = {
  zhongshan: '中山店',
  gongguan: '公館店',
};

const SERVICE_META: Record<number, { shootType: string; makeupAddon: string }> = {
  3: { shootType: '證件照', makeupAddon: '不需加購' },
  4: { shootType: '形象照', makeupAddon: '不需加購' },
  5: { shootType: '合照', makeupAddon: '不需加購' },
  12: { shootType: '形象照', makeupAddon: '加購妝髮' },
  14: { shootType: '合照', makeupAddon: '加購妝髮' },
  16: { shootType: '證件照', makeupAddon: '加購妝髮' },
  17: { shootType: '單妝髮', makeupAddon: '加購妝髮' },
};

const MAKEUP_ADDON_MAP: Record<string, string> = {
  'A. 女生基礎妝_加購價800元 請於拍攝時間提前40分鐘到店': '女生基礎妝',
  'B. 男生基礎妝_加購價600元 請於拍攝時間提前40分鐘到店': '男生基礎妝',
  'C. 女生精緻妝髮_加購價1500元 請於拍攝時間提前1小時10分鐘到店': '女生精緻妝髮',
  'D. 男生精緻妝髮_加購價1200元 請於拍攝時間提前1小時10分鐘到店': '男生精緻妝髮',
  'E. 女生訂製妝髮_加購價3000元 請於拍攝時間提前1小時40分鐘到店': '女生訂製妝髮',
  'A. 女生基礎妝_加購價800元 請於拍攝時間提前45分鐘到店': '女生基礎妝',
  'B. 男生基礎妝_加購價600元 請於拍攝時間提前45分鐘到店': '男生基礎妝',
  'C.女生精緻妝髮_加購價1500元 請於拍攝時間提前1小時15分鐘到店': '女生精緻妝髮',
  'C. 女生精緻妝髮_加購價1500元 請於拍攝時間提前1小時15分鐘到店': '女生精緻妝髮',
  'D.男生精緻妝髮_加購價1200元 請於拍攝時間提前1小時15分鐘到店': '男生精緻妝髮',
  'D. 男生精緻妝髮_加購價1200元 請於拍攝時間提前1小時15分鐘到店': '男生精緻妝髮',
  'E.女生訂製妝髮_加購價3000元 請於拍攝時間提前2小時到店': '女生訂製妝髮',
  'E. 女生訂製妝髮_加購價3000元 請於拍攝時間提前2小時到店': '女生訂製妝髮',
  'A. 女生基礎妝 $800（約 30 分鐘）': '女生基礎妝',
  'B. 男生基礎妝 $600（約 30 分鐘）': '男生基礎妝',
  'C. 女生精緻妝髮 $1,500（約 1 小時）': '女生精緻妝髮',
  'D. 男生精緻妝髮 $1,200（約 1 小時）': '男生精緻妝髮',
  'E. 女生訂製妝髮 $3,000（約 1.5 小時）': '女生訂製妝髮',
};

const BUY_MORE_MAP: Record<string, string> = {
  '同一人，額外再加購一張證件照(+399/張)': '加證',
  '不同人，也要拍證件照(限不含妝髮，+399/張)': '加一人證',
  '不需再加購': '',
};

function mapMakeupAddon(raw: string | undefined, base: string): string {
  if (!raw?.trim()) return base;
  const mapped = MAKEUP_ADDON_MAP[raw.trim()];
  if (mapped) return mapped;
  if (raw.includes('女生基礎妝')) return '女生基礎妝';
  if (raw.includes('男生基礎妝')) return '男生基礎妝';
  if (raw.includes('女生精緻妝髮')) return '女生精緻妝髮';
  if (raw.includes('男生精緻妝髮')) return '男生精緻妝髮';
  if (raw.includes('女生訂製妝髮')) return '女生訂製妝髮';
  return raw.trim();
}

function parseAdditional(additional: Record<string, string> | undefined) {
  const a = additional ?? {};
  const buyMoreRaw = a.data_field_7 ?? '';
  const groupRaw = a.data_field_8 ?? '';
  const groupSize = groupRaw ? Number.parseInt(groupRaw, 10) : null;

  return {
    gender: a.data_field_1 ?? null,
    job_title: a.data_field_2 ?? null,
    referral: a.data_field_3 ?? null,
    purpose: a.data_field_9 ?? null,
    marketing_duration: a.data_field_10 ?? null,
    customer_note: a.data_field_5 ?? null,
    extra_id_photo: BUY_MORE_MAP[buyMoreRaw] ?? buyMoreRaw ?? null,
    group_size: Number.isFinite(groupSize) ? groupSize : null,
    makeup_detail: a.data_field_4 ?? null,
  };
}

export type BookRpcParams = {
  _service_id: number;
  _store_name: string;
  _slot_date: string;
  _slot_time: string;
  _client_name: string;
  _client_email: string;
  _client_phone: string;
  _shoot_type: string;
  _makeup_addon: string;
  _gender: string | null;
  _job_title: string | null;
  _referral: string | null;
  _purpose: string | null;
  _marketing_duration: string | null;
  _customer_note: string | null;
  _extra_id_photo: string | null;
  _group_size: number | null;
  _raw_data: Record<string, unknown>;
};

export function buildBookRpcParams(input: {
  serviceId: number;
  storeKey: StoreKey;
  date: string;
  time: string;
  client: { name: string; email: string; phone: string };
  additional: Record<string, string>;
}): BookRpcParams {
  const meta = SERVICE_META[input.serviceId];
  if (!meta) {
    throw new Error('無效的服務項目');
  }

  const parsed = parseAdditional(input.additional);
  const usesMakeupField = [12, 14, 16, 17].includes(input.serviceId);
  const makeupAddon = usesMakeupField
    ? mapMakeupAddon(parsed.makeup_detail ?? undefined, meta.makeupAddon)
    : meta.makeupAddon;

  return {
    _service_id: input.serviceId,
    _store_name: STORE_LABELS[input.storeKey],
    _slot_date: input.date,
    _slot_time: input.time.trim().slice(0, 5),
    _client_name: input.client.name,
    _client_email: input.client.email,
    _client_phone: input.client.phone,
    _shoot_type: meta.shootType,
    _makeup_addon: makeupAddon,
    _gender: parsed.gender,
    _job_title: parsed.job_title,
    _referral: parsed.referral,
    _purpose: parsed.purpose,
    _marketing_duration: parsed.marketing_duration,
    _customer_note: parsed.customer_note,
    _extra_id_photo: parsed.extra_id_photo,
    _group_size: parsed.group_size,
    _raw_data: { client: input.client, additional: input.additional, source: 'website' },
  };
}
