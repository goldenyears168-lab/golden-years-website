import { useEffect } from "react";

/**
 * 動態更新頁面的 SEO meta 標籤（title、description、keywords、og:title、og:description、twitter:title、twitter:description、last-modified）
 * 用於 SPA 中每個路由切換時自動更新 head 內容，避免全站共用同一個 description
 */
interface PageSEOProps {
  title: string;
  description: string;
  keywords?: string;
}

export default function PageSEO({ title, description, keywords }: PageSEOProps) {
  useEffect(() => {
    const previousTitle = document.title;
    const previousDescription =
      document.querySelector('meta[name="description"]')?.getAttribute("content") || "";
    const previousOgDesc =
      document.querySelector('meta[property="og:description"]')?.getAttribute("content") || "";
    const previousTwDesc =
      document.querySelector('meta[name="twitter:description"]')?.getAttribute("content") || "";
    const previousOgTitle =
      document.querySelector('meta[property="og:title"]')?.getAttribute("content") || "";
    const previousTwTitle =
      document.querySelector('meta[name="twitter:title"]')?.getAttribute("content") || "";
    const previousKeywords =
      document.querySelector('meta[name="keywords"]')?.getAttribute("content") || "";
    const previousLastModified =
      document.querySelector('meta[http-equiv="last-modified"]')?.getAttribute("content") || "";

    // 更新 title
    document.title = title;

    // 更新或創建 description meta
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    // 更新 og:title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", title);

    // 更新 og:description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement("meta");
      ogDesc.setAttribute("property", "og:description");
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute("content", description);

    // 更新 twitter:title
    let twTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twTitle) {
      twTitle = document.createElement("meta");
      twTitle.setAttribute("name", "twitter:title");
      document.head.appendChild(twTitle);
    }
    twTitle.setAttribute("content", title);

    // 更新 twitter:description
    let twDesc = document.querySelector('meta[name="twitter:description"]');
    if (!twDesc) {
      twDesc = document.createElement("meta");
      twDesc.setAttribute("name", "twitter:description");
      document.head.appendChild(twDesc);
    }
    twDesc.setAttribute("content", description);

    // 更新 keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", keywords);
    }

    // 更新 last-modified（自動設為今天）
    let lastModified = document.querySelector('meta[http-equiv="last-modified"]');
    if (!lastModified) {
      lastModified = document.createElement("meta");
      lastModified.setAttribute("http-equiv", "last-modified");
      document.head.appendChild(lastModified);
    }
    lastModified.setAttribute("content", new Date().toISOString().split("T")[0]);

    // 組件卸載時恢復
    return () => {
      document.title = previousTitle;
      const d = document.querySelector('meta[name="description"]');
      if (d) d.setAttribute("content", previousDescription);
      const o = document.querySelector('meta[property="og:description"]');
      if (o) o.setAttribute("content", previousOgDesc);
      const t = document.querySelector('meta[name="twitter:description"]');
      if (t) t.setAttribute("content", previousTwDesc);
      const ot = document.querySelector('meta[property="og:title"]');
      if (ot) ot.setAttribute("content", previousOgTitle);
      const tt = document.querySelector('meta[name="twitter:title"]');
      if (tt) tt.setAttribute("content", previousTwTitle);
      const k = document.querySelector('meta[name="keywords"]');
      if (k) k.setAttribute("content", previousKeywords);
      const lm = document.querySelector('meta[http-equiv="last-modified"]');
      if (lm) lm.setAttribute("content", previousLastModified);
    };
  }, [title, description, keywords]);

  return null;
}