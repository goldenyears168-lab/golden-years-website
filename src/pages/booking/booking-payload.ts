import type { StoreKey } from './config';
import type { AppointmentService } from './service-mapping';
import { displayFromServiceEnum } from './service-mapping';
import { BILLABLE_MAKEUP_PLANS, normalizeMakeupPlan } from '@/shared/makeup-plans';

export const STORE_LABELS: Record<StoreKey, string> = {
  zhongshan: '中山店',
  gongguan: '公館店',
};

const BUY_MORE_MAP: Record<string, string> = {
  '同一人，額外再加購一張證件照(+399/張)': '加證',
  '同一人，額外再加購一張證件照(+$399/張)': '加證',
  '不同人，也要拍證件照(限不含妝髮，+399/張)': '加一人證',
  '不同人，也要拍證件照(限不含妝髮，+$399/張)': '加一人證',
  '不需再加購': '',
};

function mapMakeupLabel(raw: string | undefined): string | null {
  return normalizeMakeupPlan(raw);
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
  p_shoot_type?: string | null;
};

export const MAKEUP_PLAN_REQUIRED_MSG = '請選擇妝髮方案';
export const MAKEUP_PLAN_INVALID_MSG = '妝髮方案無法辨識，請重新選擇';

/** Plan A：shoot_type + makeup_plan SSOT；純拍攝可傳 NULL plan（無妝髮） */
export function buildBookSlotParams(input: {
  service: AppointmentService;
  additional: Record<string, string>;
}): BookSlotColumnParams {
  const parsed = parseAdditional(input.additional);
  const { shootType } = displayFromServiceEnum(input.service);
  const params: BookSlotColumnParams = {
    p_shoot_type: shootType,
  };

  if (parsed.gender) params.p_gender = parsed.gender;
  if (parsed.job_title) params.p_job_title = parsed.job_title;
  if (parsed.referral) params.p_referral = parsed.referral;
  if (parsed.purpose) params.p_purpose = parsed.purpose;
  if (parsed.marketing_duration) params.p_marketing_duration = parsed.marketing_duration;
  if (parsed.customer_note) params.p_appointment_note = parsed.customer_note;
  if (parsed.extra_id_photo) params.p_extra_id_photo = parsed.extra_id_photo;
  if (parsed.group_size != null) params.p_group_size = parsed.group_size;

  if (shootType === '單妝髮') {
    if (!parsed.makeup_detail?.trim()) {
      throw new Error(MAKEUP_PLAN_REQUIRED_MSG);
    }
    const plan = mapMakeupLabel(parsed.makeup_detail);
    if (!plan || !BILLABLE_MAKEUP_PLANS.has(plan)) {
      throw new Error(MAKEUP_PLAN_INVALID_MSG);
    }
    params.p_makeup_plan = plan;
    return params;
  }

  // 拍攝類：有選妝髮才寫 plan；空 / 無妝髮 → NULL
  if (parsed.makeup_detail?.trim()) {
    const plan = mapMakeupLabel(parsed.makeup_detail);
    if (plan && BILLABLE_MAKEUP_PLANS.has(plan)) {
      params.p_makeup_plan = plan;
    } else if (plan) {
      throw new Error(MAKEUP_PLAN_INVALID_MSG);
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
  return fields;
}
