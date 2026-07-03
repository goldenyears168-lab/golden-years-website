import { hairMakeup as img } from "@/config/images";
import {
  MAKEUP_PLANS,
  formatPlanDuration,
  formatPlanPrice,
  makeupPlansSummaryLine,
} from "@/shared/makeup-plans";

export const makeupPageData = {
  hero: {
    title: "好時有影妝髮造型服務",
    subtitle:
      "專業妝髮，不只是變好看，而是讓你更自在地面對鏡頭與人生的重要時刻。",
    description:
      "我們相信，真正好的妝髮，是在保留個人特色的前提下，透過專業技術與穩定流程，讓每個人都能以最適合自己的狀態被看見。",
  },
  quote: {
    author: "羽彤老師的話",
    content: `「很多人以為妝髮只是修飾外表，但對我來說，它更像是一種陪伴。有些人是第一次面試、有些人準備畢業、有些人即將創業、結婚，或迎接人生新的階段。

在鏡頭前的緊張、自我懷疑，其實我都懂。我的工作，不只是把妝化好、頭髮整理好，而是透過專業與細節，幫助你慢慢找回自信與狀態。

攝影棚燈光與日常環境不同，鏡頭也會放大膚況與細節，所以我們會依照拍攝需求，調整底妝、修容與整體立體感，讓畫面自然、乾淨、耐看。

我希望每位來到好時有影的人，都能在離開時，比進門時更喜歡自己一點。」`,
  },
  philosophy: [
    {
      title: "專業",
      subtitle: "懂鏡頭的妝髮技術",
      description:
        "攝影妝容與日常妝容不同。我們熟悉棚燈、鏡頭與修圖需求，知道如何在強光與高解析度下，維持自然乾淨的質感。",
    },
    {
      title: "陪伴",
      subtitle: "讓不會化妝的人也能安心",
      description:
        "很多人平常不常化妝，也不習慣面對鏡頭。我們會一步一步溝通與引導，不追求過度改變，而是協助您呈現最適合自己的狀態。",
    },
    {
      title: "祝福",
      subtitle: "為重要時刻留下最好的樣子",
      description:
        "無論是求職、畢業、轉職、創業、婚禮或人生紀念，每一次妝髮與拍攝，都是送自己前往下一段旅程的儀式感。",
    },
  ],
  plans: [
    {
      id: "makeup-a",
      label: MAKEUP_PLANS[0].label,
      title: MAKEUP_PLANS[0].id,
      tagline: MAKEUP_PLANS[0].tagline,
      price: formatPlanPrice(MAKEUP_PLANS[0].price),
      duration: formatPlanDuration(MAKEUP_PLANS[0].durationMin),
      arrivalNote: "須於拍攝時間前 40 分鐘到店",
      image: img.plans[0],
      includes: ["簡易清潔", "膚色修飾", "修容、腮紅", "內眼線、畫眉、唇彩"],
      excludes: [
        "修眉、睫毛膏、假睫毛",
        "外眼線、電棒捲或其他髮型",
      ],
    },
    {
      id: "makeup-b",
      label: MAKEUP_PLANS[1].label,
      title: MAKEUP_PLANS[1].id,
      tagline: MAKEUP_PLANS[1].tagline,
      price: formatPlanPrice(MAKEUP_PLANS[1].price),
      duration: formatPlanDuration(MAKEUP_PLANS[1].durationMin),
      arrivalNote: "須於拍攝時間前 40 分鐘到店",
      image: img.plans[1],
      includes: ["簡易清潔", "膚色修飾、修容", "眉型、護唇膏"],
      excludes: ["眼妝、腮紅", "油頭或造型抓髮"],
    },
    {
      id: "makeup-c",
      label: MAKEUP_PLANS[2].label,
      title: MAKEUP_PLANS[2].id,
      tagline: MAKEUP_PLANS[2].tagline,
      price: formatPlanPrice(MAKEUP_PLANS[2].price),
      duration: formatPlanDuration(MAKEUP_PLANS[2].durationMin),
      popular: true,
      arrivalNote: "須於拍攝時間前 1 小時 10 分鐘到店",
      image: img.plans[2],
      includes: [
        "簡易清潔、輕透底妝",
        "修容、腮紅",
        "眼妝（內外眼線）",
        "精緻眉型、唇彩",
        "韓系波浪髮型",
      ],
      excludes: ["假睫毛", "其他髮型"],
    },
    {
      id: "makeup-d",
      label: MAKEUP_PLANS[3].label,
      title: MAKEUP_PLANS[3].id,
      tagline: MAKEUP_PLANS[3].tagline,
      price: formatPlanPrice(MAKEUP_PLANS[3].price),
      duration: formatPlanDuration(MAKEUP_PLANS[3].durationMin),
      arrivalNote: "須於拍攝時間前 1 小時 10 分鐘到店",
      image: img.plans[3],
      includes: [
        "簡易清潔、輕透底妝",
        "修容、眼妝",
        "精緻眉型、唇彩",
        "造型抓髮",
      ],
      excludes: [],
    },
    {
      id: "makeup-e",
      label: MAKEUP_PLANS[4].label,
      title: MAKEUP_PLANS[4].id,
      tagline: MAKEUP_PLANS[4].tagline,
      price: formatPlanPrice(MAKEUP_PLANS[4].price),
      duration: formatPlanDuration(MAKEUP_PLANS[4].durationMin),
      arrivalNote: "須於拍攝時間前 1 小時 40 分鐘到店",
      image: img.plans[4],
      includes: [
        "清潔保養、乾淨底妝",
        "修容、打亮、腮紅",
        "精緻眼妝（假睫毛）",
        "精緻眉型、唇彩",
        "客製髮型",
        "專業造型溝通及建議",
      ],
      excludes: ["飾品租借", "新娘整體造型"],
    },
  ],
  faq: [
    {
      category: "方案選擇與費用",
      qa: [
        {
          q: "妝髮服務需要額外加價嗎？收費標準為何？",
          a: `本工作室妝髮為加購項目，提供五種專業方案：${makeupPlansSummaryLine()}。方案 C（女生精緻妝髮）為最推薦。`,
        },
        {
          q: "女生 A 方案和 C 方案有什麼差別？我該怎麼選？",
          a: "選 A (基礎)：適合平時不常化妝、只需提亮氣色者。包含膚色修飾、修容腮紅、內眼線、眉妝、唇彩（不含假睫毛、外眼線與髮型設計）。選 C (精緻)：適合希望呈現專業精緻感、需處理頭髮者。包含輕透底妝、精緻眼妝、波浪髮型設計。推薦給形象照、重要職場照片需求者。",
        },
      ],
    },
    {
      category: "預約與到店時間",
      qa: [
        {
          q: "如果有加購妝髮，我該什麼時候抵達門市？",
          a: "為了確保拍攝準時開始，請根據您的方案提前到店。預約 A / B 方案：請於拍攝時間前 40 分鐘抵達。預約 C / D 方案：請於拍攝時間前 1 小時 10 分鐘抵達。預約 E 方案：請於拍攝時間前 1 小時 40 分鐘抵達。",
        },
      ],
    },
    {
      category: "現場整備與自主妝髮",
      qa: [
        {
          q: "一定要買妝髮服務嗎？可以現場自己畫嗎？",
          a: "不一定。若您選擇不加購，現場備有「自助妝髮區」，提供吹風機、電捲棒、掛燙機供您免費使用。專業建議：攝影棚燈光會吃妝，專業彩妝師會針對鏡頭與修圖需求調整妝感。若對化妝較無把握，建議預約時一併加購。",
        },
        {
          q: "我可以素顏過來嗎？需要先洗頭嗎？",
          a: "有預約妝髮：建議直接素顏到店即可；頭髮請維持乾燥，不需特別造型。未預約妝髮：請於到店前自行完成妝髮，現場僅提供空間與工具供最後整理。",
        },
      ],
    },
    {
      category: "風格與效果",
      qa: [
        {
          q: "妝容會不會很厚重？可以指定風格嗎？",
          a: "我們的妝感原則為「自然、精緻、上鏡」。彩妝師在施作前會先與您溝通。A/B 方案偏向自然提亮；E 方案提供最完整的客製化造型溝通。風格參考：證件照建議走 A 方案清淡路線；LinkedIn 或職場形象照則建議 C 方案以展現專業感。",
        },
        {
          q: "我有痘痘、黑眼圈或鬍渣，妝髮能處理到什麼程度？",
          a: "妝髮服務包含基礎的膚色均勻與遮瑕。雖然修圖可以淡化部分瑕疵與黑眼圈，但「妝髮+修圖」的雙重效果會讓皮膚質感看起來最自然，不會有過度修飾的人工感。",
        },
      ],
    },
  ],
  bookingSteps: [
    "請於預約拍攝時，在加購項目中勾選您需要的「妝髮服務」選項。",
    "妝前準備：為達最佳效果，建議您當天素顏前來（可擦保養品）。造型師會為您進行簡易清潔與妝前打底。",
  ],
};