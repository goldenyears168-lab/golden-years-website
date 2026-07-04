# 好時有影 Google Ads 投放計畫

> **品牌**：好時有影 Golden Years Studio  
> **官網**：https://goldenyearsphoto.com  
> **預約入口**：https://goldenyearsphoto.com/booking  
> **技術方案**：Google Ads 雲端 + Cursor MCP（`@isteam/google-ads-mcp`）  
> **資料策略**：不另建 SQLite / Supabase；campaign、關鍵字、報表、轉換皆存於 Google Ads 帳戶

---

## 1. 方案摘要

| 項目 | 決策 |
|------|------|
| 資料存放 | **Google Ads 雲端**（唯一真相來源） |
| 操作介面 | **Cursor + MCP**（自然語言管理 campaign） |
| MCP Server | [`@isteam/google-ads-mcp`](https://github.com/isteamhq/google-ads-mcp)（27 工具，讀寫） |
| 本地資料庫 | ❌ 不使用 SQLite |
| 報表快照 DB | ❌ 不使用 Supabase |
| 轉換追蹤 | Google Ads Conversion + GA4（若已串接） |
| 主要 KPI | 線上預約完成、LINE 諮詢（次要） |

### 架構

```
Cursor AI Agent
      ↓ MCP（stdio）
@isteam/google-ads-mcp
      ↓ Google Ads API
Google Ads 帳戶（campaign / keyword / ad / budget / conversion）
      ↓ 點擊
goldenyearsphoto.com（落地頁 → /booking）
```

---

## 2. Cursor MCP 設定

在專案根目錄建立 `.cursor/mcp.json`（勿 commit 含真實 token 的版本；可 commit 範本）：

```json
{
  "mcpServers": {
    "google-ads": {
      "command": "npx",
      "args": ["-y", "@isteam/google-ads-mcp"],
      "env": {
        "GOOGLE_ADS_CLIENT_ID": "YOUR_CLIENT_ID",
        "GOOGLE_ADS_CLIENT_SECRET": "YOUR_CLIENT_SECRET",
        "GOOGLE_ADS_DEVELOPER_TOKEN": "YOUR_DEVELOPER_TOKEN",
        "GOOGLE_ADS_REFRESH_TOKEN": "YOUR_REFRESH_TOKEN",
        "GOOGLE_ADS_CUSTOMER_ID": "XXX-XXX-XXXX"
      }
    }
  }
}
```

### 前置憑證清單

1. [Google Ads Developer Token](https://developers.google.com/google-ads/api/docs/get-started/dev-token)（至少 Explorer）
2. Google Cloud 專案 + 啟用 **Google Ads API**
3. OAuth 2.0 Client ID / Secret
4. Refresh Token（scope：`https://www.googleapis.com/auth/adwords`）
5. Customer ID（廣告帳戶；若走 MCC 再加 `GOOGLE_ADS_LOGIN_CUSTOMER_ID`）

### 安全規則

- 憑證只放本機 env 或 Cursor MCP 設定，**不寫進 repo**
- 新建 campaign / ad / keyword **預設 PAUSED**，人工確認後再 enable
- 變更前先 `list_campaigns` / `list_keywords` 確認，避免重複建立
- 每週用 MCP 做 search terms 審核，再批量加 negative

---

## 3. 品牌與投放目標

### 品牌定位

台北專業形象照攝影工作室，服務履歷照、LinkedIn 形象照、醫師白袍照、畢業寫真、韓式證件照、情侶/全家福等。兩間門市：**中山店**、**公館店**。

### 目標受眾

| 族群 | 需求 | 對應服務 |
|------|------|----------|
| 求職者 / 實習生 | 履歷、面試形象 | 求職履歷照、LinkedIn 形象照 |
| 大學 / 研究所畢業生 | 畢業紀念 | 畢業寫真、畢業證件照 |
| 醫護從業 | 白袍、證照 | 醫師白袍照 |
| 一般民眾 | 證件、大頭照 | 韓式證件照、正式證件照 |
| 情侶 / 家庭 / 朋友 | 紀念寫真 | 情侶、全家福、朋友寫真 |
| 企業 HR / 採購 | 團體形象照 | 企業團體合作（LINE 洽詢） |

### 投放目標（Phase 1）

- **主要轉換**：`/booking` 預約流程完成
- **次要轉換**：`/price-list` 瀏覽後進入 booking
- **不追求**：純品牌曝光（留 Phase 2）

---

## 4. Campaign 結構

建議 **Search Network only**，依服務線分 campaign，方便控預算與寫 ad copy。

```
Account: 好時有影
├── GY_Search_Resume          求職履歷 / LinkedIn
├── GY_Search_Graduation      畢業寫真 / 證件
├── GY_Search_Doctor          醫師白袍照
├── GY_Search_IDPhoto         韓式證件照 / 大頭照
├── GY_Search_Portrait        個人寫真 / 情侶 / 全家福
├── GY_Search_Makeup          妝髮（加購或單妝髮）
└── GY_Search_Brand           品牌詞防禦（好時有影、golden years）
```

### 地理與語言

| 設定 | 值 |
|------|-----|
| 地區 | 台北市 + 新北（可擴大至桃園、基隆） |
| 半徑加強 | 中山店、公館店各 8–12 km（測試用） |
| 語言 | 繁體中文 |
| 裝置 | 全裝置；行動 bid +10%～+20%（預約以手機為主） |

### 出價策略（建議）

| Campaign | 策略 | 說明 |
|----------|------|------|
| Resume / ID / Graduation | Maximize Conversions | 有轉換資料後啟用 |
| Doctor / Portrait | Maximize Clicks → 再轉 Conversions | 流量較小，先累資料 |
| Brand | Manual CPC（低 bid） | 防競品搶品牌詞 |

---

## 5. Ad Group 與關鍵字策略

### 5.1 GY_Search_Resume（求職 / LinkedIn）

**落地頁**：https://goldenyearsphoto.com/booking（服務：求職履歷照 / 職業形象照）

| Ad Group | Match | 關鍵字範例 |
|----------|-------|------------|
| 履歷照_核心 | Exact, Phrase | [台北履歷照], [履歷照攝影], "台北 履歷 形象照" |
| LinkedIn_核心 | Exact, Phrase | [LinkedIn 形象照], "LinkedIn 照片 台北" |
| 求職_長尾 | Phrase | "求職 形象照 台北", "實習 履歷 照片" |

**RSA 標題方向**（≤30 字）：台北履歷照 NT$999、專業形象一站完成、線上預約、中山/公館兩店

---

### 5.2 GY_Search_Graduation（畢業）

**落地頁**：https://goldenyearsphoto.com/booking（畢業寫真 / 畢業證件照）

| Ad Group | 關鍵字範例 |
|----------|------------|
| 畢業寫真 | [台北畢業寫真], "大學 畢業 寫真 台北", "碩士 畢業照" |
| 畢業證件 | [畢業證件照], "畢業 大頭照 台北" |

**季節性**：5–7 月、11–1 月加預算 30%～50%

---

### 5.3 GY_Search_Doctor（醫師白袍）

**落地頁**：https://goldenyearsphoto.com/booking（醫師白袍照）

| Ad Group | 關鍵字範例 |
|----------|------------|
| 白袍照 | [醫師白袍照], [白袍照 台北], "醫師 形象照" |
| 醫學生 | "醫學生 白袍照", "台大 白袍照"（Phrase，需審 search terms） |

---

### 5.4 GY_Search_IDPhoto（證件照）

**落地頁**：https://goldenyearsphoto.com/booking（正式證件照 / 畢業證件照）

| Ad Group | 關鍵字範例 |
|----------|------------|
| 韓式證件 | [韓式證件照], [台北韓式證件照], "證件照 推薦 台北" |
| 證件_用途 | "護照 大頭照", "履歷 證件照"（Phrase） |

**出價注意**：證件照競爭高、客單 NT$399 起，需嚴控 CPA

---

### 5.5 GY_Search_Portrait（寫真 / 合照）

**落地頁**：https://goldenyearsphoto.com/booking

| Ad Group | 關鍵字範例 |
|----------|------------|
| 情侶寫真 | [情侶寫真 台北], "情侶 寫真 攝影" |
| 全家福 | [全家福 台北], "家庭 寫真" |
| 個人寫真 | [個人寫真 台北], "形象 寫真 攝影" |

---

### 5.6 GY_Search_Makeup（妝髮）

**落地頁**：https://goldenyearsphoto.com/hair-makeup → CTA 至 `/booking`

| Ad Group | 關鍵字範例 |
|----------|------------|
| 證件妝容 | "證件照 化妝", "證件照 妝髮 台北" |
| 形象妝髮 | "形象照 化妝師", "男生 證件照 造型" |

---

### 5.7 GY_Search_Brand（品牌防禦）

| Ad Group | 關鍵字 |
|----------|--------|
| 品牌_exact | [好時有影], [golden years 攝影], [好時有影 公館] |

---

## 6. 負向關鍵字（全帳戶共用）

建立 **Shared Negative List**：`GY_Negatives_Global`，套用到所有 Search campaign。

### 6.1 意圖不符

```
免費, 自己拍, 教學, 課程, 證照班, 修圖 app, 美圖, 自拍
```

### 6.2 地區不符

```
高雄, 台中, 台南, 桃園 證件照（若未投該區）
```

### 6.3 服務不符

```
婚紗, 婚禮攝影, 活動紀錄, 商品攝影, 空拍, 錄影
```

### 6.4 競品 / 無關品牌

```
天真藍, 海马体, 快拍, 7-11 證件照（依實際 search terms 補充）
```

### MCP 維護節奏

**每週一次**（Cursor 指令範例）：

> 用 search_terms_report 列出過去 30 天 clicks ≥ 5 且 conversions = 0 的 search terms，依 GY_Negatives_Global 規則建議 exact negative，先列出清單等我確認再加。

---

## 7. 廣告文案與落地頁對照

| Campaign | 主要落地頁 | 備用 |
|----------|------------|------|
| Resume | `/booking` | `/price-list` |
| Graduation | `/booking` | `/photography` |
| Doctor | `/booking` | 作品集 doctor 區 |
| IDPhoto | `/booking` | `/crop-tool`（裁切工具，拉長停留） |
| Portrait | `/booking` | `/photography` |
| Makeup | `/hair-makeup` | `/booking` |
| Brand | `/` | `/booking` |

### RSA 描述共通元素

- 價格透明：履歷/寫真 NT$999 起、證件 NT$399 起
- 兩店：中山站、公館站
- CTA：線上預約、立即選時段
- 信任：兩萬+顧客、台大/企業客戶（文案需符合 Google 政策，避免未可證明 superlative）

### 追蹤參數（建議）

```
?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}
```

落地頁 `/booking` 已支援 query；後續可於 GA4 對照 campaign。

---

## 8. 轉換設定

全部在 **Google Ads 介面** 設定，不另建 DB。

| 轉換動作 | 類型 | 觸發 |
|----------|------|------|
| Booking_Complete | 主要 | `/booking/thank-you` 或預約成功 event |
| Booking_Start | 次要 | 進入 `/booking` 並選服務 |
| LINE_Click | 次要 | 點擊 `line.me/@goldenyearsphoto`（若可 GTM 追蹤） |

**注意**：轉換需與官網 GTM / gtag 一致；上線前用 Google Tag Assistant 驗證。

---

## 9. 預算建議（測試期）

假設月預算 **NT$30,000～50,000**（可依實際調整）：

| Campaign | 日預算佔比 | 備註 |
|----------|------------|------|
| Resume | 25% | 全年穩定需求 |
| IDPhoto | 20% | 競價高，嚴控 ROAS |
| Graduation | 15%（淡季可降） | 季節波動大 |
| Doctor | 10% | 精準但量小 |
| Portrait | 15% | 情侶/全家福 |
| Makeup | 5% | 加購導流 |
| Brand | 5% | 低 CPC 防禦 |
| 保留 / 測試 | 5% | 新關鍵字試投 |

---

## 10. MCP 操作手冊（Cursor 指令）

### 10.1 關鍵字研究

```
幫我用 keyword_ideas 查「台北 履歷照」「韓式證件照」「醫師 白袍照」的搜尋量與競爭度，整理成表格建議放入哪個 campaign。
```

### 10.2 建立 Campaign（安全流程）

```
建立 Search campaign「GY_Search_Resume」，日預算 NT$500 等值（約 USD 15），
地區台北市+新北，語言繁中，狀態 PAUSED。
建立 ad group「履歷照_核心」，加 5 個 exact match 關鍵字，
再建一組 RSA（15 標題 + 4 描述），全部 PAUSED。完成後列出 resource ID 給我確認。
```

### 10.3 成效檢視

```
列出過去 7 天各 campaign 的 impressions, clicks, CTR, cost, conversions，
並標出 CPA 最高與最低的 ad group。
```

### 10.4 關鍵字優化

```
用 keyword_report 找出 CTR < 1% 且 impressions > 100 的關鍵字，建議 pause 或降 bid。
```

### 10.5 負向關鍵字

```
用 search_terms_report 找過去 30 天 spend > NT$100 且零轉換的詞，
對照 GY_Negatives_Global 規則，產出待加 exact negative 清單（先不要直接加）。
```

### 10.6 常用 MCP 工具對照

| 工作 | MCP Tool |
|------|----------|
| 查帳戶 campaign | `list_campaigns` |
| 新增關鍵字 | `add_keywords` |
| 關鍵字建議 | `keyword_ideas` |
| 關鍵字成效 | `keyword_report` |
| Search terms | `search_terms_report` |
| 建 campaign | `create_campaign` |
| 調預算 | `update_budget` |
| 自訂 GAQL | `custom_query` |

---

## 11. 上線時程（4 週）

### Week 1：基礎建設

- [ ] 申請 / 確認 Developer Token、OAuth
- [ ] 設定 Cursor `.cursor/mcp.json`
- [ ] MCP 連線測試：`list_campaigns`
- [ ] Google Ads 轉換動作 + 官網 tag 驗證
- [ ] 建立 `GY_Negatives_Global` shared list

### Week 2：Campaign 建立（全部 PAUSED）

- [ ] MCP 建立 7 個 campaign 結構
- [ ] 每 campaign 至少 1 ad group + RSA + 5–10 keywords
- [ ] 人工審核文案、落地頁、UTM
- [ ] Preview：確認無 policy 問題

### Week 3：小量測試

- [ ] 先 enable **Brand + Resume + IDPhoto**（約 60% 預算）
- [ ] 每日 MCP 查 search terms
- [ ] 每 3 天加一批 confirmed negatives

### Week 4：擴量與優化

- [ ] 依 CPA 決定是否 enable Graduation / Portrait
- [ ] 調整 bid / 預算分配
- [ ] 建立每週 MCP 報表 routine（固定 Cursor prompt）

---

## 12. 成功指標

| 指標 | 4 週目標 | 12 週目標 |
|------|----------|-----------|
| 轉換（預約完成） | ≥ 15 / 月 | ≥ 40 / 月 |
| CPA | < NT$800 | < NT$600 |
| Search IS（品牌） | > 90% | > 95% |
| 無效 click 率 | < 15% | < 10% |
| Quality Score 均值 | ≥ 6 | ≥ 7 |

*CPA 需依實際客單（NT$399–1,199）與毛利再校準。*

---

## 13. 風險與限制

| 風險 | 緩解 |
|------|------|
| MCP 誤建重複 campaign | 建立前 `list_campaigns`；命名規範 `GY_*` |
| API rate limit | 批量操作間隔；避免迴圈重複查詢 |
| 證件照 CPC 過高 | 獨立 campaign 設 CPA 上限；積極 negatives |
| 轉換追蹤漏計 | 上線前 Tag Assistant；對照 Supabase bookings 筆數（僅人工核對，不作 Ads 資料源） |
| 社群 MCP 非官方 | 重要變更先在 PAUSED 環境測試 |

---

## 14. 附錄：官網服務 ↔ Campaign 對照

| 官網服務 ID | 服務名稱 | 起價 | Campaign |
|-------------|----------|------|----------|
| resume | 求職履歷照 | 999 | GY_Search_Resume |
| professional | 職業形象照 | 999 | GY_Search_Resume |
| graduation | 畢業寫真照 | 999 | GY_Search_Graduation |
| doctor | 醫師白袍照 | 999 | GY_Search_Doctor |
| id-formal | 正式證件照 | 399 | GY_Search_IDPhoto |
| id-graduation | 畢業證件照 | 399 | GY_Search_Graduation |
| couple | 情侶寫真照 | 1199 | GY_Search_Portrait |
| family | 全家福照 | 1199 | GY_Search_Portrait |
| friends | 朋友/畢業合照 | 1199 | GY_Search_Portrait |
| personal-portrait | 個人寫真 | 999 | GY_Search_Portrait |
| standalone-makeup | 單妝髮 | 600 | GY_Search_Makeup |

**門市**

| 店別 | 地址 | 備註 |
|------|------|------|
| 中山店 | 台北市中山區南京東路一段10號4樓 | 捷運中山站 2 號出口 |
| 公館店 | 台北市中正區汀州路三段160巷4號6樓 | 捷運公館站 1 號出口 |

---

## 15. 修訂紀錄

| 日期 | 版本 | 說明 |
|------|------|------|
| 2026-07-03 | 1.0 | 初版：Google Ads 雲端 + isteam MCP + 好時有影 campaign 結構 |

---

*本文件為投放策略與 MCP 操作計畫；實際花費、出價與關鍵字以 Google Ads 帳戶為準，透過 Cursor MCP 查詢與更新。*
