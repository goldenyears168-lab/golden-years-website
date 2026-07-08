/**
 * 預約「建議到店時間」單一來源（官網 booking、Edge Function、ERP 應共用此邏輯）
 *
 * 加購妝髮提前量：來自 makeup-plans catalog（40 / 70 / 100 分鐘）
 * 僅攝影、單妝髮：提前 5 分鐘
 */

import {
  getMakeupPlan,
  MAKEUP_PLAN_CATALOG,
  normalizeMakeupPlan,
  type MakeupPlanId,
} from '@/shared/makeup-plans';

/** 妝髮方案表單欄位 name（與 booking-form-fields 一致） */
export const MAKEUP_PLAN_FIELD_NAME = 'data_field_4';

/** 加購妝髮：拍攝時間前需提前到店的分鐘數（tier 分組，deprecated path 用） */
export const MAKEUP_EARLY_MINUTES = {
  basic: MAKEUP_PLAN_CATALOG[0].earlyMin,
  premium: MAKEUP_PLAN_CATALOG[2].earlyMin,
  custom: MAKEUP_PLAN_CATALOG[4].earlyMin,
} as const;

/** redesign enum tier → 提前分鐘（basic / standard / premium） */
export type MakeupPlanTier = 'basic' | 'standard' | 'premium';

export const MAKEUP_TIER_EARLY_MINUTES: Record<MakeupPlanTier, number> = {
  basic: MAKEUP_EARLY_MINUTES.basic,
  standard: MAKEUP_EARLY_MINUTES.premium,
  premium: MAKEUP_EARLY_MINUTES.custom,
};

export const MAKEUP_TIER_DURATION_MINUTES: Record<MakeupPlanTier, number> = {
  basic: 30,
  standard: 60,
  premium: 90,
};

export const PHOTO_ONLY_EARLY_MINUTES = 5;
export const STANDALONE_MAKEUP_EARLY_MINUTES = 5;

/** 無法辨識妝髮方案時的預設提前量 */
export const DEFAULT_MAKEUP_EARLY_MINUTES = MAKEUP_EARLY_MINUTES.basic;

type AdditionalInput =
  | Record<string, string>
  | { title: string; value: string }[]
  | null
  | undefined;

function formatStandaloneDuration(durationMin: number): string {
  if (durationMin <= 30) return '30 分鐘';
  if (durationMin <= 60) return '1 小時';
  if (durationMin === 90) return '1.5 小時';
  return formatEarlyDuration(durationMin);
}

/** 人類可讀：40 分鐘、1 小時 10 分鐘 */
export function formatEarlyDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} 分鐘`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h} 小時`;
  return `${h} 小時 ${m} 分鐘`;
}

