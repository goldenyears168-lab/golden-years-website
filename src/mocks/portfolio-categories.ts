import { portfolio as img } from "@/config/images";

function makeImages(urls: string[], altPrefix: string) {
  return urls.map((url, i) => ({ url, alt: `好時有影台北${altPrefix} ${i + 1}` }));
}

export const portfolioCategories = [
  {
    id: "resume",
    slug: "resume",
    title: "求職履歷照",
    subtitle: "實習、求職",
    description:
      "在成堆履歷中，一張照片往往決定第一印象。我們以專業 SOP、自然光影與姿態引導，協助新鮮人呈現專業感與親和力，而不是制式僵硬的大頭照。從妝髮、拍攝到交付流程清楚一致，陪伴您走向人生第一份工作，留下值得被記住的起點。",
    images: makeImages(img.resume, "求職履歷照作品"),
  },
  {
    id: "linkedin",
    slug: "linkedin",
    title: "職業形象照",
    subtitle: "商務、講師",
    description:
      "LinkedIn、講台與企業官網，都是個人品牌的延伸。我們依產業與角色調整光影與引導，以穩定流程建立專業可信度。不只拍一張形象照，更陪伴您在職涯成長與品牌建立中，留下能長期使用的專業資產。",
    images: makeImages(img.linkedin, "職業形象照作品"),
  },
  {
    id: "corporate",
    slug: "corporate",
    title: "企業團體合作",
    subtitle: "團隊形象、活動紀錄",
    description:
      "團隊照不只是合照，更是品牌文化與信任感的延伸。我們以標準化 SOP 處理多人佈光、站位與後製流程，降低企業窗口溝通負擔。在團隊成長與企業里程碑中，用影像留下值得被記錄的時刻。",
    images: makeImages(img.corporate, "企業團體合作作品"),
  },
  {
    id: "graduation",
    slug: "graduation",
    title: "畢業寫真照",
    subtitle: "學士、碩士、博士",
    description:
      "畢業不只是穿上學士服，更是一段青春旅程的告別。我們重視每個笑容、眼神與同伴間的默契，以自然引導留下真實情感。從服裝整理到交付流程皆清楚一致，陪伴您告別校園，祝福您走向人生下一章。",
    images: makeImages(img.graduation, "畢業寫真照作品"),
  },
  {
    id: "doctor",
    slug: "doctor",
    title: "醫師白袍照",
    subtitle: "醫療專業形象",
    description:
      "白袍承載專業與信任。我們以穩定燈光與標準化流程呈現白袍質感，並依科別調整姿態與氛圍。在成為獨當一面的醫師路上，留下一張兼具專業與溫度的人生紀念。",
    images: makeImages(img.doctor, "醫師白袍照作品"),
  },
  {
    id: "couple",
    slug: "couple",
    title: "情侶寫真照",
    subtitle: "甜蜜紀念",
    description:
      "最動人的畫面，往往來自自然互動，而不是刻意擺拍。我們透過對話與引導，讓彼此在鏡頭前慢慢放鬆。以自然耐看的風格與清楚流程，陪伴你們記錄關係中的重要階段，為愛情留下祝福與紀念。",
    images: makeImages(img.couple, "情侶寫真照作品"),
  },
  {
    id: "friends",
    slug: "friends",
    title: "朋友寫真照/畢業寫真照",
    subtitle: "友誼紀念",
    description:
      "有些友情，值得被好好留下。我們依互動、服裝與畫面層次進行安排，讓每個人都自然入鏡。清楚透明的拍攝流程，陪伴你們在青春與人生階段交會時，留下多年後仍會想翻看的回憶。",
    images: makeImages(img.friends, "朋友寫真照作品"),
  },
  {
    id: "family",
    slug: "family",
    title: "全家福照",
    subtitle: "家庭紀念",
    description:
      "全家福的核心，是讓每位家人都被好好看見。我們透過穩定流程與輕鬆引導，降低拍攝壓力，留下自然互動。在家庭的重要時刻，用影像陪伴與祝福彼此，把「家」的樣子長久保存。",
    images: makeImages(img.family, "全家福照作品"),
  },
  {
    id: "maternity",
    slug: "maternity",
    title: "孕婦寫真照",
    subtitle: "母愛紀念",
    description:
      "孕期寫真紀錄的是期待與溫柔。我們將舒適與安全放在第一，以穩定 SOP 安排拍攝節奏與現場流程。陪伴您迎接新生命的重要旅程，為成為母親的此刻留下溫柔而珍貴的祝福。",
    images: makeImages(img.maternity, "孕婦寫真照作品"),
  },
  {
    id: "pet",
    slug: "pet",
    title: "寵物寫真合照",
    subtitle: "毛孩紀念",
    description:
      "毛孩是家人，也是生命裡重要的陪伴。我們會預留熟悉環境與互動時間，以耐心引導降低緊張感。用自然真實的方式，記錄您與毛孩相伴的人生片段，留下未來回頭看仍會微笑的紀念。",
    images: makeImages(img.pet, "寵物寫真合照作品"),
  },
  {
    id: "id-formal",
    slug: "id-formal",
    title: "正式證件照",
    subtitle: "護照、駕照、身分證",
    description:
      "證件照需要兼顧規格、專業與自然感。我們會先確認用途與尺寸，以標準化流程完成拍攝、挑片與裁切。即使是正式用途，也希望陪伴您在人生每個申請、考試與轉換時刻，留下最好的狀態。",
    images: makeImages(img.idFormal, "正式證件照作品"),
  },
  {
    id: "id-graduation",
    slug: "id-graduation",
    title: "畢業證件照",
    subtitle: "畢業典禮、學籍",
    description:
      "畢業證件照不只是規格照，更是學生時期的重要告別。我們協助對齊校方規範，同時保留自然好看的狀態。從學士袍配件到交付流程皆清楚一致，陪伴您完成青春最後一張學生證件照，祝福您正式走向下一段人生。",
    images: makeImages(img.idGraduation, "畢業證件照作品"),
  },
];