import { useScrollReveal } from "@/hooks/useScrollReveal";
import { photoServices } from "@/mocks/home";
import { Link } from "react-router-dom";
import LazyImage from "@/components/base/LazyImage";

export default function PhotoServices() {
  const [headerRef, headerVisible] = useScrollReveal();
  const [gridRef, gridVisible] = useScrollReveal();

  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-brand">
        <div ref={headerRef} className={`text-center mb-12 md:mb-16 sr-fade-up ${headerVisible ? "sr-visible" : ""}`}>
          <p className="text-brand-gold text-sm tracking-[0.15em] uppercase mb-3 font-medium">
            攝影服務
          </p>
          <h2 className="text-display text-2xl md:text-3xl lg:text-4xl font-medium">
            每一次快門，都是人生故事的一頁
          </h2>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {photoServices.map((service, idx) => (
            <Link
              key={service.slug}
              to={`/photography?category=${service.categoryId}`}
              className={`card-base group cursor-pointer hover:-translate-y-1 hover:shadow-sm transition-all duration-300 sr-fade-up sr-fast ${gridVisible ? "sr-visible" : ""}`}
              style={{ transitionDelay: `${idx * 80}ms` }}
            >
              <div className="relative overflow-hidden">
                <LazyImage
                  src={service.image}
                  alt={`好時有影台北${service.title}`}
                  className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700"
                  skeletonClassName="min-h-[220px] sm:min-h-[180px]"
                  width={600}
                  height={400}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-5 md:p-6">
                <h3 className="text-base md:text-lg font-serif font-medium mb-1.5 group-hover:text-brand-navy transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-sm text-brand-textLight mb-3">
                  {service.description}
                </p>
                <p className="text-brand-navy font-medium text-base">
                  {service.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}