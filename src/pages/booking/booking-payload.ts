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

const BILLABLE_MAKEUP_PLANS = new Set([
  '女生基礎妝',
  '男生基礎妝',
  '女生精緻妝髮',
  '男生精緻妝髮',
  '女生訂製妝髮',
]);

/** SimplyBook / 表單完整選項文案 → 短標籤（= DB makeup_plan） */
const MAKEUP_LABEL_MAP: Record<string, string> = {
  'A.女生基礎妝_加購價800元 請於拍攝時間提前40分鐘到店': '女生基礎妝',
  'B.男生基礎妝_加購價600元 請於拍攝時間提前40分鐘到店': '男生基礎妝',
  'C.女生精緻妝髮_加購價1500元 請於拍攝時間提前1小時10分鐘到店': '女生精緻妝髮',
  'D.男生精緻妝髦_加購價1200元 請於拍攝時間提前1小時10分鐘到店': '男生精緻妝髮',
  'E.女生訂製妝髮_加購價3000元 請於拍攝時間提前1小時40分鐘到店': '女生訂製妝髮',
  'A. 女生基礎妝_加購價800元 請於拍攝時間提前40分鐘到店': '女生基礎妝',
  'B. 男生基礎妝_加購價600元 請於拍攝時間提前40分鐘到店': '男生基礎妝',
  'C. 女生精緻妝髮_加購價1500元 請於拍攝時間提前1小時10分鐘到店': '女生精緻妝髮',
  'D. 男生精緻妝髦_加購價1200元 請於拍攝時間提前1小時10分鐘到店': '男生精緻妝髮',
  'E. 女生訂製妝髮_加購價3000元 請於拍攝時間提前1小時40分鐘到店': '女生訂製妝髮',
  'A. 女生基礎妝 $800（約 30 分鐘）': '女生基礎妝',
  'B. 男生基礎妝 $600（約 30 分鐘）': '男生基礎妝',
  'C. 女生精緻妝髮 $1,500（約 1 小時）': '女生精緻妝髮',
  'D. 男生精緻妝髦 $1,200（約 1 小時）': '男生精緻妝髮',
  'E. 女生訂製妝髮 $3,000（約 1.5 小時）': '女生訂製妝髮',
};

const BUY_MORE_MAP: Record<string, string> = {
  '同一人，額外再加購一張證件照(+399/張)': '加證',
  '同一人，額外再加購一張證件照(+$399/張)': '加證',
  '不同人，也要拍證件照(限不含妝髮，+399/張)': '加一人證',
  '不同人，也要拍證件照(限不含妝髮，+$399/張)': '加一人證',
  '不需再加購': '',
};

function mapMakeupLabel(raw: string | undefined, fallback: string): string {
  if (!raw?.trim()) return fallback;
  const mapped = MAKEUP_LABEL_MAP[raw.trim()];
  if (mapped) return mapped;
  if (raw.includes('女生基礎妝')) return '女生基礎妝';
  if (raw.includes('男生基礎妝')) return '男生基礎妝';
  if (raw.includes('女生精緻妝髮')) return '女生精緻妝髮';
  if (raw.includes('男生精緻妝髦')) return '男生精緻妝髮';
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

export type BookSlotColumnParams = {
  p_appointment_note?: string | null;
  p_gender?: string | null;
  p_job_title?: string | null;
  p_referral?: string | null;
  p_purpose?: string | null;
  p_marketing_duration?: string | null;
  p_extra_id_photo?: string | null;
  p_group_size?: number | null;
  p_makeup_plan?: string | null;
};

/** v1.9：canonical book_slot 具名 column 參數 */
export function buildBookSlotParams(input: {
  service: AppointmentService;
  additional: Record<string, string>;
}): BookSlotColumnParams {
  const parsed = parseAdditional(input.additional);
  const params: BookSlotColumnParams = {};

  if (parsed.gender) params.p_gender = parsed.gender;
  if (parsed.job_title) params.p_job_title = parsed.job_title;
  if (parsed.referral) params.p_referral = parsed.referral;
  if (parsed.purpose) params.p_purpose = parsed.purpose;
  if (parsed.marketing_duration) params.p_marketing_duration = parsed.marketing_duration;
  if (parsed.customer_note) params.p_appointment_note = parsed.customer_note;
  if (parsed.extra_id_photo) params.p_extra_id_photo = parsed.extra_id_photo;
  if (parsed.group_size != null) params.p_group_size = parsed.group_size;

  if (MAKEUP_SERVICES.has(input.service) && parsed.makeup_detail) {
    const meta = SERVICE_META[input.service];
    const plan = mapMakeupLabel(parsed.makeup_detail, meta.makeupAddon);
    if (BILLABLE_MAKEUP_PLANS.has(plan)) {
      params.p_makeup_plan = plan;
    }
  }

  return params;
}

/** @deprecated M2 前 bridge 用；新 code 請用 buildBookSlotParams */
export function buildClientFields(input: {
  service: AppointmentService;
  additional: Record<string, string>;
}): Record<string, unknown> {
  const params = buildBookSlotParams(input);
  const fields: Record<string, unknown> = {};
  if (params.p_gender) fields.gender = params.p_gender;
  if (params.p_job_title) fields.job_title = params.p_job_title;
  if (params.p_referral) fields.referral = params.p_referral;
  if (params.p_purpose) fields.purpose = params.p_purpose;
  if (params.p_marketing_duration) fields.marketing_duration = params.p_marketing_duration;
  if (params.p_appointment_note) fields.customer_note = params.p_appointment_note;
  if (params.p_extra_id_photo) fields.extra_id_photo = params.p_extra_id_photo;
  if (params.p_group_size != null) fields.group_size = params.p_group_size;
  if (params.p_makeup_plan) fields.makeup_addon = params.p_makeup_plan;
  return fields;
}
