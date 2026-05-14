import { trustData } from "@/mocks/home";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function TrustSection() {
  const [headerRef, headerVisible] = useScrollReveal<HTMLDivElement>();
  const [contentRef, contentVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <section className="section-padding bg-brand-creamDark">
      <div className="container-brand">
        <div
          ref={headerRef}
          className={`text-center mb-12 md:mb-16 sr-fade-up ${headerVisible ? "sr-visible" : ""}`}
        >
          <p className="text-brand-gold text-sm tracking-[0.15em] uppercase mb-3 font-medium">
            信任的力量
          </p>
          <h2 className="text-display text-2xl md:text-3xl lg:text-4xl font-medium mb-3">
            {trustData.customerCount}
          </h2>
          <p className="text-brand-textLight text-sm md:text-base max-w-xl mx-auto">
            {trustData.description}
          </p>
        </div>

        <div
          ref={contentRef}
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 sr-fade-up sr-delay-2 ${contentVisible ? "sr-visible" : ""}`}
        >
          {/* Corporate Clients */}
          <div>
            <h3 className="text-sm font-medium text-brand-navy tracking-wide mb-4 pb-2 border-b border-brand-cream">
              代表企業客戶
            </h3>
            <p className="text-xs text-brand-textLight leading-[1.8]">
              {trustData.corporateClients.join("、")}
            </p>
          </div>

          {/* School Clients */}
          <div>
            <h3 className="text-sm font-medium text-brand-navy tracking-wide mb-4 pb-2 border-b border-brand-cream">
              代表校園客戶
            </h3>
            <p className="text-xs text-brand-textLight leading-[1.8]">
              {trustData.schoolClients.join("、")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}