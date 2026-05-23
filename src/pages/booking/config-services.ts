import type { StoreKey } from './config';

export type ServiceVariant = {
  label: string;
  simplybookId: number;
};

export type ExternalService = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  categoryId: string;
  categoryLabel: string;
  categoryIcon: string;
  variants: {
    basic: ServiceVariant;
    makeup: ServiceVariant;
  };
  isLineRedirect: boolean;
  lineUrl?: string;
  priceFrom: number;
};

const R2 = 'https://photo.goldenyearsphoto.com';

export const EXTERNAL_SERVICES: ExternalService[] = [
  /* ── 職涯與商務 ── */
  {
    id: 'resume',
    title: '求職履歷照',
    subtitle: '實習、求職',
    image: `${R2}/pricing/portrait/category-001.webp`,
    categoryId: 'career',
    categoryLabel: '職涯與商務',
    categoryIcon: 'ri-briefcase-line',
    variants: {
      basic: { label: '僅攝影服務', simplybookId: 4 },
      makeup: { label: '加購妝髮', simplybookId: 12 },
    },
    isLineRedirect: false,
    priceFrom: 999,
  },
  {
    id: 'professional',
    title: '職業形象照',
    subtitle: '商務、講師',
    image: `${R2}/pricing/portrait/category-002.webp`,
    categoryId: 'career',
    categoryLabel: '職涯與商務',
    categoryIcon: 'ri-briefcase-line',
    variants: {
      basic: { label: '僅攝影服務', simplybookId: 4 },
      makeup: { label: '加購妝髮', simplybookId: 12 },
    },
    isLineRedirect: false,
    priceFrom: 999,
  },

  /* ── 生命里程碑 ── */
  {
    id: 'graduation',
    title: '畢業寫真照',
    subtitle: '學士、碩士、博士',
    image: `${R2}/pricing/portrait/category-004.webp`,
    categoryId: 'milestone',
    categoryLabel: '生命里程碑',
    categoryIcon: 'ri-heart-3-line',
    variants: {
      basic: { label: '僅攝影服務', simplybookId: 4 },
      makeup: { label: '加購妝髮', simplybookId: 12 },
    },
    isLineRedirect: false,
    priceFrom: 999,
  },
  {
    id: 'personal-portrait',
    title: '個人寫真照',
    subtitle: '記錄此刻的自己',
    image: 'https://photo.goldenyearsphoto.com/personal-portrait/body-profile.webp',
    categoryId: 'milestone',
    categoryLabel: '生命里程碑',
    categoryIcon: 'ri-heart-3-line',
    variants: {
      basic: { label: '僅攝影服務', simplybookId: 4 },
      makeup: { label: '加購妝髮', simplybookId: 12 },
    },
    isLineRedirect: false,
    priceFrom: 999,
  },
  {
    id: 'doctor',
    title: '醫師白袍照',
    subtitle: '醫療專業形象',
    image: `${R2}/portfolio/doctor/white-coat-013.webp`,
    categoryId: 'milestone',
    categoryLabel: '生命里程碑',
    categoryIcon: 'ri-heart-3-line',
    variants: {
      basic: { label: '僅攝影服務', simplybookId: 4 },
      makeup: { label: '加購妝髮', simplybookId: 12 },
    },
    isLineRedirect: false,
    priceFrom: 999,
  },
  {
    id: 'couple',
    title: '情侶寫真照',
    subtitle: '甜蜜紀念',
    image: `${R2}/home/services/card-002.webp`,
    categoryId: 'milestone',
    categoryLabel: '生命里程碑',
    categoryIcon: 'ri-heart-3-line',
    variants: {
      basic: { label: '僅攝影服務', simplybookId: 5 },
      makeup: { label: '加購妝髮', simplybookId: 14 },
    },
    isLineRedirect: false,
    priceFrom: 1199,
  },
  {
    id: 'friends',
    title: '朋友寫真照',
    subtitle: '閨蜜、兄弟合照',
    image: `${R2}/portfolio/friends/group-005.webp`,
    categoryId: 'milestone',
    categoryLabel: '生命里程碑',
    categoryIcon: 'ri-heart-3-line',
    variants: {
      basic: { label: '僅攝影服務', simplybookId: 5 },
      makeup: { label: '加購妝髮', simplybookId: 14 },
    },
    isLineRedirect: false,
    priceFrom: 1199,
  },
  {
    id: 'family',
    title: '全家福照',
    subtitle: '家庭紀念',
    image: `${R2}/portfolio/family/session-002.webp`,
    categoryId: 'milestone',
    categoryLabel: '生命里程碑',
    categoryIcon: 'ri-heart-3-line',
    variants: {
      basic: { label: '僅攝影服務', simplybookId: 5 },
      makeup: { label: '加購妝髮', simplybookId: 14 },
    },
    isLineRedirect: false,
    priceFrom: 1199,
  },
  {
    id: 'maternity',
    title: '孕婦寫真照',
    subtitle: '孕期紀錄、孕媽咪寫真',
    image: `${R2}/home/hero/slide-001.webp`,
    categoryId: 'milestone',
    categoryLabel: '生命里程碑',
    categoryIcon: 'ri-heart-3-line',
    variants: {
      basic: { label: '僅攝影服務', simplybookId: 4 },
      makeup: { label: '加購妝髮', simplybookId: 12 },
    },
    isLineRedirect: false,
    priceFrom: 999,
  },
  {
    id: 'pet',
    title: '寵物寫真照',
    subtitle: '毛孩紀念',
    image: `${R2}/pricing/portrait/category-010.webp`,
    categoryId: 'milestone',
    categoryLabel: '生命里程碑',
    categoryIcon: 'ri-heart-3-line',
    variants: {
      basic: { label: '僅攝影服務', simplybookId: 5 },
      makeup: { label: '加購妝髮', simplybookId: 14 },
    },
    isLineRedirect: false,
    priceFrom: 1199,
  },

  /* ── 韓式證件照 ── */
  {
    id: 'id-formal',
    title: '正式證件照',
    subtitle: '護照、駕照、身分證',
    image: `${R2}/pricing/id-photo/passport-001.webp`,
    categoryId: 'id',
    categoryLabel: '韓式證件照',
    categoryIcon: 'ri-id-card-line',
    variants: {
      basic: { label: '僅攝影服務', simplybookId: 3 },
      makeup: { label: '加購妝髮', simplybookId: 16 },
    },
    isLineRedirect: false,
    priceFrom: 399,
  },
  {
    id: 'id-graduation',
    title: '畢業證件照',
    subtitle: '畢業紀念、學位照',
    image: `${R2}/pricing/id-photo/passport-002.webp`,
    categoryId: 'id',
    categoryLabel: '韓式證件照',
    categoryIcon: 'ri-id-card-line',
    variants: {
      basic: { label: '僅攝影服務', simplybookId: 3 },
      makeup: { label: '加購妝髮', simplybookId: 16 },
    },
    isLineRedirect: false,
    priceFrom: 399,
  },
];

export const STORE_IMAGES: Record<StoreKey, { label: string; image: string; address: string; transport: string }> = {
  zhongshan: {
    label: '中山店',
    image: 'https://photo.goldenyearsphoto.com/booking/stores/zhongshan.webp',
    address: '台北市中山區南京東路一段10號4樓',
    transport: '捷運中山站 2號出口',
  },
  gongguan: {
    label: '公館店',
    image: 'https://photo.goldenyearsphoto.com/booking/stores/gongguan.webp',
    address: '台北市中正區汀州路三段160巷4號6樓',
    transport: '捷運公館站 1號出口',
  },
};