// AUTO-GENERATED from haoshi-erp/src/shared/catalog/makeup-plans.ts — DO NOT EDIT
// Regenerate: cd haoshi-erp && npm run sync-catalog

/**
 * 妝髮方案 Catalog — SSOT（全 repo 唯一來源，無 path alias 依賴）
 *
 * 消費方：
 *   - ERP：src/shared/catalog/makeup-plans.ts（本檔）
 *   - 官網：golden-years-website/src/shared/makeup-plans.ts（npm run sync-catalog）
 *   - Edge：send-booking-emails/makeup-plans.ts（npm run sync-catalog）
 */

export const MAKEUP_PLAN_CATALOG = [
  {
    id: '女生基礎妝',
    letter: 'A',
    price: 800,
    durationMin: 30,
    earlyMin: 40,
    tagline: '適合無化妝習慣者，提亮氣色',
  },
  {
    id: '男生基礎妝',
    letter: 'B',
    price: 600,
    durationMin: 30,
    earlyMin: 40,
    tagline: '適合所有男性，乾淨俐落',
  },
  {
    id: '女生精緻妝髮',
    letter: 'C',
    price: 1500,
    durationMin: 60,
    earlyMin: 70,
    tagline: '適合約會、面試、重要場合，妝感精緻',
    popular: true,
  },
  {
    id: '男生精緻妝髮',
    letter: 'D',
    price: 1200,
    durationMin: 60,
    earlyMin: 70,
    tagline: '體驗精緻底妝與髮型設計',
  },
  {
    id: '女生訂製妝髮',
    letter: 'E',
    price: 3000,
    durationMin: 90,
    earlyMin: 100,
    tagline: '客製造型，適合重要宴會',
  },
] as const;

export type MakeupPlanId = (typeof MAKEUP_PLAN_CATALOG)[number]['id'];

/** 官網行銷頁用（letter 對應表單 A–E） */
export const MAKEUP_PLANS = MAKEUP_PLAN_CATALOG.map((plan) => ({
  id: plan.id,
  label: plan.letter,
  price: plan.price,
  durationMin: plan.durationMin,
  earlyMin: plan.earlyMin,
  tagline: plan.tagline,
  ...('popular' in plan ? { popular: plan.popular } : {}),
}));

export const BILLABLE_MAKEUP_PLANS = new Set<string>(
  MAKEUP_PLAN_CATALOG.map((p) => p.id),
);

const PLAN_LETTERS = ['A', 'B', 'C', 'D', 'E'] as const;

const DURATION_LABEL: Record<MakeupPlanId, string> = {
  女生基礎妝: '30min',
  男生基礎妝: '30min',
  女生精緻妝髮: '1hr',
  男生精緻妝髮: '1hr',
  女生訂製妝髮: '1.5hr',
};

/** SimplyBook / 表單完整選項文案 → canonical DB makeup_plan 值 */
export const MAKEUP_LABEL_MAP: Record<string, MakeupPlanId> = {
  'A.女生基礎妝_加購價800元 請於拍攝時間提前40分鐘到店': '女生基礎妝',
  'B.男生基礎妝_加購價600元 請於拍攝時間提前40分鐘到店': '男生基礎妝',
  'C.女生精緻妝髮_加購價1500元 請於拍攝時間提前1小時10分鐘到店': '女生精緻妝髮',
  'D.男生精緻妝髮_加購價1200元 請於拍攝時間提前1小時10分鐘到店': '男生精緻妝髮',
  'E.女生訂製妝髮_加購價3000元 請於拍攝時間提前1小時40分鐘到店': '女生訂製妝髮',
  'A. 女生基礎妝_加購價800元 請於拍攝時間提前40分鐘到店': '女生基礎妝',
  'B. 男生基礎妝_加購價600元 請於拍攝時間提前40分鐘到店': '男生基礎妝',
  'C. 女生精緻妝髮_加購價1500元 請於拍攝時間提前1小時10分鐘到店': '女生精緻妝髮',
  'D. 男生精緻妝髮_加購價1200元 請於拍攝時間提前1小時10分鐘到店': '男生精緻妝髮',
  'E. 女生訂製妝髮_加購價3000元 請於拍攝時間提前1小時40分鐘到店': '女生訂製妝髮',
  'A. 女生基礎妝 $800（約 30 分鐘）': '女生基礎妝',
  'B. 男生基礎妝 $600（約 30 分鐘）': '男生基礎妝',
  'C. 女生精緻妝髮 $1,500（約 1 小時）': '女生精緻妝髮',
  'D. 男生精緻妝髮 $1,200（約 1 小時）': '男生精緻妝髮',
  'D. 男生精緻妝髦 $1,200（約 1 小時）': '男生精緻妝髮',
  'E. 女生訂製妝髮 $3,000（約 1.5 小時）': '女生訂製妝髮',
};

