import { useEffect } from "react";

/**
 * 動態更新頁面的 SEO meta 標籤（title、description、og:description、twitter:description）
 * 用於 SPA 中每個路由切換時自動更新 head 內容，避免全站共用同一個 description
 */
interface PageSEOProps {
  title: string;
  description: string;
}

export default function PageSEO({ title, description }: PageSEOProps) {
  useEffect(() => {
    const previousTitle = document.title;
    const previousDescription =
      document.querySelector('meta[name="description"]')?.getAttribute("content") || "";
    const previousOgDesc =
      document.querySelector('meta[property="og:description"]')?.getAttribute("content") || "";
    const previousTwDesc =
      document.querySelector('meta[name="twitter:description"]')?.getAttribute("content") || "";

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

    // 更新 og:description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement("meta");
      ogDesc.setAttribute("property", "og:description");
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute("content", description);

    // 更新 twitter:description
    let twDesc = document.querySelector('meta[name="twitter:description"]');
    if (!twDesc) {
      twDesc = document.createElement("meta");
      twDesc.setAttribute("name", "twitter:description");
      document.head.appendChild(twDesc);
    }
    twDesc.setAttribute("content", description);

    // 組件卸載時恢復
    return () => {
      document.title = previousTitle;
      const d = document.querySelector('meta[name="description"]');
      if (d) d.setAttribute("content", previousDescription);
      const o = document.querySelector('meta[property="og:description"]');
      if (o) o.setAttribute("content", previousOgDesc);
      const t = document.querySelector('meta[name="twitter:description"]');
      if (t) t.setAttribute("content", previousTwDesc);
    };
  }, [title, description]);

  return null;
}