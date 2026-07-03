export type DetailSection = {
  title: string;
  content: string;
};

export type ServiceDetailData = {
  heading: string;
  notice?: string;
  sections: DetailSection[];
};

const PORTRAIT_IDS = [
  'resume',
  'professional',
  'graduation',
  'personal-portrait',
  'doctor',
];
const GROUP_IDS = ['couple', 'friends', 'family'];
const MATERNITY_IDS = ['maternity'];
const PET_IDS = ['pet'];
const ID_FORMAL_IDS = ['id-formal'];
const ID_GRADUATION_IDS = ['id-graduation'];

export function getDetailKey(
  serviceId: string,
  variantType: 'basic' | 'makeup',
): string | null {
  if (serviceId === 'standalone-makeup') return 'standalone-makeup';
  if (PORTRAIT_IDS.includes(serviceId)) return `portrait-${variantType}`;
  if (GROUP_IDS.includes(serviceId)) return `group-${variantType}`;
  if (MATERNITY_IDS.includes(serviceId)) return `maternity-${variantType}`;
  if (PET_IDS.includes(serviceId)) return `pet-${variantType}`;
  if (ID_FORMAL_IDS.includes(serviceId)) return `id-formal-${variantType}`;
  if (ID_GRADUATION_IDS.includes(serviceId)) return `id-graduation-${variantType}`;
  return null;
}

/* ── 通用預約須知 ── */
const COMMON_NOTICE = `**本工作室不提供其餘毛片、RAW 檔或實體照片。**
低消說明：若要拍攝多種項目或更換多套衣服，請預約兩個時段，一個時段低消一張。

【多項拍攝 / 多人拍攝預約方式】
· 形象照＋證件照：先選擇形象照，再備註加購證件照
· 二位證件照：先選擇證件照，再備註加購證件照
· 二位形象照/寫真：預約兩個形象照/寫真時段，以此類推
· 形象照＋合照：預約一個形象照時段＋一個合照時段`;

const BG_UPGRADE_NOTICE = `灰色背景換白色背景總價加 500 元，全身照/白底照在後面備註即可。`;
const ID_EXCLUSIVE = `護照照、身分證照請避免穿白色上衣。
駕照照請確認各國證件規格需求，拍攝前可告知攝影師。`;
const MAKEUP_RULE = `化妝規範：若改不化妝，請直接取消並重新預約無化妝時段。（有預約化妝時段而臨時取消化妝的拍攝同樣會收取化妝費用。）`;

function buildNotice(exclusive: string | null): string {
  const parts = [COMMON_NOTICE];
  if (exclusive) parts.push(exclusive);
  return parts.join('\n');
}

/* ── 1. 形象照｜僅攝影服務 ── */
const portraitBasic: ServiceDetailData = {
  heading: '形象照｜僅攝影服務（不含妝髮）',
  notice: '請提早 5 分鐘到店預備',
  sections: [
    {
      title: '服務說明與價格',
      content: `999 元/張：灰底半身形象照。
1199 元/張：灰底全身形象照。
灰色背景換白色背景總價加 500 元，全身照/白底照在後面備註即可。
成品交付：提供 Email JPG 專業修圖電子檔。
服務時長：拍攝約 30–50 張照片，攝影師會引導不同動作，含挑圖時間約 30 分鐘。`,
    },
    {
      title: '拍攝前準備',
      content: `服裝須自備：工作室有學士服帽與黑色領帶，無提供其餘服裝。
自助整理工具：店裡備有吹風機、電捲棒與掛燙機可供使用。
維護環境整潔：工作室內請勿飲食，食物飲料垃圾請自行帶離。`,
    },
    {
      title: '交件時間',
      content: `標準件：拍攝後 7 日內交件，不提供當日交件服務。
急件加購：拍攝當下可加購急件費 100 元/張，可於拍攝隔日 18:00 前交件。`,
    },
    {
      title: '預約須知與注意事項',
      content: buildNotice(null),
    },
  ],
};