/** 表單選項用緊湊格式：40分鐘、1小時10分鐘 */
export function formatEarlyDurationCompact(minutes: number): string {
  if (minutes < 60) return `${minutes}分鐘`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h}小時`;
  return `${h}小時${m}分鐘`;
}

export function isStandaloneMakeupLabel(label: string): boolean {
  return label.includes('單妝髮');
}

export function parseMakeupPlanTier(value: string | null | undefined): MakeupPlanTier | null {
  const v = value?.trim();
  if (v === 'basic' || v === 'standard' || v === 'premium') return v;
  return null;
}

function tierFromPlanId(planId: MakeupPlanId): MakeupPlanTier {
  if (planId === '女生訂製妝髮') return 'premium';
  if (planId === '女生精緻妝髮' || planId === '男生精緻妝髮') return 'standard';
  return 'basic';
}

/** 只讀妝髮方案欄位（data_field_4），避免其他 free-text 欄位誤觸發關鍵字比對 */
export function extractMakeupFieldValue(additional: AdditionalInput): string | null {
  if (!additional) return null;

  if (Array.isArray(additional)) {
    const byTitle = additional.find(
      (item) => item.title === '妝髮方案' || item.title.includes('妝髮方案'),
    );
    if (byTitle?.value.trim()) return byTitle.value.trim();
    return null;
  }

  const raw = additional[MAKEUP_PLAN_FIELD_NAME];
  return raw?.trim() ? raw.trim() : null;
}

export function detectMakeupPlanFromAdditional(
  additional: AdditionalInput,
): ReturnType<typeof normalizeMakeupPlan> {
  if (!additional) return null;

  if (!Array.isArray(additional)) {
    const enumTier = parseMakeupPlanTier(additional.makeup_plan);
    if (enumTier) {
      // enum tier → 取該 tier 第一個 catalog plan（僅供過渡期 RPC 回讀）
      if (enumTier === 'premium') return '女生訂製妝髮';
      if (enumTier === 'standard') return '女生精緻妝髮';
      return '女生基礎妝';
    }
  }

  const raw = extractMakeupFieldValue(additional);
  if (!raw) return null;
  return normalizeMakeupPlan(raw);
}

/** 優先讀 client_fields.makeup_plan enum，否則從妝髮方案欄位解析 */
export function detectMakeupTier(additional: AdditionalInput): MakeupPlanTier | null {
  if (!additional) return null;

  if (!Array.isArray(additional)) {
    const enumTier = parseMakeupPlanTier(additional.makeup_plan);
    if (enumTier) return enumTier;
  } else {
    for (const item of additional) {
      if (item.title === 'makeup_plan') {
        const tier = parseMakeupPlanTier(item.value);
        if (tier) return tier;
      }
    }
  }

  const planId = detectMakeupPlanFromAdditional(additional);
  return planId ? tierFromPlanId(planId) : null;
}

export function getMakeupEarlyMinutesForTier(tier: MakeupPlanTier | null): number {
  if (!tier) return DEFAULT_MAKEUP_EARLY_MINUTES;
  return MAKEUP_TIER_EARLY_MINUTES[tier];
}

export function resolveMakeupEarlyMinutes(additional: AdditionalInput): number {
  const planId = detectMakeupPlanFromAdditional(additional);
  if (planId) return getMakeupPlan(planId).earlyMin;
  return DEFAULT_MAKEUP_EARLY_MINUTES;
}

export function resolveMakeupDurationMinutes(additional: AdditionalInput): number {
  const planId = detectMakeupPlanFromAdditional(additional);
  if (planId) return getMakeupPlan(planId).durationMin;
  const tier = detectMakeupTier(additional);
  if (!tier) return 30;
  return MAKEUP_TIER_DURATION_MINUTES[tier];
}

/** @deprecated 過渡期：優先使用 detectMakeupTier / resolveMakeupEarlyMinutes */
export function detectMakeupStyle(additional: AdditionalInput): string | null {
  return extractMakeupFieldValue(additional);
}

export function getMakeupEarlyMinutes(style: string | null): number {
  if (!style) return DEFAULT_MAKEUP_EARLY_MINUTES;
  const planId = normalizeMakeupPlan(style);
  if (planId) return getMakeupPlan(planId).earlyMin;
  if (style.includes('訂製')) return MAKEUP_EARLY_MINUTES.custom;
  if (style.includes('精緻') || style.includes('韓系')) return MAKEUP_EARLY_MINUTES.premium;
  if (style.includes('基礎') || style.includes('日常')) return MAKEUP_EARLY_MINUTES.basic;
  return DEFAULT_MAKEUP_EARLY_MINUTES;
}

/** 單妝髮預約時段長度（分鐘），用於排程重疊計算 */
export function getMakeupDurationMinutes(additional: AdditionalInput): number {
  return resolveMakeupDurationMinutes(additional);
}

export function subtractMinutesFromTime(time: string, minutes: number): string {
  const timePart = time.trim().split(' ').pop() ?? time;
  const [hStr, mStr] = timePart.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return timePart.slice(0, 5);

  const total = h * 60 + m - minutes;
  const wrapped = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const newH = Math.floor(wrapped / 60);
  const newM = wrapped % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

/**
 * 官網「建議到店時間」（HH:mm）
 * @param slotTime 拍攝／妝髮開始時間
 * @param variantLabel 服務方案 label（含「妝髮」「單妝髮」等關鍵字）
 */
export function calculateArrivalTime(
  slotTime: string,
  variantLabel: string,
  additional: AdditionalInput,
): string | null {
  const timePart = slotTime.split(' ').pop() ?? slotTime;
  const [hStr, mStr] = timePart.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;

  let earlyMinutes: number;
  if (isStandaloneMakeupLabel(variantLabel)) {
    earlyMinutes = STANDALONE_MAKEUP_EARLY_MINUTES;
  } else if (variantLabel.includes('妝髮')) {
    earlyMinutes = resolveMakeupEarlyMinutes(additional);
  } else {
    earlyMinutes = PHOTO_ONLY_EARLY_MINUTES;
  }

  return subtractMinutesFromTime(timePart, earlyMinutes);
}

export function getMakeupStyleLabel(
  additional: AdditionalInput,
  options?: { standalone?: boolean },
): string | null {
  const planId = detectMakeupPlanFromAdditional(additional);
  if (!planId) return null;

  const plan = getMakeupPlan(planId);
  if (options?.standalone) {
    return `${planId}（約 ${formatEarlyDuration(plan.durationMin)}）`;
  }
  return `${planId}（提前 ${formatEarlyDuration(plan.earlyMin)}）`;
}

/** 加購妝髮表單選項（由 catalog 產生，與提前量一致） */
export const ADDON_MAKEUP_OPTIONS = MAKEUP_PLAN_CATALOG.map(
  (p) =>
    `${p.letter}.${p.id}_加購價${p.price}元 請於拍攝時間提前${formatEarlyDurationCompact(p.earlyMin)}到店`,
);

/** 純妝髮表單選項（由 catalog 產生） */
export const STANDALONE_MAKEUP_OPTIONS = MAKEUP_PLAN_CATALOG.map(
  (p) =>
    `${p.letter}. ${p.id} $${p.price.toLocaleString('en-US')}（約 ${formatStandaloneDuration(p.durationMin)}）`,
);
