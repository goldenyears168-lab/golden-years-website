import { valuesData } from "@/mocks/about";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function ValuesSection() {
  const [headerRef, headerVisible] = useScrollReveal<HTMLDivElement>();
  const [gridRef, gridVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <section className="section-padding bg-brand-creamDark">
      <div className="container-brand">
        <div
          ref={headerRef}
          className={`text-center mb-12 md:mb-16 sr-fade-up ${headerVisible ? "sr-visible" : ""}`}
        >
          <p className="text-brand-gold text-sm tracking-[0.15em] uppercase mb-3 font-medium">
            核心價值
          </p>
          <h2 className="text-display text-2xl md:text-3xl lg:text-4xl font-medium">
            專業 · 陪伴 · 祝福
          </h2>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {valuesData.pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              className={`bg-white rounded-lg p-6 md:p-8 border border-brand-creamDark sr-fade-up sr-fast ${gridVisible ? "sr-visible" : ""}`}
              style={{ transitionDelay: gridVisible ? `${index * 120}ms` : "0ms" }}
            >
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-brand-creamDark">
                <div className="w-10 h-10 flex items-center justify-center bg-brand-navy rounded-md">
                  <i className={`${pillar.icon} text-white text-sm`} />
                </div>
                <h3 className="text-display text-xl md:text-2xl font-medium">
                  {pillar.title}
                </h3>
              </div>

              <div className="space-y-5">
                {pillar.items.map((item) => (
                  <div key={item.subtitle}>
                    <h4 className="text-sm font-medium text-brand-navy mb-1.5">
                      {item.subtitle}
                    </h4>
                    <p className="text-sm text-brand-textLight leading-[1.8]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}