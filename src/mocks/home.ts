import { home as img } from "@/config/images";
import { MAKEUP_PLANS, formatPlanPrice } from "@/shared/makeup-plans";

export const heroData = {
  title: "台北專業形象照｜為履歷、畢業、證件定格人生好時",
  subtitle: "讓每一個「好時」，都有你我的「身影」",
  description: "台北專業履歷形象照攝影｜專為頂尖學府與百大企業打造的專業形象",
  ctaPrimary: "查看方案",
  ctaSecondary: "線上預約",
  images: [
    { src: img.hero[0], alt: "好時有影台北專業形象照攝影作品" },
    { src: img.hero[1], alt: "好時有影台北醫師白袍照專業攝影" },
    { src: img.hero[2], alt: "好時有影台北畢業寫真攝影作品" },
    { src: img.hero[3], alt: "好時有影台北韓式證件照攝影" },
    { src: img.hero[4], alt: "好時有影台北情侶寫真攝影作品" },
  ],
};

export const photoServices = [
  {
    title: "求職履歷照",
    description: "為你的職涯開啟完美第一印象",
    price: "NT$ 999",
    image: img.services[0],
    slug: "resume-photo",
    categoryId: "resume",
  },
  {
    title: "LinkedIn形象照",
    description: "打造專業社群的最佳個人形象",
    price: "NT$ 999",
    image: img.services[1],
    slug: "linkedin-photo",
    categoryId: "linkedin",
  },
  {
    title: "醫師白袍照",
    description: "展現醫療專業的莊重與溫暖",
    price: "NT$ 999",
    image: img.services[2],
    slug: "doctor-white-coat",
    categoryId: "doctor",
  },
  {
    title: "畢業寫真",
    description: "為人生重要里程碑留下美好紀念",
    price: "NT$ 999",
    image: img.services[3],
    slug: "graduation-photo",
    categoryId: "graduation",
  },
  {
    title: "韓式證件照",
    description: "最自然的證件照，展現最好的自己",
    price: "NT$ 399",
    image: img.services[4],
    slug: "korean-id-photo",
    categoryId: "id-formal",
  },
  {
    title: "情侶寫真",
    description: "記錄愛情的每一個美好時刻",
    price: "NT$ 1,199",
    image: img.services[5],
    slug: "couple-photo",
    categoryId: "couple",
  },
];

const MAKEUP_DESCRIPTIONS = [
  "自然清新的日常妝容，展現原生美貌",
  "清爽乾淨的男士妝容，提升精神氣色",
  "精緻妝容搭配造型髮型，完美上鏡",
  "男士精緻妝容與髮型，呈現最佳狀態",
  "客製化妝髮造型，為特殊場合量身打造",
] as const;

export const makeupServices = MAKEUP_PLANS.map((plan, i) => ({
  title: plan.id,
  duration: `${plan.durationMin}min`,
  price: formatPlanPrice(plan.price),
  description: MAKEUP_DESCRIPTIONS[i],
}));

export const trustData = {
  customerCount: "超過兩萬位顧客",
  description: "感謝各界專業人士與組織的信任，選擇好時有影留下影像。",
  corporateClients: [
    "Amazon亞馬遜",
    "MSD美商默沙東藥廠",
    "鵬耀法律事務所",
    "遠雄集團",
    "智選科技",
    "技鋼科技",
    "聖邦科技",
    "CHARLES & KEITH",
    "萬寶華",
    "資生堂",
    "微軟",
    "雅培",
    "IBM",
    "Inline樂排",
    "foodpanda",
    "英美菸草",
    "Happy hair",
    "白蘭氏",
    "生洋網路",
    "Garmin",
    "臺大醫院",
  ],
  schoolClients: [
    "台大醫",
    "台大牙醫",
    "台大藥學",
    "台大物治",
    "陽明醫",
    "陽明物治",
    "中山醫",
    "馬偕醫",
    "馬偕聽語",
    "中國醫",
    "政大EMBA",
    "交大GMBA",
  ],
};

export const founderWords = {
  title: "我想成為創造回憶與故事的攝影師",
  paragraphs: [
    "與其說是在拍照，更像是一個聽故事的人。在所有前來好時有影的客人當中，有學生、社會新鮮人、也有年長我們許多的管理高層。我好奇大家在崗位上扮演著什麼樣角色，有著什麼故事與煩惱？",
    "我們與顧客交談，聽聞許多人生大大小小的故事。畢業生對未來困惑與期待，轉職的人面臨的職涯課題，拍攝簽證照的人飛向世界各處，為即將進入人生下一階段拍攝的紀念照，甚至也有常意味著離別而拍的合照...",
    "當被故事感動，就會對這份工作有熱情和使命。好時有影就這樣誕生了，希望每個「好時」都有你我的「身影」，參與著人們的故事，紀錄日常生活的定格和延續。",
  ],
  founder: {
    name: "Jack",
    title: "創辦人 / 首席攝影師",
    image: img.founder,
    alt: "好時有影創辦人 Jack 肖像照",
  },
};

export const ctaData = {
  title: "準備好留下下一個人生階段的樣子了嗎？",
  buttons: [
    { label: "查看方案", href: "/price-list", variant: "primary" as const },
    { label: "線上預約", href: "/booking", variant: "outline" as const },
    { label: "LINE詢問", href: "https://line.me/R/ti/p/@goldenyearsphoto", variant: "outline" as const, external: true },
  ],
};

export const aboutHome = {
  title: "讓這些照片陪伴著你帶到下一個人生階段",
  description:
    "我們不只提供攝影服務，更在乎每一次拍攝背後的故事與意義。從求職履歷到人生里程碑，好時有影與你一起走過。",
  image: img.studio,
  alt: "好時有影台北公館攝影工作室內部空間",
};