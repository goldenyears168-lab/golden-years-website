import { useEffect } from "react";

interface FAQSchemaProps {
  questions: Array<{ q: string; a: string }>;
  pageName: string;
}

/**
 * FAQPage JSON-LD Schema 注入器
 * 為 Google 精選摘要 (Rich Results) 提供 FAQ 結構化資料
 * 在 SPA 路由切換時自動清理舊 Schema、注入新 Schema
 */
export default function FAQSchema({ questions, pageName }: FAQSchemaProps) {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: questions.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    };

    const scriptId = `faq-schema-${pageName}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.setAttribute("id", scriptId);
      script.setAttribute("type", "application/ld+json");
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(schema);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) {
        existing.remove();
      }
    };
  }, [questions, pageName]);

  return null;
}