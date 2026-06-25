# 好時有影 Golden Years Studio

## 專案背景
好時有影是一家台北的專業形象照攝影工作室，主要提供履歷照、LinkedIn 形象照、醫師白袍照、畢業寫真、韓式證件照等服務。

## 品牌定位
我們不只提供攝影服務，更在乎每一次拍攝背後的故事與意義。從求職履歷到人生里程碑，好時有影與你一起走過。

## 目標市場
- 求職者與職涯人士
- 頂尖學府學生（台大、政大、交大等）
- 醫療專業人士
- 企業客戶（Amazon、MSD、微軟等）
- 畢業生

## 品牌主張
不只是拍照，更是陪伴人們走向人生下一階段。

## 網站地圖

### 已上線頁面
- `/` - 首頁（品牌形象、服務介紹、作品集、流程說明）
- `/about` - 關於好時（品牌故事、里程碑、團隊、價值觀）
- `/price-list` - 價目表（各類服務價格）
- `/photography` - 攝影服務詳細介紹
- `/hair-makeup` - 妝髮服務詳細介紹
- `/crop-tool` - 自助裁切大頭照工具
- `/courses` - 課程活動（挑戰一日攝影師等）
- `/blog` - 好時誌（品牌部落格）
- `/booking` - 線上預約

## 舊網址對應
| 舊網址 | 新站路由 |
|---|---|
| `/price-list/` | `/price-list` |
| `/guide/crop-tool/` | `/crop-tool` |
| `/guide/makeup-and-hair/` | `/hair-makeup` |
| `/services/photography/` | `/photography` |

## 設計風格
- 暖色調、專業感、文學感
- 奶油色/米白色背景
- 深藍色品牌主色
- 金色點綴
- 優雅襯線字體

## 圖片風格
- 高品質工作室攝影
- 溫暖燈光
- 乾淨背景
- 真實感、親切感

## 互動特色
- 作品集 Lightbox
- 錨點導航
- 平滑滾動
- Scroll Reveal 動畫
- 響應式設計
- 行動版漢堡選單

## Supabase 遷移計畫（方案 C：先準備後切換）

### 遷移目標
將「好時官網預約」Supabase 專案的所有資料庫 schema、資料、函數、索引、RLS 策略，完整複製到 `goldeneyears168-lab` 專案。

### 遷移步驟
1. **Phase 1：備份與準備** — 在 `goldeneyears168-lab` 執行 Schema 建立腳本
2. **Phase 2：資料匯入** — 將現有資料分批匯入新專案
3. **Phase 3：Edge Functions 重建** — 重新部署所有邊緣函數
4. **Phase 4：切換驗證** — 斷開 Readdy 與「好時官網預約」，重新連接到 `goldeneyears168-lab`

### 遷移文件
- `supabase/schema-goldeneyears-lab.sql` — 完整 Schema 建立腳本（含 11 張表、enum、20+ 函數、30+ 索引、30+ RLS 策略）

### 已知問題
- `manual_bookings` 表已不存在，但函數 `check_in_manual_booking` 仍有引用（需手動清理）
- `claim_makeup_artist` 函數有同名重複（參數不同），需確認使用版本
- Edge Functions 本地原始碼已遺失（需從 Supabase 下載或重新撰寫）

### 資料量統計
| 表名 | 筆數 |
|------|------|
| bookings | 227+ |
| staff | 待確認 |
| shoot_sessions | 待確認 |
| 其他 | 待確認 |

### 風險提醒
- 切換過程中預約功能會暫停（建議低峰時段執行）
- 切換後「好時官網預約」專案將不再連接 Readdy
- Edge Functions 的 Secrets（SimplyBook API、LINE Token 等）需重新設定