# 媒體資產管線（R2 / WebP）

公開 CDN：`https://photo.goldenyearsphoto.com`（Cloudflare R2 自訂網域）

| 目錄 | 用途 | 是否進 Git |
|------|------|------------|
| `assets-source/` | 從舊 CDN / Cloudinary / Readdy 下載的**原始檔** | 僅結構與 README；圖片本體在 `.gitignore` |
| `assets/manifest/` | 清單 `inventory.json`、外部來源對照 | ✅ |
| `assets/specs/` | 各區塊壓縮規格說明 | ✅ |
| `.tmp-media-optimized/` | 壓縮後待上傳 R2（WebP） | ❌ 不 commit |

程式中的 URL 集中於 `src/config/cdn.ts`（`cdnAsset` / `cdnAssetRange`）與 `src/config/images.ts`。

### URL 命名規則（R2 公開網址）

- 格式：`https://photo.goldenyearsphoto.com/{section}/{name}.webp`
- 全英文、小寫、`-` 分詞；**不含** `need`、編號前綴、`taipei` 冗詞
- 範例：
  - `home/hero/slide-003.webp`
  - `pricing/portrait/category-001.webp`
  - `portfolio/corporate/group-010.webp`
- 舊 key → 新 key：`assets/manifest/r2-key-map.json`

## 工作流程

```bash
# 1. 依程式碼產生清單
npm run media:inventory

# 1b.（可選）已下載舊路徑檔案時，複製到新英文路徑
npm run media:rename-sources

# 2. 下載原始檔 → assets-source/
npm run media:download

# 3. 壓縮為 WebP → .tmp-media-optimized/
npm run media:optimize

# 4. 上傳 R2（需 .env 內 R2 憑證）
npm run media:upload

# 試跑上傳（不寫入）
npm run media:upload -- --dry-run
```

## Cloudflare 設定檢查

1. R2 bucket 已建立並綁定 `photo.goldenyearsphoto.com`
2. 物件 `Cache-Control: public, max-age=31536000, immutable`（上傳腳本已設定）
3. 確認範例 URL 可開：  
   `https://photo.goldenyearsphoto.com/01-taipei-homepage-hero-carousel-need-5/taipei-professional-headshot-studio-homepage-hero-003.webp`

## 環境變數

見專案根目錄 `.env.example`（`VITE_CDN_BASE_URL`、R2 上傳用變數）。
