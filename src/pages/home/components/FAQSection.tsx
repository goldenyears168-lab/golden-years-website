import { useState } from "react";
import { homeFAQ } from "@/mocks/home-faq";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [headerRef, headerVisible] = useScrollReveal<HTMLDivElement>();
  const [listRef, listVisible] = useScrollReveal<HTMLDivElement>();

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-brand max-w-3xl">
        <div
          ref={headerRef}
          className={`text-center mb-10 md:mb-14 sr-fade-up ${headerVisible ? "sr-visible" : ""}`}
        >
          <p className="text-brand-gold text-sm tracking-[0.15em] uppercase mb-3 font-medium">
            常見問題
          </p>
          <h2 className="text-display text-2xl md:text-3xl lg:text-4xl font-medium">
            你可能想知道的事
          </h2>
        </div>

        <div
          ref={listRef}
          className={`space-y-3 sr-fade-up ${listVisible ? "sr-visible" : ""}`}
        >
          {homeFAQ.map((item, index) => (
            <div
              key={index}
              className="bg-brand-cream rounded-lg border border-brand-navy/5 overflow-hidden"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer"
              >
                <span className="text-sm md:text-base font-medium text-brand-navy pr-4">
                  {item.question}
                </span>
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  <i
                    className={`ri-arrow-down-s-line text-brand-gold text-xl transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-5 md:px-6 pb-5 md:pb-6">
                  <p className="text-sm md:text-base text-brand-textLight leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}