import { portfolio as img } from "@/config/images";

export const portfolioFilters = [
  { id: "all", label: "全部" },
  { id: "career", label: "職涯形象" },
  { id: "graduation", label: "畢業紀念" },
  { id: "couple", label: "甜蜜時光" },
  { id: "family", label: "全家福" },
  { id: "portrait", label: "個人寫真" },
];

export const portfolioItems = [
  { id: "1",  title: "職業形象照", subCategory: "商務",  image: img.linkedin[0],    category: "career",     serviceSlug: "linkedin" },
  { id: "2",  title: "畢業寫真",   subCategory: "學士",  image: img.graduation[0],  category: "graduation", serviceSlug: "graduation" },
  { id: "3",  title: "情侶寫真",   subCategory: "戶外",  image: img.couple[0],      category: "couple",     serviceSlug: "couple" },
  { id: "4",  title: "全家福",     subCategory: "家庭",  image: img.family[0],      category: "family",     serviceSlug: "family" },
  { id: "5",  title: "個人寫真",   subCategory: "自然",  image: img.resume[0],      category: "portrait",   serviceSlug: "resume" },
  { id: "6",  title: "求職照",     subCategory: "新鮮人",image: img.resume[1],      category: "career",     serviceSlug: "resume" },
  { id: "7",  title: "碩士畢業",   subCategory: "碩士",  image: img.graduation[1],  category: "graduation", serviceSlug: "graduation" },
  { id: "8",  title: "朋友寫真",   subCategory: "友情",  image: img.friends[0],     category: "couple",     serviceSlug: "friends" },
  { id: "9",  title: "孕婦寫真",   subCategory: "孕期",  image: img.maternity[0],   category: "family",     serviceSlug: "maternity" },
  { id: "10", title: "醫師白袍",   subCategory: "專業",  image: img.doctor[0],      category: "career",     serviceSlug: "doctor" },
  { id: "11", title: "企業團體",   subCategory: "團隊",  image: img.corporate[0],   category: "career",     serviceSlug: "corporate" },
  { id: "12", title: "寵物寫真",   subCategory: "毛孩",  image: img.pet[0],         category: "family",     serviceSlug: "pet" },
];

export const featuredPortfolio = [
  { url: img.resume[0],      alt: "好時有影台北求職履歷照",   categorySlug: "resume",        categoryTitle: "求職履歷照" },
  { url: img.linkedin[0],    alt: "好時有影台北職業形象照",   categorySlug: "linkedin",      categoryTitle: "職業形象照" },
  { url: img.doctor[0],      alt: "好時有影台北醫師白袍照",   categorySlug: "doctor",        categoryTitle: "醫師白袍照" },
  { url: img.graduation[0],  alt: "好時有影台北畢業寫真照",   categorySlug: "graduation",    categoryTitle: "畢業寫真照" },
  { url: img.couple[0],      alt: "好時有影台北情侶寫真照",   categorySlug: "couple",        categoryTitle: "情侶寫真照" },
  { url: img.friends[0],     alt: "好時有影台北朋友寫真照/畢業寫真照",   categorySlug: "friends",       categoryTitle: "朋友寫真照/畢業寫真照" },
  { url: img.family[0],      alt: "好時有影台北全家福照",     categorySlug: "family",        categoryTitle: "全家福照" },
  { url: img.maternity[0],   alt: "好時有影台北孕婦寫真照",   categorySlug: "maternity",     categoryTitle: "孕婦寫真照" },
  { url: img.pet[0],         alt: "好時有影台北寵物寫真合照",   categorySlug: "pet",           categoryTitle: "寵物寫真合照" },
  { url: img.idFormal[0],    alt: "好時有影台北正式證件照",   categorySlug: "id-formal",     categoryTitle: "正式證件照" },
  { url: img.idGraduation[0],alt: "好時有影台北畢業證件照",   categorySlug: "id-graduation", categoryTitle: "畢業證件照" },
  { url: img.corporate[0],   alt: "好時有影台北企業團體合作", categorySlug: "corporate",     categoryTitle: "企業團體合作" },
  { url: img.linkedin[1],    alt: "好時有影台北職業形象照",   categorySlug: "linkedin",      categoryTitle: "職業形象照" },
  { url: img.graduation[1],  alt: "好時有影台北畢業寫真照",   categorySlug: "graduation",    categoryTitle: "畢業寫真照" },
  { url: img.family[1],      alt: "好時有影台北全家福照",     categorySlug: "family",        categoryTitle: "全家福照" },
];