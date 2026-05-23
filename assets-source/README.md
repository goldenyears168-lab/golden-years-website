# assets-source（原始圖片）

此目錄存放從舊站下載的**未壓縮**圖片，路徑與 R2 key 對齊（副檔名為下載時的 jpg/png/jpeg）。

- 由 `npm run media:download` 依 `assets/manifest/inventory.json` 填入
- **不要** commit 大量圖片（已在 `.gitignore`）
- 壓縮後產物在 `.tmp-media-optimized/`，再上傳 R2

子資料夾為**英文語意路徑**（與 R2 / 程式 `cdnAsset()` 一致），例如：

```
assets-source/
  home/hero/slide-003.jpg
  brand/logo-header.jpg
  portfolio/corporate/group-010.jpg
```

舊路徑（含 `need-5` 等）可用 `npm run media:rename-sources` 從舊檔複製到新路徑；對照表見 `assets/manifest/r2-key-map.json`。

外部來源（Readdy logo、Cloudinary 門市圖等）見 `assets/manifest/external-sources.json`。
