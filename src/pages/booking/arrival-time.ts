/**
 * 預約「建議到店時間」單一來源（官網 booking、Edge Function、ERP 應共用此邏輯）
 *
 * 加購妝髮提前量：40 / 70 / 100 分鐘（與 service-details、妝髮介紹頁一致）
 * 僅攝影、單妝髮：提前 5 分鐘
 */

/** 加購妝髮：拍攝時間前需提前到店的分鐘數 */
export const MAKEUP_EARLY_MINUTES = {
  basic: 40,
  premium: 70,
  custom: 100,
} as const;

/** redesign enum tier → 提前分鐘（basic / standard / premium） */
export type MakeupPlanTier = 'basic' | 'standard' | 'premium';

export const MAKEUP_TIER_EARLY_MINUTES: Record<MakeupPlanTier, number> = {
  basic: 40,
  standard: 70,
  premium: 100,
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

/** 優先讀 client_fields.makeup_plan enum，fallback 中文字串（過渡期） */
export function detectMakeupTier(additional: AdditionalInput): MakeupPlanTier | null {
  if (!additional) return null;

  const values: string[] = [];
  if (Array.isArray(additional)) {
    for (const item of additional) {
      values.push(item.value);
      if (item.title === 'makeup_plan') {
        const tier = parseMakeupPlanTier(item.value);
        if (tier) return tier;
      }
    }
  } else {
    const enumTier = parseMakeupPlanTier(additional.makeup_plan);
    if (enumTier) return enumTier;
    values.push(...Object.values(additional));
  }

  for (const v of values) {
    if (v.includes('訂製')) return 'premium';
    if (v.includes('精緻') || v.includes('韓系')) return 'standard';
    if (v.includes('基礎') || v.includes('日常')) return 'basic';
  }
  return null;
}

export function getMakeupEarlyMinutesForTier(tier: MakeupPlanTier | null): number {
  if (!tier) return DEFAULT_MAKEUP_EARLY_MINUTES;
  return MAKEUP_TIER_EARLY_MINUTES[tier];
}

export function resolveMakeupEarlyMinutes(additional: AdditionalInput): number {
  return getMakeupEarlyMinutesForTier(detectMakeupTier(additional));
}

export function resolveMakeupDurationMinutes(additional: AdditionalInput): number {
  const tier = detectMakeupTier(additional);
  if (!tier) return 30;
  return MAKEUP_TIER_DURATION_MINUTES[tier];
}

/** @deprecated 過渡期：優先使用 detectMakeupTier / resolveMakeupEarlyMinutes */
export function detectMakeupStyle(additional: AdditionalInput): string | null {
  const values: string[] = [];
  if (!additional) return null;
  if (Array.isArray(additional)) {
    values.push(...additional.map((a) => a.value));
  } else {
    values.push(...Object.values(additional));
  }
  for (const v of values) {
    if (v.includes('訂製')) return v;
    if (v.includes('精緻') || v.includes('韓系')) return v;
    if (v.includes('基礎') || v.includes('日常')) return v;
  }
  return null;
}

export function getMakeupEarlyMinutes(style: string | null): number {
  if (!style) return DEFAULT_MAKEUP_EARLY_MINUTES;
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
  const tier = detectMakeupTier(additional);
  if (!tier) return null;

  if (options?.standalone) {
    if (tier === 'premium') return '訂製造型方案（約 1.5 小時）';
    if (tier === 'standard') return '精緻韓系妝髮（約 1 小時）';
    if (tier === 'basic') return '基礎日常妝髮（約 30 分鐘）';
    return null;
  }

  const minutes = getMakeupEarlyMinutesForTier(tier);
  if (tier === 'premium') {
    return `訂製造型方案（提前 ${formatEarlyDuration(minutes)}）`;
  }
  if (tier === 'standard') {
    return `精緻韓系妝髮（提前 ${formatEarlyDuration(minutes)}）`;
  }
  if (tier === 'basic') {
    return `基礎日常妝髮（提前 ${formatEarlyDuration(minutes)}）`;
  }
  return null;
}

/** 加購妝髮表單選項（文案與提前量一致） */
export const ADDON_MAKEUP_OPTIONS = [
  `A.女生基礎妝_加購價800元 請於拍攝時間提前${formatEarlyDurationCompact(MAKEUP_EARLY_MINUTES.basic)}到店`,
  `B.男生基礎妝_加購價600元 請於拍攝時間提前${formatEarlyDurationCompact(MAKEUP_EARLY_MINUTES.basic)}到店`,
  `C.女生精緻妝髮_加購價1500元 請於拍攝時間提前${formatEarlyDurationCompact(MAKEUP_EARLY_MINUTES.premium)}到店`,
  `D.男生精緻妝髮_加購價1200元 請於拍攝時間提前${formatEarlyDurationCompact(MAKEUP_EARLY_MINUTES.premium)}到店`,
  `E.女生訂製妝髮_加購價3000元 請於拍攝時間提前${formatEarlyDurationCompact(MAKEUP_EARLY_MINUTES.custom)}到店`,
] as const;

export const STANDALONE_MAKEUP_OPTIONS = [
  'A. 女生基礎妝 $800（約 30 分鐘）',
  'B. 男生基礎妝 $600（約 30 分鐘）',
  'C. 女生精緻妝髮 $1,500（約 1 小時）',
  'D. 男生精緻妝髮 $1,200（約 1 小時）',
  'E. 女生訂製妝髮 $3,000（約 1.5 小時）',
] as const;
