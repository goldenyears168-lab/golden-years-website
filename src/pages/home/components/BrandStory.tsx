import { aboutHome } from "@/mocks/home";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import LazyImage from "@/components/base/LazyImage";

export default function BrandStory() {
  const [ref1, visible1] = useScrollReveal<HTMLDivElement>();
  const [ref2, visible2] = useScrollReveal<HTMLDivElement>();

  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-brand">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-center">
          <div
            ref={ref1}
            className={`order-2 lg:order-1 sr-slide-left ${visible1 ? "sr-visible" : ""}`}
          >
            <p className="text-lg md:text-xl text-brand-navy/60 italic max-w-2xl">
              關於好時
            </p>
            <h2 className="text-display text-2xl md:text-3xl lg:text-4xl font-medium mb-5 md:mb-6 leading-snug">
              {aboutHome.title}
            </h2>
            <p className="text-brand-textLight leading-relaxed mb-6 text-sm md:text-base">
              {aboutHome.description}
            </p>
            <div className="flex items-center gap-8 pt-4 border-t border-brand-creamDark">
              <div>
                <p className="text-display text-2xl md:text-3xl font-medium text-brand-navy">
                  2,0000+
                </p>
                <p className="text-xs text-brand-textLight mt-1">服務顧客</p>
              </div>
              <div>
                <p className="text-display text-2xl md:text-3xl font-medium text-brand-navy">
                  50+
                </p>
                <p className="text-xs text-brand-textLight mt-1">企業客戶</p>
              </div>
              <div>
                <p className="text-display text-2xl md:text-3xl font-medium text-brand-navy">
                  5
                </p>
                <p className="text-xs text-brand-textLight mt-1">年品牌經驗</p>
              </div>
            </div>
          </div>
          <div
            ref={ref2}
            className={`order-1 lg:order-2 sr-slide-right ${visible2 ? "sr-visible" : ""}`}
          >
            <div className="relative rounded-lg overflow-hidden">
              <LazyImage
                src="https://photo.goldenyearsphoto.com/courses/workshop/hero.webp"
                alt={aboutHome.alt}
                className="w-full h-auto object-contain"
                loading="lazy"
                decoding="async"
                sizes="(max-width: 1024px) 100vw, 50vw"
                width={960}
                height={720}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}