/* ── 2. 形象照｜加購妝髮方案 ── */
const portraitMakeup: ServiceDetailData = {
  heading: '形象照｜加購妝髮方案',
  sections: [
    {
      title: '造型到場時間',
      content: `＊預約系統顯示之時間為拍攝時間，若含妝髮服務，請提前到店完成造型準備。

女生基礎妝 / 男生基礎妝：請於拍攝時間前 40 分鐘到店。
女生精緻妝髮 / 男生精緻妝髮：請於拍攝時間前 1 小時 10 分鐘到店。
女生訂製妝髮：請於拍攝時間前 1 小時 40 分鐘到店。`,
    },
    {
      title: '服務說明與價格',
      content: `999 元/張：灰底半身形象照。
1199 元/張：灰底全身形象照。

妝髮造型價格（另加）：
女生基礎妝 800 元/人、男生基礎妝 600 元/人
女生精緻妝髮 1,500 元/人、男生精緻妝髮 1,200 元/人
女生訂製妝髮 3,000 元/人
＊價格為另加，造型服務內容詳見妝髮服務介紹。

灰色背景換白色背景總價加 500 元，全身照/白底照在後面備註即可。
成品交付：提供 Email JPG 專業修圖電子檔。
服務時長：拍攝約 30–50 張照片，攝影師會引導不同動作，含挑圖時間約 20–30 分鐘。\n\n${MAKEUP_RULE}`,
    },
    {
      title: '拍攝前準備',
      content: `服裝須自備：工作室有學士服帽與黑色領帶，無提供其餘服裝。
自助整理工具：店裡備有吹風機、電捲棒與掛燙機可供使用。
維護環境整潔：工作室內請勿飲食，食物飲料垃圾請自行帶離。`,
    },
    {
      title: '交件時間',
      content: `標準件：拍攝後 7 日內交件，不提供當日交件服務。
急件加購：拍攝當下可加購急件費 100 元/張，可於拍攝隔日 18:00 前交件。`,
    },
    {
      title: '預約須知與注意事項',
      content: buildNotice(null),
    },
  ],
};

/* ── 3. 合照｜僅攝影服務 ── */
const groupBasic: ServiceDetailData = {
  heading: '合照｜僅攝影服務（不含妝髮）',
  notice: '請提早 5 分鐘到店預備',
  sections: [
    {
      title: '服務說明與價格',
      content: `1199 元/張：2–6 人灰底合照。
灰色背景換白色背景總價加 500 元，全身照/白底照在後面備註即可。
加人費用：人數超過 6 人，每加一人總費用加 200 元，最多加至 9 人。
成品交付：提供 Email JPG 專業修圖電子檔。
服務時長：拍攝約 30–50 張照片，含挑圖時間約 30–45 分鐘。
系統僅顯示 15 分鐘為正常現象。`,
    },
    {
      title: '拍攝前準備',
      content: `服裝須自備：工作室有學士服帽與黑色領帶，無提供其餘服裝。
自助整理工具：店裡備有吹風機、電捲棒與掛燙機可供使用。
維護環境整潔：工作室內請勿飲食，食物飲料垃圾請自行帶離。`,
    },
    {
      title: '交件時間',
      content: `標準件：拍攝後 7 日內交件，不提供當日交件服務。
急件加購：拍攝當下可加購急件費 100 元/張，可於拍攝隔日 18:00 前交件。`,
    },
    {
      title: '預約須知與注意事項',
      content: buildNotice(null),
    },
  ],
};

/* ── 4. 合照｜加購妝髮方案 ── */
const groupMakeup: ServiceDetailData = {
  heading: '合照｜加購妝髮方案',
  sections: [
    {
      title: '造型到場時間',
      content: `＊預約系統顯示之時間為拍攝時間，若含妝髮服務，請提前到店完成造型準備。

女生基礎妝 / 男生基礎妝：請於拍攝時間前 40 分鐘到店。
女生精緻妝髮 / 男生精緻妝髮：請於拍攝時間前 1 小時 10 分鐘到店。
女生訂製妝髮：請於拍攝時間前 1 小時 40 分鐘到店。
＊預設一人加購造型，若有二人以上需加購造型請私訊官方 LINE。`,
    },
    {
      title: '服務說明與價格',
      content: `1199 元/張：2–6 人灰底合照。

妝髮造型價格（另加）：
女生基礎妝 800 元/人、男生基礎妝 600 元/人
女生精緻妝髮 1,500 元/人、男生精緻妝髮 1,200 元/人
女生訂製妝髮 3,000 元/人
＊價格為另加，造型服務內容詳見妝髮服務介紹。

灰色背景換白色背景總價加 500 元，全身照/白底照在後面備註即可。
加人費用：人數超過 6 人，每加一人總費用加 200 元，最多加至 9 人。
成品交付：提供 Email JPG 專業修圖電子檔。
服務時長：拍攝約 50–70 張照片，含挑圖時間約 30–45 分鐘。
系統僅顯示 15 分鐘為正常現象。

${MAKEUP_RULE}`,
    },
    {
      title: '交件時間',
      content: `標準件：拍攝後 7 日內交件，不提供當日交件服務。
急件加購：拍攝當下可加購急件費 100 元/張，可於拍攝隔日 18:00 前交件。`,
    },
    {
      title: '預約須知與注意事項',
      content: buildNotice(null),
    },
  ],
};

