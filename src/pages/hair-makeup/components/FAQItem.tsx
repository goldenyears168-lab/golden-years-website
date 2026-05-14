// ... existing code ...
import { useState } from "react";

interface FAQItemProps {
  faq: {
    category: string;
    qa: { q: string; a: string }[];
  };
  defaultOpenIndex?: number;
}

function FAQItem({ faq, defaultOpenIndex = -1 }: FAQItemProps) {
  const [openIndex, setOpenIndex] = useState<number>(defaultOpenIndex);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="mb-8 md:mb-10 last:mb-0">
      {/* 分類標題 — 常駐，金色小字 */}
      <div className="flex items-center gap-3 mb-3">
        <span className="w-4 h-px bg-brand-gold" />
        <span className="text-xs text-brand-gold tracking-[0.15em] uppercase font-medium">
          {faq.category}
        </span>
      </div>

      {/* 問答列表 */}
      <div className="space-y-0">
        {faq.qa.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border-t border-brand-navy/[0.06] last:border-b last:border-brand-navy/[0.06]"
            >
              {/* 問題列 */}
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-start justify-between gap-4 py-4 md:py-5 text-left group cursor-pointer"
              >
                <span
                  className={`text-sm leading-relaxed transition-colors duration-200 pr-2 ${
                    isOpen
                      ? "text-brand-navy font-medium"
                      : "text-brand-textLight group-hover:text-brand-navy"
                  }`}
                >
                  {item.q}
                </span>
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i
                    className={`ri-arrow-down-s-line text-brand-textMuted transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* 答案列 */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="pb-5 pl-0 md:pl-4">
                  <div className="relative pl-4 md:pl-5">
                    {/* 左側金色裝飾線 */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-brand-gold/40" />
                    <div className="bg-brand-creamDark/40 rounded-md px-4 py-3.5 md:px-5 md:py-4">
                      <p className="text-sm text-brand-textLight leading-[1.8]">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FAQItem;
// ... existing code ...