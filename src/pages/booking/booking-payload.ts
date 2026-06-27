import type { StoreKey } from './config';
import type { AppointmentService } from './service-mapping';

export const STORE_LABELS: Record<StoreKey, string> = {
  zhongshan: '中山店',
  gongguan: '公館店',
};

const SERVICE_META: Record<AppointmentService, { shootType: string; makeupAddon: string }> = {
  id_photo:           { shootType: '證件照', makeupAddon: '不需加購' },
  portrait:           { shootType: '形象照', makeupAddon: '不需加購' },
  group_photo:        { shootType: '合照',   makeupAddon: '不需加購' },
  portrait_makeup:    { shootType: '形象照', makeupAddon: '加購妝髮' },
  group_photo_makeup: { shootType: '合照',   makeupAddon: '加購妝髮' },
  id_photo_makeup:    { shootType: '證件照', makeupAddon: '加購妝髮' },
  makeup_only:        { shootType: '單妝髮', makeupAddon: '加購妝髮' },
};

const MAKEUP_SERVICES = new Set<AppointmentService>([
  'id_photo_makeup',
  'portrait_makeup',
  'group_photo_makeup',
  'makeup_only',
]);

/** 對齊 haoshi-erp/src/shared/lib/makeup/catalog.ts WEBSITE_ADDON_TO_PLAN_ID + tier */
export type MakeupPlanTier = 'basic' | 'standard' | 'premium';

const ADDON_TO_MAKEUP_PLAN_TIER: Record<string, MakeupPlanTier> = {
  女生基礎妝: 'basic',
  男生基礎妝: 'basic',
  女生精緻妝髮: 'standard',
  男生精緻妝髦: 'standard',
  女生訂製妝髮: 'premium',
};

/** SimplyBook / 表單完整選項文案 → 官網短標籤（display） */
const MAKEUP_ADDON_MAP: Record<string, string> = {
  'A.女生基礎妝_加購價800元 請於拍攝時間提前40分鐘到店': '女生基礎妝',
  'B.男生基礎妝_加購價600元 請於拍攝時間提前40分鐘到店': '男生基礎妝',
  'C.女生精緻妝髮_加購價1500元 請於拍攝時間提前1小時10分鐘到店': '女生精緻妝髮',
  'D.男生精緻妝髦_加購價1200元 請於拍攝時間提前1小時10分鐘到店': '男生精緻妝髦',
  'E.女生訂製妝髮_加購價3000元 請於拍攝時間提前1小時40分鐘到店': '女生訂製妝髮',
  'A. 女生基礎妝_加購價800元 請於拍攝時間提前40分鐘到店': '女生基礎妝',
  'B. 男生基礎妝_加購價600元 請於拍攝時間提前40分鐘到店': '男生基礎妝',
  'C. 女生精緻妝髮_加購價1500元 請於拍攝時間提前1小時10分鐘到店': '女生精緻妝髮',
  'D. 男生精緻妝髦_加購價1200元 請於拍攝時間提前1小時10分鐘到店': '男生精緻妝髦',
  'E. 女生訂製妝髮_加購價3000元 請於拍攝時間提前1小時40分鐘到店': '女生訂製妝髮',
  'A. 女生基礎妝 $800（約 30 分鐘）': '女生基礎妝',
  'B. 男生基礎妝 $600（約 30 分鐘）': '男生基礎妝',
  'C. 女生精緻妝髮 $1,500（約 1 小時）': '女生精緻妝髮',
  'D. 男生精緻妝髦 $1,200（約 1 小時）': '男生精緻妝髦',
  'E. 女生訂製妝髮 $3,000（約 1.5 小時）': '女生訂製妝髮',
};

const BUY_MORE_MAP: Record<string, string> = {
  '同一人，額外再加購一張證件照(+399/張)': '加證',
  '同一人，額外再加購一張證件照(+$399/張)': '加證',
  '不同人，也要拍證件照(限不含妝髮，+399/張)': '加一人證',
  '不同人，也要拍證件照(限不含妝髮，+$399/張)': '加一人證',
  '不需再加購': '',
};

function mapMakeupAddon(raw: string | undefined, base: string): string {
  if (!raw?.trim()) return base;
  const mapped = MAKEUP_ADDON_MAP[raw.trim()];
  if (mapped) return mapped;
  if (raw.includes('女生基礎妝')) return '女生基礎妝';
  if (raw.includes('男生基礎妝')) return '男生基礎妝';
  if (raw.includes('女生精緻妝髮')) return '女生精緻妝髮';
  if (raw.includes('男生精緻妝髦')) return '男生精緻妝髦';
  if (raw.includes('女生訂製妝髮')) return '女生訂製妝髮';
  return raw.trim();
}

function mapMakeupPlanTier(addon: string): MakeupPlanTier | null {
  return ADDON_TO_MAKEUP_PLAN_TIER[addon] ?? null;
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

export function buildClientFields(input: {
  service: AppointmentService;
  additional: Record<string, string>;
}): Record<string, unknown> {
  const parsed = parseAdditional(input.additional);
  const fields: Record<string, unknown> = {};

  if (parsed.gender) fields.gender = parsed.gender;
  if (parsed.job_title) fields.job_title = parsed.job_title;
  if (parsed.referral) fields.referral = parsed.referral;
  if (parsed.purpose) fields.purpose = parsed.purpose;
  if (parsed.marketing_duration) fields.marketing_duration = parsed.marketing_duration;
  if (parsed.customer_note) fields.customer_note = parsed.customer_note;
  if (parsed.extra_id_photo) fields.extra_id_photo = parsed.extra_id_photo;
  if (parsed.group_size != null) fields.group_size = parsed.group_size;

  if (MAKEUP_SERVICES.has(input.service) && parsed.makeup_detail) {
    const meta = SERVICE_META[input.service];
    const addon = mapMakeupAddon(parsed.makeup_detail, meta.makeupAddon);
    fields.makeup_addon = addon;
    const tier = mapMakeupPlanTier(addon);
    if (tier) fields.makeup_plan = tier;
  }

  return fields;
}
