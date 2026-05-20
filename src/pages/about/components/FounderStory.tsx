import { founderStory } from "@/mocks/about";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import LazyImage from "@/components/base/LazyImage";

export default function FounderStory() {
  const [textRef, textVisible] = useScrollReveal<HTMLDivElement>();
  const [imgRef, imgVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <section className="section-padding bg-brand-creamDark">
      <div className="container-brand">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-start">
          <div
            ref={textRef}
            className={`sr-slide-left ${textVisible ? "sr-visible" : ""}`}
          >
            <p className="text-brand-gold text-sm tracking-[0.15em] uppercase mb-3 font-medium">
              創辦人故事
            </p>
            <h2 className="text-display text-2xl md:text-3xl lg:text-4xl font-medium mb-8 md:mb-10 leading-snug">
              {founderStory.title}
            </h2>
            <div className="space-y-6 md:space-y-7">
              {founderStory.paragraphs.map((para, index) => (
                <div key={index} className="flex gap-4 md:gap-5">
                  <span className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 flex items-center justify-center bg-brand-gold/10 text-brand-gold text-[10px] md:text-xs font-medium rounded-full mt-0.5">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-brand-textLight leading-[1.8] text-sm md:text-base">
                    {para}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            ref={imgRef}
            className={`lg:sticky lg:top-24 sr-slide-right ${imgVisible ? "sr-visible" : ""}`}
          >
            <div className="relative rounded-lg overflow-hidden max-w-[60%] mx-auto aspect-[3/4]">
              <LazyImage
                src={founderStory.founder.image}
                alt={founderStory.founder.alt}
                className="w-full h-full object-cover object-top"
                width={600}
                height={800}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 1024px) 60vw, 30vw"
                autoSrcSet
              />
            </div>
            <div className="mt-6 max-w-[60%] mx-auto text-center">
              <p className="text-base font-serif font-medium">
                {founderStory.founder.name}
              </p>
              <p className="text-sm text-brand-textLight">
                {founderStory.founder.title}
              </p>
              <p className="text-xs text-brand-textMuted mt-1">
                {founderStory.founder.education}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}