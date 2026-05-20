import { useState } from "react";
import { Link } from "react-router-dom";
import { portfolioCategories } from "@/mocks/portfolio-categories";
import { featuredPortfolio } from "@/mocks/portfolio";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import LazyImage from "@/components/base/LazyImage";

export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const [headerRef, headerVisible] = useScrollReveal<HTMLDivElement>();
  const [gridRef, gridVisible] = useScrollReveal<HTMLDivElement>();
  const [ctaRef, ctaVisible] = useScrollReveal<HTMLDivElement>();

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    setShowMoreFilters(false);
  };

  // 根據當前分類取得要顯示的三張圖
  const displayImages = (() => {
    if (activeCategory === "all") {
      return featuredPortfolio.slice(0, 3).map((img, i) => ({
        id: `featured-${i}`,
        url: img.url,
        alt: img.alt,
        categoryTitle: img.categoryTitle,
        categorySlug: img.categorySlug,
      }));
    }
    const cat = portfolioCategories.find((c) => c.slug === activeCategory);
    if (!cat) return [];
    return cat.images.slice(0, 3).map((img, i) => ({
      id: `${cat.slug}-${i}`,
      url: img.url,
      alt: img.alt,
      categoryTitle: cat.title,
      categorySlug: cat.slug,
    }));
  })();

  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-brand">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`text-center mb-10 md:mb-12 sr-fade-up ${headerVisible ? "sr-visible" : ""}`}
        >
          <p className="text-brand-gold text-sm tracking-[0.15em] uppercase mb-3 font-medium">
            找到你的專屬風格
          </p>
          <h2 className="text-display text-2xl md:text-3xl lg:text-4xl font-medium mb-3">
            每一次快門，都是人生故事的一頁
          </h2>
          <p className="text-brand-textLight text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            點擊作品探索完整作品集
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="relative mb-10 md:mb-12">
          {/* Mobile: scrollable with first 6 + more toggle */}
          <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {portfolioCategories.slice(0, 6).map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 whitespace-nowrap cursor-pointer flex-shrink-0 snap-start ${
                  activeCategory === cat.slug
                    ? "bg-brand-navy text-white"
                    : "bg-brand-cream text-brand-charcoal hover:bg-brand-creamDark border border-brand-navy/10"
                }`}
              >
                {cat.title}
              </button>
            ))}
            {portfolioCategories.length > 6 && (
              <>
                {showMoreFilters && portfolioCategories.slice(6).map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`px-4 py-2 rounded-full text-sm transition-all duration-300 whitespace-nowrap cursor-pointer flex-shrink-0 snap-start ${
                      activeCategory === cat.slug
                        ? "bg-brand-navy text-white"
                        : "bg-brand-cream text-brand-charcoal hover:bg-brand-creamDark border border-brand-navy/10"
                    }`}
                  >
                    {cat.title}
                  </button>
                ))}
                <button
                  onClick={() => setShowMoreFilters(!showMoreFilters)}
                  className="px-4 py-2 rounded-full text-sm text-brand-gold border border-brand-gold/30 hover:bg-brand-gold/10 transition-all whitespace-nowrap cursor-pointer flex-shrink-0 snap-start"
                >
                  {showMoreFilters ? "收起 ▲" : "更多 ▾"}
                </button>
              </>
            )}
          </div>

          {/* Desktop: all 13 tabs flex-wrap */}
          <div className="hidden md:flex flex-wrap items-center justify-center gap-2">
            {portfolioCategories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.slug
                    ? "bg-brand-navy text-white"
                    : "bg-brand-cream text-brand-charcoal hover:bg-brand-creamDark border border-brand-navy/10"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-3 gap-2 md:gap-6 mb-10 md:mb-14"
        >
          {displayImages.map((item, index) => (
            <Link
              key={item.id}
              to={`/photography?category=${item.categorySlug}`}
              className={`group relative rounded-lg overflow-hidden bg-white sr-scale-up sr-fast ${gridVisible ? "sr-visible" : ""} hover:-translate-y-1 transition-transform duration-300`}
              style={{ transitionDelay: gridVisible ? `${index * 120}ms` : "0ms" }}
            >
              <LazyImage
                src={item.url}
                alt={`好時有影台北${item.alt}`}
                className="w-full aspect-[3/4] object-cover object-top group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                decoding="async"
                sizes="(max-width: 768px) 34vw, 320px"
                width={600}
                height={800}
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Hover Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="inline-block px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold text-[10px] md:text-xs font-medium mb-2">
                  {item.categoryTitle}
                </span>
                <h3 className="text-white text-base md:text-lg font-medium">{item.alt}</h3>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div
          ref={ctaRef}
          className={`text-center sr-fade-up sr-slow ${ctaVisible ? "sr-visible" : ""}`}
        >
          <p className="text-brand-textLight text-sm mb-4">
            查看完整作品集、各類別服務詳情與價格
          </p>
          <Link
            to={`/photography${activeCategory !== "all" ? `?category=${activeCategory}` : ""}`}
            className="inline-flex items-center gap-2 bg-brand-navy text-white px-7 py-3 rounded-full text-sm font-medium hover:bg-brand-navy/90 transition-colors duration-300 whitespace-nowrap"
          >
            探索 12+ 攝影類別與完整作品
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-right-line" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}