/* ── 3b. 孕婦寫真照｜僅攝影服務 ── */
const maternityBasic: ServiceDetailData = {
  heading: '孕婦寫真照｜僅攝影服務（不含妝髮）',
  notice: '請提早 5 分鐘到店預備',
  sections: [
    {
      title: '服務說明與價格',
      content: `999 元/張：灰底半身孕婦寫真照。
1199 元/張：灰底全身孕婦寫真照。
灰色背景換白色背景總價加 500 元，全身照/白底照在後面備註即可。
成品交付：提供 Email JPG 專業修圖電子檔。
服務時長：拍攝約 30–50 張照片，攝影師會引導不同動作，含挑圖時間約 30 分鐘。`,
    },
    {
      title: '拍攝前準備',
      content: `服裝須自備：工作室有學士服帽與黑色領帶，無提供其餘服裝。
自助整理工具：店裡備有吹風機、電捲棒與掛燙機可供使用。
維護環境整潔：工作室內請勿飲食，食物飲料垃圾請自行帶離。`,
    },
    {
      title: '交件時間',
      content: `標準件：拍攝後 7 日內交件，不提供當日交件服務。
急件加購：拍攝當下可加購急件費 100 元/張，可於拍攝隔日 18:00 前交件。`,
    },
    {
      title: '預約須知與注意事項',
      content: buildNotice(null),
    },
  ],
};

/* ── 4b. 孕婦寫真照｜加購妝髮方案 ── */
const maternityMakeup: ServiceDetailData = {
  heading: '孕婦寫真照｜加購妝髮方案',
  sections: [
    {
      title: '造型到場時間',
      content: `＊預約系統顯示之時間為拍攝時間，若含妝髮服務，請提前到店完成造型準備。

女生基礎妝 / 男生基礎妝：請於拍攝時間前 40 分鐘到店。
女生精緻妝髮 / 男生精緻妝髮：請於拍攝時間前 1 小時 10 分鐘到店。
女生訂製妝髮：請於拍攝時間前 1 小時 40 分鐘到店。`,
    },
    {
      title: '服務說明與價格',
      content: `999 元/張：灰底半身孕婦寫真照。
1199 元/張：灰底全身孕婦寫真照。

妝髮造型價格（另加）：
女生基礎妝 800 元/人、男生基礎妝 600 元/人
女生精緻妝髮 1,500 元/人、男生精緻妝髮 1,200 元/人
女生訂製妝髮 3,000 元/人
＊價格為另加，造型服務內容詳見妝髮服務介紹。

灰色背景換白色背景總價加 500 元，全身照/白底照在後面備註即可。
成品交付：提供 Email JPG 專業修圖電子檔。
服務時長：拍攝約 30–50 張照片，攝影師會引導不同動作，含挑圖時間約 20–30 分鐘。\n\n${MAKEUP_RULE}`,
    },
    {
      title: '拍攝前準備',
      content: `服裝須自備：工作室有學士服帽與黑色領帶，無提供其餘服裝。
自助整理工具：店裡備有吹風機、電捲棒與掛燙機可供使用。
維護環境整潔：工作室內請勿飲食，食物飲料垃圾請自行帶離。`,
    },
    {
      title: '交件時間',
      content: `標準件：拍攝後 7 日內交件，不提供當日交件服務。
急件加購：拍攝當下可加購急件費 100 元/張，可於拍攝隔日 18:00 前交件。`,
    },
    {
      title: '預約須知與注意事項',
      content: buildNotice(null),
    },
  ],
};

