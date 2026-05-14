import { teamData } from "@/mocks/about";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { handleImgError } from "@/mocks/constants";

export default function TeamSection() {
  const [headerRef, headerVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-brand">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`text-center mb-10 md:mb-14 sr-fade-up ${headerVisible ? "sr-visible" : ""}`}
        >
          <p className="text-brand-gold text-sm tracking-[0.15em] uppercase mb-3 font-medium">
            團隊介紹
          </p>
          <h2 className="text-display text-2xl md:text-3xl lg:text-4xl font-medium">
            認識好時有影的夥伴們
          </h2>
        </div>

        {/* All Categories - Stacked */}
        <div className="space-y-14 md:space-y-18">
          {teamData.categories.map((category) => (
            <TeamCategory key={category.role} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamCategory({ category }: { category: typeof teamData.categories[0] }) {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={ref}>
      {/* Category Title */}
      <div className={`flex items-center gap-4 mb-7 md:mb-9 sr-fade-up ${isVisible ? "sr-visible" : ""}`}>
        <h3 className="text-lg md:text-xl font-serif font-medium text-brand-navy whitespace-nowrap">
          {category.role}
        </h3>
        <div className="flex-1 h-px bg-brand-creamDark" />
        <span className="text-sm text-brand-textMuted font-medium whitespace-nowrap">
          {category.count}
        </span>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-6">
        {category.members.map((member, index) => (
          <div
            key={member.name}
            className={`text-center group sr-fade-up sr-fast ${isVisible ? "sr-visible" : ""}`}
            style={{ transitionDelay: isVisible ? `${index * 80}ms` : "0ms" }}
          >
            <div className="relative rounded-full overflow-hidden mb-3 bg-brand-creamDark aspect-square mx-auto w-full max-w-[220px]">
              <img
                src={member.image}
                alt={member.alt}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                onError={handleImgError}
                width={220}
                height={220}
              />
              <div className="absolute inset-0 rounded-full ring-2 ring-brand-gold/20 group-hover:ring-brand-gold/50 transition-all duration-300" />
            </div>
            <h4 className="text-sm font-serif font-medium text-brand-navy">
              {member.name}
            </h4>
            <p className="text-xs text-brand-textLight mt-0.5">
              {member.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}