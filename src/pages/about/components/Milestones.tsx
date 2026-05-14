import { milestones } from "@/mocks/about";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Milestones() {
  const [headerRef, headerVisible] = useScrollReveal<HTMLDivElement>();
  const [timelineRef, timelineVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-brand">
        <div
          ref={headerRef}
          className={`text-center mb-12 md:mb-16 sr-fade-up ${headerVisible ? "sr-visible" : ""}`}
        >
          <p className="text-brand-gold text-sm tracking-[0.15em] uppercase mb-3 font-medium">
            品牌大事紀
          </p>
          <h2 className="text-display text-2xl md:text-3xl lg:text-4xl font-medium">
            一路走來的里程碑
          </h2>
        </div>

        <div ref={timelineRef} className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-brand-creamDark" />

            <div className="space-y-10 md:space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative flex gap-5 md:gap-7 sr-fade-up sr-fast ${timelineVisible ? "sr-visible" : ""}`}
                  style={{ transitionDelay: timelineVisible ? `${index * 100}ms` : "0ms" }}
                >
                  {/* Year Dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-sm md:text-base font-serif font-medium transition-all duration-300 ${
                        milestone.highlight
                          ? "bg-brand-navy text-white"
                          : "bg-white text-brand-navy border border-brand-creamDark"
                      }`}
                    >
                      {milestone.year.slice(2)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-1.5 md:pt-2">
                    <h3 className="text-base md:text-lg font-serif font-medium mb-2 text-brand-navy">
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-brand-textLight leading-[1.8]">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}