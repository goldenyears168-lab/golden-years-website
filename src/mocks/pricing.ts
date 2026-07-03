import { pricing as img } from "@/config/images";
import { MAKEUP_PLANS, formatPlanPrice } from "@/shared/makeup-plans";

export const pricingCategories = [
  {
    id: "career",
    title: "職涯與商務",
    icon: "ri-briefcase-line",
    items: [
      {
        id: "resume",
        title: "求職履歷照",
        subtitle: "實習、求職",
        price: "NT$ 999",
        image: img.categories[0],
        slug: "resume-photo",
      },
      {
        id: "professional",
        title: "職業形象照",
        subtitle: "商務、講師",
        price: "NT$ 999",
        image: img.categories[1],
        slug: "professional-photo",
      },
      {
        id: "corporate",
        title: "企業團體合作",
        subtitle: "專案報價",
        price: "專案報價",
        image: img.categories[2],
        slug: "corporate",
      },
    ],
  },
  {
    id: "milestone",
    title: "生命里程碑",
    icon: "ri-heart-3-line",
    items: [
      {
        id: "graduation",
        title: "畢業寫真照",
        subtitle: "學士、碩士、博士",
        price: "NT$ 999",
        image: img.categories[3],
        slug: "graduation-photo",
      },
      {
        id: "personal-portrait",
        title: "個人寫真照",
        subtitle: "自我紀錄，個人風格",
        price: "NT$ 999",
        image: img.categories[3],
        slug: "personal-portrait",
      },
      {
        id: "doctor",
        title: "醫師白袍照",
        subtitle: "醫療專業形象",
        price: "NT$ 999",
        image: img.categories[4],
        slug: "doctor-white-coat",
      },
      {
        id: "couple",
        title: "情侶寫真照",
        subtitle: "甜蜜紀念",
        price: "NT$ 1,199",
        image: img.categories[5],
        slug: "couple-photo",
      },
      {
        id: "friends",
        title: "朋友寫真照/畢業寫真照",
        subtitle: "友誼紀念",
        price: "NT$ 1,199",
        image: img.categories[6],
        slug: "friends-photo",
      },
      {
        id: "family",
        title: "全家福照",
        subtitle: "家庭紀念",
        price: "NT$ 1,199",
        image: img.categories[7],
        slug: "family-photo",
      },
      {
        id: "maternity",
        title: "孕婦寫真照",
        subtitle: "母愛紀念",
        price: "NT$ 999",
        image: img.categories[8],
        slug: "maternity-photo",
      },
      {
        id: "pet",
        title: "寵物寫真合照",
        subtitle: "毛孩紀念",
        price: "NT$ 1,199",
        image: img.categories[9],
        slug: "pet-photo",
      },
    ],
  },
  {
    id: "id",
    title: "韓式證件照",
    icon: "ri-id-card-line",
    items: [
      {
        id: "id-formal",
        title: "正式證件照",
        subtitle: "護照、駕照、身分證",
        price: "NT$ 399",
        image: img.idPhoto[0],
        slug: "formal-id",
      },
      {
        id: "id-graduation",
        title: "畢業證件照",
        subtitle: "畢業典禮、學籍",
        price: "NT$ 399",
        image: img.idPhoto[1],
        slug: "graduation-id",
      },
    ],
  },
];

const MAKEUP_SLUGS = [
  "makeup-basic-female",
  "makeup-basic-male",
  "makeup-premium-female",
  "makeup-premium-male",
  "makeup-custom-female",
] as const;

export const makeupPricing = MAKEUP_PLANS.map((plan, i) => ({
  id: `makeup-${plan.label.toLowerCase()}`,
  title: plan.id,
  duration: `${plan.durationMin}min`,
  price: formatPlanPrice(plan.price),
  image: img.makeup[i],
  slug: MAKEUP_SLUGS[i],
}));

export const workshopPricing = {
  title: "攝影工作坊",
  items: [
    {
      id: "workshop",
      title: "挑戰一日攝影師工作坊",
      price: "NT$ 999 / 人",
      description: "親身體驗攝影師的一天，從佈光到後製修圖，完整了解專業攝影流程。",
      image: img.workshop,
      slug: "photography-workshop",
    },
  ],
};

export const photoServiceNotes = [
  "持學生證可優惠折100元（證件照除外）",
  "無沖印實體照片",
  "專業自然修圖，可校稿兩次",
  "成品為高畫質電子檔",
  "於一週內交件（隔日交件＋100元/張）",
  "預設灰色背景，換購白色背景 總價+500元",
];