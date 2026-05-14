import { pricing as img } from "@/config/images";

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
        title: "朋友寫真照",
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
        price: "NT$ 1,199",
        image: img.categories[8],
        slug: "maternity-photo",
      },
      {
        id: "pet",
        title: "寵物寫真照",
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

export const makeupPricing = [
  {
    id: "makeup-a",
    title: "女生 基礎日常妝",
    duration: "30min",
    price: "NT$ 800",
    image: img.makeup[0],
    slug: "makeup-basic-female",
  },
  {
    id: "makeup-b",
    title: "男生 基礎日常妝",
    duration: "30min",
    price: "NT$ 600",
    image: img.makeup[1],
    slug: "makeup-basic-male",
  },
  {
    id: "makeup-c",
    title: "女生 精緻妝髮",
    duration: "60min",
    price: "NT$ 1,500",
    image: img.makeup[2],
    slug: "makeup-premium-female",
  },
  {
    id: "makeup-d",
    title: "男生 精緻妝髮",
    duration: "60min",
    price: "NT$ 1,200",
    image: img.makeup[3],
    slug: "makeup-premium-male",
  },
  {
    id: "makeup-e",
    title: "女生 訂製妝髮",
    duration: "90min",
    price: "NT$ 3,000",
    image: img.makeup[4],
    slug: "makeup-custom-female",
  },
];

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