/** 舊版 makeup_plan 值（已棄用）→ canonical 值 */
export const LEGACY_MAKEUP_PLAN_MAP: Record<string, MakeupPlanId> = {
  精緻妝髮女: '女生精緻妝髮',
  基礎日常妝女: '女生基礎妝',
  訂製妝髮女: '女生訂製妝髮',
  精緻妝髮男: '男生精緻妝髮',
  基礎日常妝男: '男生基礎妝',
  男生精緻妝髮男: '男生精緻妝髮',
};

export function getMakeupPlan(id: MakeupPlanId) {
  return MAKEUP_PLAN_CATALOG.find((p) => p.id === id)!;
}

export function formatPlanPrice(price: number): string {
  return `NT$ ${price.toLocaleString('zh-TW')}`;
}

export function formatPlanDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = minutes / 60;
  return Number.isInteger(h) ? `${h} hr` : `${minutes} min`;
}

/** 表單選項或舊文案 → canonical makeup_plan；無法對應回傳 null */
export function normalizeMakeupPlan(value: string | null | undefined): MakeupPlanId | null {
  if (!value?.trim()) return null;
  const v = value.trim();
  if (BILLABLE_MAKEUP_PLANS.has(v)) return v as MakeupPlanId;
  const fromLabel = MAKEUP_LABEL_MAP[v];
  if (fromLabel) return fromLabel;
  const fromLegacy = LEGACY_MAKEUP_PLAN_MAP[v];
  if (fromLegacy) return fromLegacy;
  if (v.includes('女生基礎妝') || (v.includes('基礎') && v.includes('女'))) return '女生基礎妝';
  if (v.includes('男生基礎妝') || (v.includes('基礎') && v.includes('男'))) return '男生基礎妝';
  if (v.includes('女生精緻妝髮') || (v.includes('精緻') && v.includes('女'))) return '女生精緻妝髮';
  if (v.includes('男生精緻妝髮') || v.includes('男生精緻妝髦') || (v.includes('精緻') && v.includes('男')))
    return '男生精緻妝髮';
  if (v.includes('女生訂製妝髮') || v.includes('訂製')) return '女生訂製妝髮';
  return null;
}

/** 是否為可計費妝髮方案 */
export function isBillableMakeupPlan(value: string | null | undefined): boolean {
  if (!value?.trim()) return false;
  return BILLABLE_MAKEUP_PLANS.has(normalizeMakeupPlan(value) ?? value.trim());
}

/** FAQ / 價目表用：五方案摘要一行 */
export function makeupPlansSummaryLine(): string {
  return MAKEUP_PLAN_CATALOG.map(
    (p) => `${p.letter}. ${p.id} NT$ ${p.price.toLocaleString('zh-TW')}（${p.durationMin}min）`,
  ).join('；');
}

/** 確認信／價目表區塊：五方案 canonical 列表 */
export function formatMakeupPlansPriceList(header = '妝髮方案：'): string {
  const lines = MAKEUP_PLAN_CATALOG.map(
    (p, i) => `${PLAN_LETTERS[i]}. ${p.id} $${p.price} / ${DURATION_LABEL[p.id]}`,
  );
  return `${header}\n${lines.join('；\n')}。`;
}

/** 確認信 demo／表單摘要範例 */
export function formatMakeupPlanBookingInfoLine(
  planId: MakeupPlanId,
  letter: (typeof PLAN_LETTERS)[number] = 'C',
): string {
  const plan = getMakeupPlan(planId);
  return `妝髮方案：${letter}. ${plan.id} $${plan.price}/ ${DURATION_LABEL[plan.id]}`;
}

export const STANDALONE_MAKEUP_DURATION_NOTICE =
  '◇ 女生基礎妝 / 男生基礎妝約 30 分鐘；女生精緻妝髮 / 男生精緻妝髮約 1 小時；女生訂製妝髮約 1.5 小時。';