/* ── 3a. 寵物寫真合照｜僅攝影服務 ── */
const petBasic: ServiceDetailData = {
  heading: '寵物寫真合照｜僅攝影服務（不含妝髮）',
  notice: '請提早 5 分鐘到店預備',
  sections: [
    {
      title: '服務說明與價格',
      content: `1199 元/張：2–6 人灰底合照。
灰色背景換白色背景總價加 500 元，全身照/白底照在後面備註即可。
加人費用：人數超過 6 人，每加一人總費用加 200 元，最多加至 9 人。
寵物合照：預設一寵，加一寵加費用 200 元。
成品交付：提供 Email JPG 專業修圖電子檔。
服務時長：拍攝約 30–50 張照片，含挑圖時間約 30–45 分鐘。
系統僅顯示 15 分鐘為正常現象。`,
    },
    {
      title: '拍攝前準備',
      content: `服裝須自備：工作室有學士服帽與黑色領帶，無提供其餘服裝。
自助整理工具：店裡備有吹風機、電捲棒與掛燙機可供使用。
維護環境整潔：工作室內請勿飲食，食物飲料垃圾請自行帶離。`,
    },
    {
      title: '交件時間',
      content: `標準件：拍攝後 7 日內交件，不提供當日交件服務。
急件加購：拍攝當下可加購急件費 100 元/張，可於拍攝隔日 18:00 前交件。`,
    },
    {
      title: '預約須知與注意事項',
      content: buildNotice(null),
    },
  ],
};

/* ── 4a. 寵物寫真合照｜加購妝髮方案 ── */
const petMakeup: ServiceDetailData = {
  heading: '寵物寫真合照｜加購妝髮方案',
  sections: [
    {
      title: '造型到場時間',
      content: `＊預約系統顯示之時間為拍攝時間，若含妝髮服務，請提前到店完成造型準備。

女生基礎妝 / 男生基礎妝：請於拍攝時間前 40 分鐘到店。
女生精緻妝髮 / 男生精緻妝髮：請於拍攝時間前 1 小時 10 分鐘到店。
女生訂製妝髮：請於拍攝時間前 1 小時 40 分鐘到店。
＊預設一人加購造型，若有二人以上需加購造型請私訊官方 LINE。`,
    },
    {
      title: '服務說明與價格',
      content: `1199 元/張：2–6 人灰底合照。

妝髮造型價格（另加）：
女生基礎妝 800 元/人、男生基礎妝 600 元/人
女生精緻妝髮 1,500 元/人、男生精緻妝髮 1,200 元/人
女生訂製妝髮 3,000 元/人
＊價格為另加，造型服務內容詳見妝髮服務介紹。

灰色背景換白色背景總價加 500 元，全身照/白底照在後面備註即可。
加人費用：人數超過 6 人，每加一人總費用加 200 元，最多加至 9 人。
成品交付：提供 Email JPG 專業修圖電子檔。
服務時長：拍攝約 50–70 張照片，含挑圖時間約 30–45 分鐘。
系統僅顯示 15 分鐘為正常現象。

${MAKEUP_RULE}`,
    },
    {
      title: '交件時間',
      content: `標準件：拍攝後 7 日內交件，不提供當日交件服務。
急件加購：拍攝當下可加購急件費 100 元/張，可於拍攝隔日 18:00 前交件。`,
    },
    {
      title: '預約須知與注意事項',
      content: buildNotice(null),
    },
  ],
};

