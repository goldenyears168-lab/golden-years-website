import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * 动态更新 canonical 标签
 * SPA 中每个路由都需要自己的 canonical URL，防止搜索引擎把
 * /about 和 /about/ 或 /about?foo=bar 视为重复内容
 */
function CanonicalMeta() {
  const { pathname } = useLocation();
  const linkRef = useRef<HTMLLinkElement | null>(null);

  useEffect(() => {
    // 只使用 pathname，排除查询参数、hash，避免 URL 参数导致重复内容
    const canonicalUrl = `https://goldenyearsphoto.com${pathname.endsWith("/") ? pathname : `${pathname}/`}`;

    if (!linkRef.current) {
      // 首次运行时查找或创建 link 元素
      let link = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      linkRef.current = link;
    }

    if (linkRef.current) {
      linkRef.current.setAttribute("href", canonicalUrl);
    }
  }, [pathname]);

  return null;
}

export default CanonicalMeta;