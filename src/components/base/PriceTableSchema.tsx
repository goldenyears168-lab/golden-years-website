import { useEffect } from "react";

interface PriceItem {
  name: string;
  description: string;
  price: string;
  priceCurrency?: string;
  category?: string;
  url?: string;
}

interface PriceTableSchemaProps {
  items: PriceItem[];
  pageName: string;
}

/**
 * 價格比較表 JSON-LD Schema 注入器
 * 使用 ItemList + Product + Offer 結構，為 Google 提供明確的服務價格信號
 * 配合頁面實際的價格表格內容，爭取搜尋結果中直接顯示價格片段或表格 Rich Result
 */
export default function PriceTableSchema({ items, pageName }: PriceTableSchemaProps) {
  useEffect(() => {
    const scriptId = `price-table-schema-${pageName}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.setAttribute("id", scriptId);
      script.setAttribute("type", "application/ld+json");
      document.head.appendChild(script);
    }

    // 主要 Schema：ItemList + Product + Offer
    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: item.name,
          description: item.description,
          brand: {
            "@type": "Brand",
            name: "好時有影",
          },
          offers: {
            "@type": "Offer",
            price: item.price.replace(/[^\d]/g, ""),
            priceCurrency: item.priceCurrency || "TWD",
            availability: "https://schema.org/InStock",
            url: item.url || "https://www.goldenyearsphoto.com/price-list/",
          },
        },
      })),
    };

    // 輔助 Schema：Service 清單，強化本地服務信號
    const serviceList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "好時有影完整價目表",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Service",
          name: item.name,
          description: item.description,
          provider: {
            "@type": "LocalBusiness",
            name: "好時有影 Golden Years Studio",
            address: {
              "@type": "PostalAddress",
              addressLocality: "台北",
              addressRegion: "台灣",
            },
          },
          areaServed: {
            "@type": "City",
            name: "台北市",
          },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: item.category || "攝影服務",
            itemListElement: {
              "@type": "Offer",
              price: item.price.replace(/[^\d]/g, ""),
              priceCurrency: "TWD",
            },
          },
        },
      })),
    };

    script.textContent = JSON.stringify([itemList, serviceList]);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) {
        existing.remove();
      }
    };
  }, [items, pageName]);

  return null;
}