/* ── 5. 畢業證件照｜僅攝影服務 ── */
const idGraduationBasic: ServiceDetailData = {
  heading: '畢業證件照｜僅攝影服務（不含妝髮）',
  notice: '請提早 5 分鐘到店預備',
  sections: [
    {
      title: '服務說明與價格',
      content: `399 元/張：白底學士照。
成品內容：提供 Email JPG 專業修圖電子檔，僅提供照片比例 3.5×4.5 乙張。
服務時長：拍攝 5–10 張照片，含挑圖時間約 15–30 分鐘。
現場挑選：現場挑選最滿意的照片，如有多張照片需求可再按張計費。`,
    },
    {
      title: '拍攝前準備',
      content: `服裝準備：工作室有學士服帽與黑色領帶，無提供其餘服裝（服裝須自備）。
自助整理工具：店裡備有吹風機、電捲棒與掛燙機可供使用。
維護環境整潔：工作室內請勿飲食，食物飲料垃圾請自行帶離。`,
    },
    {
      title: '交件時間',
      content: `標準件：拍攝後 7 日內交件，不提供當日交件服務。
急件加購：拍攝當下可加購急件費 100 元/張，於拍攝隔日 18:00 前交件。`,
    },
    {
      title: '預約須知與注意事項',
      content: buildNotice(ID_EXCLUSIVE),
    },
  ],
};

/* ── 6. 畢業證件照｜加購妝髮方案 ── */
const idGraduationMakeup: ServiceDetailData = {
  heading: '畢業證件照｜加購妝髮方案',
  sections: [
    {
      title: '造型到場時間',
      content: `＊預約系統顯示之時間為拍攝時間，若含妝髮服務，請提前到店完成造型準備。

女生基礎妝 / 男生基礎妝：請於拍攝時間前 40 分鐘到店。
女生精緻妝髮 / 男生精緻妝髮：請於拍攝時間前 1 小時 10 分鐘到店。
女生訂製妝髮：請於拍攝時間前 1 小時 40 分鐘到店。`,
    },
    {
      title: '服務說明與價格',
      content: `399 元/張：白底學士照。

妝髮造型價格（另加）：
女生基礎妝 800 元/人、男生基礎妝 600 元/人
女生精緻妝髮 1,500 元/人、男生精緻妝髮 1,200 元/人
女生訂製妝髮 3,000 元/人
＊價格為另加，造型服務內容詳見妝髮服務介紹。

成品內容：提供 Email JPG 專業修圖電子檔，僅提供照片比例 3.5×4.5 乙張。
服務時長：拍攝 5–10 張照片，含挑圖時間約 15–30 分鐘。

${MAKEUP_RULE}`,
    },
    {
      title: '拍攝前準備',
      content: `服裝準備：工作室有學士服帽與黑色領帶，無提供其餘服裝（服裝須自備）。
自助整理工具：店裡備有吹風機、電捲棒與掛燙機可供使用。
維護環境整潔：工作室內請勿飲食，食物飲料垃圾請自行帶離。`,
    },
    {
      title: '交件時間',
      content: `標準件：拍攝後 7 日內交件，不提供當日交件服務。
急件加購：拍攝當下可加購急件費 100 元/張，於拍攝隔日 18:00 前交件。`,
    },
    {
      title: '預約須知與注意事項',
      content: buildNotice(ID_EXCLUSIVE),
    },
  ],
};

/* ── 7. 正式證件照｜僅攝影服務 ── */
const idFormalBasic: ServiceDetailData = {
  heading: '正式證件照｜僅攝影服務（不含妝髮）',
  notice: '請提早 5 分鐘到店預備',
  sections: [
    {
      title: '服務說明與價格',
      content: `399 元/張：白底正式證件照。
成品內容：提供 Email JPG 專業修圖電子檔，依不同證件類型提供對應規格尺寸。
服務時長：拍攝 5–10 張照片，含挑圖時間約 15–30 分鐘。
現場挑選：現場挑選最滿意的照片，如有多張照片需求可再按張計費。`,
    },
    {
      title: '拍攝前準備',
      content: `服裝準備：請穿著有領上衣或正式服裝，避免穿白色上衣以免與白底背景融合。
眼鏡與飾品：可佩戴細框眼鏡，但建議避免反光鏡片；耳環等飾品請盡量簡單或避免。
妝容建議：可淡妝出席，但不提供更換妝容的服務。
自助整理工具：店裡備有吹風機、電捲棒與掛燙機可供使用。
維護環境整潔：工作室內請勿飲食，食物飲料垃圾請自行帶離。`,
    },
    {
      title: '交件時間',
      content: `標準件：拍攝後 7 日內交件，不提供當日交件服務。
急件加購：拍攝當下可加購急件費 100 元/張，於拍攝隔日 18:00 前交件。`,
    },
    {
      title: '預約須知與注意事項',
      content: buildNotice(ID_EXCLUSIVE),
    },
  ],
};

