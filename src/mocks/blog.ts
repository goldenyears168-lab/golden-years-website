import { blog } from "@/config/images";

export const blogCategories = [
  {
    id: 'toolbox',
    title: '好時工具箱',
    subtitle: 'Golden Toolbox',
    articles: [
      {
        id: 'photo-crop',
        title: '自助大頭照裁切',
        excerpt: '線上自助大頭照裁切工具，支援各種證件照規格（身分證、護照、健保卡、駕照）。上傳照片、選擇規格、一鍵裁切。',
        image: blog.covers[11],
        date: '2025-05-01',
        category: 'toolbox',
        href: '/crop-tool',
      },
      {
        id: 'career-test',
        title: '職涯性向測驗',
        excerpt: '透過簡短的互動測驗，探索您的職涯優勢與適合的發展方向。由好時有影與職涯諮詢師共同設計的免費工具。',
        image: blog.covers[12],
        date: '2025-04-18',
        category: 'toolbox',
      },
    ],
  },
  {
    id: 'shooting-guide',
    title: '拍攝指南',
    subtitle: 'Shooting Guide',
    articles: [
      {
        id: 'photography-equipment',
        title: '攝影器材介紹',
        excerpt: '好時有影使用的專業攝影器材全解析：從相機機身、鏡頭選擇到燈光佈置，帶您了解一張專業形象照背後的技術基礎。',
        image: blog.covers[0],
        date: '2025-04-15',
        category: 'shooting-guide',
      },
      {
        id: 'posing-guide',
        title: '動作指導介紹',
        excerpt: '姿勢引導不只是告訴你怎麼站，而是幫助你找到最自然、最有自信的狀態。了解好時有影的引導哲學與實用技巧。',
        image: blog.covers[1],
        date: '2025-04-08',
        category: 'shooting-guide',
      },
      {
        id: 'pre-shoot-skincare',
        title: '拍攝前彩妝保養介紹',
        excerpt: '拍攝前一天該如何保養？素顏來還是帶妝來？這篇文章整理了拍攝前的完整準備清單，讓您在鏡頭前呈現最佳狀態。',
        image: blog.covers[2],
        date: '2025-03-28',
        category: 'shooting-guide',
      },
    ],
  },
  {
    id: 'behind-scenes',
    title: '職人幕後',
    subtitle: 'Behind the Scenes',
    articles: [
      {
        id: 'world-tour',
        title: '世界巡迴計畫介紹',
        excerpt: '從政大創始店到墨爾本大學快閃，好時有影的海外巡迴計畫如何誕生？探索 Jack 將祝福儀式帶到世界各地的夢想旅程。',
        image: blog.covers[3],
        date: '2025-05-01',
        category: 'behind-scenes',
      },
      {
        id: 'blessing-ritual',
        title: '引導與祝福儀式介紹',
        excerpt: '每一次拍攝都是一次祝福儀式。了解好時有影如何將「引導」升級為「陪伴」，讓被拍攝者在鏡頭前真正被看見、被理解。',
        image: blog.covers[4],
        date: '2025-04-20',
        category: 'behind-scenes',
      },
      {
        id: 'photographer-stories',
        title: '攝影師個人頁面',
        excerpt: '五位攝影師的成長故事、最滿意的作品、想說的話，以及他們如何在好時有影找到對攝影的熱情與使命感。',
        image: blog.covers[5],
        date: '2025-04-05',
        category: 'behind-scenes',
      },
      {
        id: 'makeup-artist-stories',
        title: '化妝師個人頁面',
        excerpt: '三位造型師如何從對美的熱愛，走到專業攝影妝髮領域。她們的故事、最驕傲的作品，以及「讓每個人更喜歡自己」的信念。',
        image: blog.covers[6],
        date: '2025-03-22',
        category: 'behind-scenes',
      },
      {
        id: 'retoucher-stories',
        title: '修圖師個人頁面',
        excerpt: '修圖不只是修掉瑕疵，而是讓照片更貼近被拍攝者的真實氣場。三位修圖師分享他們的工作哲學與最滿意的修圖案例。',
        image: blog.covers[7],
        date: '2025-03-15',
        category: 'behind-scenes',
      },
      {
        id: 'retouching-process',
        title: '修圖內容與流程介紹',
        excerpt: '從原始檔到精修成品，一張照片的修圖流程包含哪些步驟？了解好時有影的修圖標準與兩次校稿機制。',
        image: blog.covers[8],
        date: '2025-03-01',
        category: 'behind-scenes',
      },
    ],
  },
  {
    id: 'traveler-stories',
    title: '旅人故事',
    subtitle: 'Traveler Stories',
    articles: [
      {
        id: 'corporate-group',
        title: '企業團拍案例',
        excerpt: 'Amazon、遠雄集團、MSD 美商默沙東等企業團拍背後的故事。如何為百人團隊打造統一又有個人特色的專業形象？',
        image: blog.covers[9],
        date: '2025-04-12',
        category: 'traveler-stories',
      },
      {
        id: 'portfolio-showcase',
        title: '各式各樣的作品集',
        excerpt: '從醫師白袍到畢業學士服，從情侶寫真到寵物全家福。精選各類型拍攝的代表作品，看見不同人生階段的美好。',
        image: blog.covers[10],
        date: '2025-03-25',
        category: 'traveler-stories',
      },
    ],
  },
];

export const blogPageData = {
  hero: {
    title: '好時誌部落格',
    subtitle: 'Golden Journal',
    description: '攝影不只是技術，更是一種整理與出發。從拍攝指南到職人故事，從旅人紀錄到實用工具，我們在這裡與您分享影像背後的思考與溫度。',
  },
};