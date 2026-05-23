import { about, team } from "@/config/images";

export const founderStory = {
  title: "從四大會計師事務所到攝影工作室",
  paragraphs: [
    "政大會計系畢業後，我進入了四大會計師事務所。在辦公室裡的某天，我望著眼前的前輩們——一年後坐在隔壁的同事、五年後坐在小隔間的主管、十年後終於有一間自己的辦公室...",
    "這應該是一條清晰完美的職涯路徑，而我卻常望向窗外。那時我的工作量已經忙到沒有時間思考人生了，於是我決定：先離職再說。",
    "從當員工轉當自由接案者，接著開照相館，我想成為創造回憶與故事的攝影師。與其說是在拍照，更像是一個聽故事的人。",
    "「當被故事感動，就會對這份工作有熱情和使命。」我們聽聞許多人生故事：畢業生對未來的困惑、轉職人面臨的職涯課題、拍攝簽證照的人飛向世界各處、還有許多意味著離別的合照...",
    "好時有影就這樣誕生了。希望每個「好時」都有你我的「身影」，參與著人們的故事，紀錄日常生活的定格和延續。",
  ],
  founder: {
    name: "Jack",
    title: "創辦人",
    education: "國立政治大學 會計學系",
    image: about.founder,
    alt: "好時有影創辦人 Jack 肖像照",
  },
};

export const teamData = {
  title: "團隊介紹",
  categories: [
    {
      role: "攝影師",
      count: "5 位",
      members: [
        {
          name: "Annie",
          title: "共同創辦人 / 首席攝影師",
          image: team[0],
          alt: "好時有影攝影師 Annie 團隊照",
        },
        {
          name: "敦閔",
          title: "資深攝影師",
          image: team[1],
          alt: "好時有影攝影師敦閔 團隊照",
        },
        {
          name: "Vincent",
          title: "攝影師",
          image: team[2],
          alt: "好時有影攝影師Vincent 團隊照",
        },
        {
          name: "芷吟",
          title: "攝影師",
          image: team[3],
          alt: "好時有影攝影師芷吟 團隊照",
        },
      ],
    },
    {
      role: "造型師",
      count: "4 位",
      members: [
        {
          name: "Chloe",
          title: "首席造型師",
          image: team[5],
          alt: "好時有影造型師Chloe 團隊照",
        },
        {
          name: "純依",
          title: "資深造型師",
          image: team[6],
          alt: "好時有影造型師純依 團隊照",
        },
        {
          name: "Mona",
          title: "造型師",
          image: team[7],
          alt: "好時有影造型師Mona 團隊照",
        },
        {
          name: "Enid",
          title: "造型師",
          image: team[4],
          alt: "好時有影造型師Enid 團隊照",
        },
      ],
    },
    {
      role: "修圖師",
      count: "2 位",
      members: [
        {
          name: "Mia",
          title: "資深修圖師",
          image: team[9],
          alt: "好時有影修圖師Mia 團隊照",
        },
        {
          name: "靜怡",
          title: "資深修圖師",
          image: team[10],
          alt: "好時有影修圖師靜怡 團隊照",
        },
      ],
    },
  ],
};

export const valuesData = {
  pillars: [
    {
      title: "專業",
      icon: "ri-award-line",
      items: [
        {
          subtitle: "標準",
          description:
            "堅持 SOP 與專業流程，重視每個細節與品質穩定性。",
        },
        {
          subtitle: "協作",
          description:
            "建立清晰分工與高效溝通，讓團隊合作能長期穩定運作。",
        },
        {
          subtitle: "交付",
          description:
            "對成果負責，準時交付值得信任、值得收藏的作品。",
        },
      ],
    },
    {
      title: "陪伴",
      icon: "ri-hand-heart-line",
      items: [
        {
          subtitle: "傾聽",
          description:
            "理解每位顧客在人生與職涯階段的期待、焦慮與目標。",
        },
        {
          subtitle: "支持",
          description:
            "陪伴顧客走過求職、畢業、轉職、創業等重要轉換期，給予安心與力量。",
        },
        {
          subtitle: "成長",
          description:
            "不只完成一次拍攝，而是在每段人生旅程中，成為能持續同行的夥伴。",
        },
      ],
    },
    {
      title: "祝福",
      icon: "ri-seedling-line",
      items: [
        {
          subtitle: "送行",
          description:
            "在人生重要里程碑前，留下最好的狀態與體面，送顧客走向下一段旅程。",
        },
        {
          subtitle: "見證",
          description:
            "見證每一次勇敢出發，讓影像成為人生轉變的重要紀念。",
        },
        {
          subtitle: "留存",
          description:
            "讓多年後再次看見照片時，仍能想起當時被理解、被支持、被祝福的感受。",
        },
      ],
    },
  ],
};

export const milestones = [
  {
    year: "2021",
    title: "政大創始店開幕",
    description: "在國立政治大學校園內設立第一個據點，開始為學生與校友提供專業形象照服務。同年與政大職涯中心建立合作關係。",
    highlight: true,
  },
  {
    year: "2022",
    title: "公館店開幕",
    description:
      "拓展至公館商圈，服務更多元的顧客群。開始與遠雄集團、台大醫學系建立合作夥伴關係。",
    highlight: false,
  },
  {
    year: "2023",
    title: "中山店開幕 & 兩萬位顧客",
    description:
      "第三家分店於中山商圈盛大開幕。累積服務顧客突破兩萬人，成為台北地區備受信賴的專業形象照品牌。",
    highlight: true,
  },
  {
    year: "2024",
    title: "成大快閃 & 朝聖之路",
    description:
      "首次跨出台北，到成功大學舉辦快閃攝影活動。創辦人 Jack 完成徒步 800 公里的西班牙朝聖之路 Camino de Santiago。",
    highlight: false,
  },
  {
    year: "2025",
    title: "墨爾本快閃 & 跨界合作",
    description:
      "首次跨出台灣，到墨爾本大學舉辦快閃攝影。與河北彩花等知名人物進行合作拍攝，品牌影響力持續擴展。",
    highlight: true,
  },
];