/* ── 8. 正式證件照｜加購妝髮方案 ── */
const idFormalMakeup: ServiceDetailData = {
  heading: '正式證件照｜加購妝髮方案',
  sections: [
    {
      title: '造型到場時間',
      content: `＊預約系統顯示之時間為拍攝時間，若含妝髮服務，請提前到店完成造型準備。

女生基礎妝 / 男生基礎妝：請於拍攝時間前 40 分鐘到店。
女生精緻妝髮 / 男生精緻妝髮：請於拍攝時間前 1 小時 10 分鐘到店。
女生訂製妝髮：請於拍攝時間前 1 小時 40 分鐘到店。`,
    },
    {
      title: '服務說明與價格',
      content: `399 元/張：白底正式證件照。

妝髮造型價格（另加）：
女生基礎妝 800 元/人、男生基礎妝 600 元/人
女生精緻妝髮 1,500 元/人、男生精緻妝髮 1,200 元/人
女生訂製妝髮 3,000 元/人
＊價格為另加，造型服務內容詳見妝髮服務介紹。

成品內容：提供 Email JPG 專業修圖電子檔，依不同證件類型提供對應規格尺寸。
服務時長：拍攝 5–10 張照片，含挑圖時間約 15–30 分鐘。

${MAKEUP_RULE}`,
    },
    {
      title: '拍攝前準備',
      content: `服裝準備：請穿著有領上衣或正式服裝，避免穿白色上衣以免與白底背景融合。
眼鏡與飾品：可佩戴細框眼鏡，但建議避免反光鏡片；耳環等飾品請盡量簡單或避免。
妝容建議：可淡妝出席，但不提供更換妝容的服務。
自助整理工具：店裡備有吹風機、電捲棒與掛燙機可供使用。
維護環境整潔：工作室內請勿飲食，食物飲料垃圾請自行帶離。`,
    },
    {
      title: '交件時間',
      content: `標準件：拍攝後 7 日內交件，不提供當日交件服務。
急件加購：拍攝當下可加購急件費 100 元/張，於拍攝隔日 18:00 前交件。`,
    },
    {
      title: '預約須知與注意事項',
      content: buildNotice(ID_EXCLUSIVE),
    },
  ],
};

const standaloneMakeup: ServiceDetailData = {
  heading: '單妝髮｜專業妝髮造型（不含拍攝）',
  notice: '＊預約時段即為妝髮開始時間，請準時到店。',
  sections: [
    {
      title: '服務說明',
      content: `單妝髮為獨立妝髮服務，不含棚拍。

女生基礎妝 / 男生基礎妝：約 30 分鐘
女生精緻妝髮 / 男生精緻妝髮：約 1 小時
女生訂製妝髮：約 1.5 小時

＊建議素顏或淡妝到店，頭髮維持乾燥即可。`,
    },
    {
      title: '價格（官網方案）',
      content: `女生基礎妝 $800、男生基礎妝 $600
女生精緻妝髮 $1,500、男生精緻妝髮 $1,200
女生訂製妝髮 $3,000

＊現場結帳依實際方案計價。`,
    },
    {
      title: '預約須知',
      content: `· 請選擇妝髮開始時間，非拍攝時間
· 如需取消或改期，請私訊官方 LINE（@goldenyearsphoto）
· 收到預約確認信才代表預約成功`,
    },
  ],
};

export const SERVICE_DETAILS: Record<string, ServiceDetailData> = {
  'standalone-makeup': standaloneMakeup,
  'portrait-basic': portraitBasic,
  'portrait-makeup': portraitMakeup,
  'group-basic': groupBasic,
  'group-makeup': groupMakeup,
  'maternity-basic': maternityBasic,
  'maternity-makeup': maternityMakeup,
  'pet-basic': petBasic,
  'pet-makeup': petMakeup,
  'id-graduation-basic': idGraduationBasic,
  'id-graduation-makeup': idGraduationMakeup,
  'id-formal-basic': idFormalBasic,
  'id-formal-makeup': idFormalMakeup,
};