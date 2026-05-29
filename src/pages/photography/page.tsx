import { useSearchParams, Link } from "react-router-dom";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Header from "@/components/feature/Header";
import Footer from "@/components/feature/Footer";
import FloatingButtons from "@/components/feature/FloatingButtons";
import PageSEO from "@/components/base/PageSEO";
import ParallaxHero from "@/components/base/ParallaxHero";
import LazyImage from "@/components/base/LazyImage";
import { photographyPageData, photographyServices } from "@/mocks/photography-services";
import { portfolioCategories } from "@/mocks/portfolio-categories";
import { featuredPortfolio } from "@/mocks/portfolio";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import FAQItem from "@/pages/hair-makeup/components/FAQItem";
import { photographyFAQ } from "@/mocks/photography-faq";
import { photography as photographyImg, team } from "@/config/images";
import FAQSchema from "@/components/base/FAQSchema";

// 攝影頁 FAQ 結構化資料
const flatFAQ = photographyFAQ.flatMap((cat) => cat.qa);

export default function PhotographyServices() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "all");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Scroll reveals
  const [heroRef, heroVisible] = useScrollReveal<HTMLElement>();
  const [quoteRef, quoteVisible] = useScrollReveal<HTMLElement>();
  const [filterRef, filterVisible] = useScrollReveal<HTMLDivElement>();
  const [galleryRef, galleryVisible] = useScrollReveal<HTMLDivElement>();
  const [faqHeaderRef, faqHeaderVisible] = useScrollReveal<HTMLDivElement>();
  const [ctaRef, ctaVisible] = useScrollReveal<HTMLElement>();

  useEffect(() => {
    const cat = searchParams.get("category") || "all";
    setActiveCategory(cat);
    setVisibleCount(12); // reset batch on category change
  }, [searchParams]);

  // Auto-load more images when sentinel enters viewport
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) => prev + 12);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [activeCategory]);

  const handleCategoryChange = useCallback(
    (slug: string) => {
      setActiveCategory(slug);
      setSearchParams(slug === "all" ? {} : { category: slug });
    },
    [setSearchParams]
  );

  const displayedImages = useMemo(() => {
    if (activeCategory === "all") {
      return featuredPortfolio.slice(0, visibleCount);
    }
    return portfolioCategories
      .filter((cat) => cat.slug === activeCategory)
      .flatMap((cat) =>
        cat.images.slice(0, visibleCount).map((img) => ({
          ...img,
          categorySlug: cat.slug,
          categoryTitle: cat.title,
        }))
      );
  }, [activeCategory, visibleCount]);

  const hasMoreImages = useMemo(() => {
    if (activeCategory === "all") {
      return visibleCount < featuredPortfolio.length;
    }
    return (portfolioCategories.find((c) => c.slug === activeCategory)?.images.length ?? 0) > visibleCount;
  }, [activeCategory, visibleCount]);

  const activeServiceInfo = activeCategory !== "all"
    ? photographyServices.find((s) => s.id === activeCategory)
    : null;

  const categoryTitle =
    activeCategory === "all"
      ? "攝影作品集"
      : portfolioCategories.find((c) => c.slug === activeCategory)?.title || "";

  const categoryDesc =
    activeCategory === "all"
      ? "瀏覽我們的完整作品庫，涵蓋職涯形象、畢業紀念、甜蜜時光、全家福等 12 個攝影類別。"
      : portfolioCategories.find((c) => c.slug === activeCategory)?.description || "";

  return (
    <>
      <PageSEO
        title="攝影服務 | 好時有影 Golden Years Studio | 形象照、畢業寫真、全家福"
        description="好時有影專業攝影服務：韓式證件照、職涯形象照、畢業寫真、全家福、寵物攝影等 12 大類別。瀏覽精選作品集，了解拍攝流程與價格。Annie 總監親自掌鏡，台北公館攝影工作室。"
        keywords="形象照,證件照,畢業寫真,全家福,寵物攝影,台北攝影師,職涯形象照,婚紗攝影,寵物寫真,情侶寫真,台北攝影工作室"
      />
      <FAQSchema questions={flatFAQ} pageName="photography" />
      <Header />
      <main>
        {/* Hero */}
        <ParallaxHero
          heightClass="h-[380px] md:h-[480px]"
          image={photographyImg.hero}
          imageAlt="好時有影台北專業攝影服務作品集"
          imageOpacity={0.30}
          parallaxRate={0.20}
          revealVisible={heroVisible}
          sectionRef={heroRef}
        >
          <div className="text-center px-4">
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="block w-8 md:w-10 h-px bg-brand-gold" />
              <p className="text-brand-gold text-xs md:text-sm tracking-[0.2em] uppercase font-medium">
                攝影服務
              </p>
              <span className="block w-8 md:w-10 h-px bg-brand-gold" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-5 max-w-3xl mx-auto leading-tight">
              {photographyPageData.hero.title}
            </h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-4">
              {photographyPageData.hero.subtitle}
            </p>
            <p className="text-white/60 text-sm max-w-xl mx-auto">
              {photographyPageData.hero.description}
            </p>
          </div>
        </ParallaxHero>

        {/* Founder Quote - Left Image Right Text */}
        <section
          ref={quoteRef}
          className={`section-padding bg-brand-creamDark sr-fade-up ${quoteVisible ? "sr-visible" : ""}`}
        >
          <div className="container-brand">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-center">
              {/* Left: Photo — 佔 4/12 (1/3) */}
              <div className="lg:col-span-4">
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-[340px] aspect-[3/4] rounded-lg overflow-hidden flex-shrink-0">
                    <LazyImage
                      src={team[0]}
                      alt="好時有影 Annie 總監首席攝影師"
                      className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                      width={340}
                      height={453}
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 1024px) 50vw, 340px"
                      autoSrcSet
                      containerClassName="rounded-lg"
                    />
                    <div className="absolute inset-0 rounded-lg ring-2 ring-brand-gold/20" />
                  </div>
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-4 h-px bg-brand-gold" />
                      <span className="text-sm font-medium text-brand-navy">Annie 總監</span>
                      <span className="w-4 h-px bg-brand-gold" />
                    </div>
                    <span className="text-xs text-brand-textMuted mt-1">首席攝影師</span>
                  </div>
                </div>
              </div>

              {/* Right: Quote — 佔 8/12 (2/3) */}
              <div className="lg:col-span-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 flex items-center justify-center bg-brand-navy rounded-full flex-shrink-0">
                    <i className="ri-double-quotes-l text-white text-sm" />
                  </div>
                  <div>
                    <p className="text-brand-gold text-sm font-medium">
                      {photographyPageData.founderQuote.author}
                    </p>
                    <p className="text-xs text-brand-textMuted">
                      攝影不是把人拍得好看，而是讓人看見自己
                    </p>
                  </div>
                </div>
                <div className="space-y-5 max-w-2xl">
                  {photographyPageData.founderQuote.content.split("\n\n").map((paragraph, index) =>
                    index === 0 ? (
                      <p
                        key={index}
                        className="text-brand-navy font-serif text-lg md:text-xl leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ) : (
                      <p
                        key={index}
                        className="text-brand-textLight leading-[1.9] text-sm md:text-base"
                      >
                        {paragraph}
                      </p>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter + Gallery */}
        <section className="pb-6 md:pb-8 bg-white">
          <div className="container-brand">
            <div
              ref={filterRef}
              className={`text-center mb-8 md:mb-10 sr-fade-up ${filterVisible ? "sr-visible" : ""}`}
            >
              <p className="text-brand-gold text-sm tracking-[0.15em] uppercase mb-2 font-medium">
                作品集
              </p>
              <h2 className="text-display text-2xl md:text-3xl lg:text-4xl font-medium mb-3">
                {categoryTitle}
              </h2>
              <p className="text-brand-textLight text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                {categoryDesc}
              </p>
            </div>

            {/* Filter Tabs - Horizontal scroll on mobile, wrap on desktop */}
            <div className="relative mb-6 md:mb-8">
              {/* Mobile: scrollable with first 6 + more toggle */}
              <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <button
                  onClick={() => handleCategoryChange("all")}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 whitespace-nowrap cursor-pointer flex-shrink-0 snap-start ${
                    activeCategory === "all"
                      ? "bg-brand-navy text-white"
                      : "bg-brand-cream text-brand-charcoal hover:bg-brand-creamDark border border-brand-navy/10"
                  }`}
                >
                  全部
                </button>
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

              {/* Desktop: all categories wrap */}
              <div className="hidden md:flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => handleCategoryChange("all")}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    activeCategory === "all"
                      ? "bg-brand-navy text-white"
                      : "bg-brand-cream text-brand-charcoal hover:bg-brand-creamDark border border-brand-navy/10"
                  }`}
                >
                  全部
                </button>
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

            {/* Active service info bar - compact */}
            {activeServiceInfo && (
              <div className="max-w-4xl mx-auto mb-6 md:mb-8 bg-brand-creamDark rounded-lg px-5 py-4 md:px-6 md:py-4 border border-brand-navy/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-brand-textMuted">{activeServiceInfo.subtitle}</span>
                  </div>
                  <h3 className="text-base font-medium text-brand-navy">{activeServiceInfo.title}</h3>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-brand-navy font-semibold text-base">{activeServiceInfo.price}</span>
                  <Link
                    to="/booking"
                    className="btn-primary text-sm px-4 py-2 whitespace-nowrap"
                  >
                    立即預約
                  </Link>
                </div>
              </div>
            )}

            {/* Image count */}
            <div className="text-center mb-6 md:mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cream text-xs text-brand-textMuted">
                <i className="ri-image-2-line text-brand-gold" />
                精選作品
              </span>
            </div>

            {/* Masonry Gallery — batch loaded */}
            <div
              ref={galleryRef}
              className={`sr-fade-up ${galleryVisible ? "sr-visible" : ""}`}
            >
              <div className="columns-1 sm:columns-2 md:columns-3 gap-4 md:gap-5 space-y-4 md:space-y-5">
                {displayedImages.map((img, index) => (
                  <div
                    key={`${img.categorySlug}-${index}`}
                    className="break-inside-avoid rounded-lg overflow-hidden group"
                  >
                    <div className="relative">
                      <LazyImage
                        src={img.url}
                        alt={`好時有影台北${img.alt}`}
                        className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        autoSrcSet
                        containerClassName="min-h-[120px]"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.src = photographyImg.featured[0];
                        }}
                      />
                      {activeCategory === "all" && (
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 rounded text-xs text-brand-navy font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {img.categoryTitle}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Sentinel for auto-loading + Load More button */}
              {hasMoreImages && (
                <div className="mt-8 md:mt-10 text-center">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 12)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-brand-navy/15 bg-white text-brand-navy text-sm font-medium hover:bg-brand-creamDark transition-colors duration-300 cursor-pointer"
                  >
                    <i className="ri-arrow-down-line" />
                    載入更多作品
                  </button>
                  {/* IntersectionObserver sentinel */}
                  <div ref={sentinelRef} className="h-4" aria-hidden="true" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-padding bg-brand-creamDark">
          <div className="container-brand max-w-3xl">
            <div
              ref={faqHeaderRef}
              className={`text-center mb-10 md:mb-14 sr-fade-up ${faqHeaderVisible ? "sr-visible" : ""}`}
            >
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="block w-8 md:w-10 h-px bg-brand-gold" />
                <p className="text-brand-gold text-xs md:text-sm tracking-[0.2em] uppercase font-medium">
                  FAQ
                </p>
                <span className="block w-8 md:w-10 h-px bg-brand-gold" />
              </div>
              <h2 className="text-display text-2xl md:text-3xl lg:text-4xl font-medium">
                攝影服務常見問題
              </h2>
            </div>

            {photographyFAQ.map((item, index) => (
              <FAQItem key={item.category} faq={item} defaultOpenIndex={index === 0 ? 0 : -1} />
            ))}
          </div>
        </section>

        {/* CTA - Primary action emphasized */}
        <section className="py-16 md:py-20 bg-brand-navy text-white text-center">
          <div
            ref={ctaRef}
            className={`container-brand max-w-2xl sr-fade-up sr-slow ${ctaVisible ? "sr-visible" : ""}`}
          >
            <h2 className="text-display text-xl md:text-2xl lg:text-3xl font-medium mb-6">
              準備好預約你的專屬拍攝了嗎？
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/booking"
                className="btn-primary bg-white text-brand-navy hover:bg-brand-cream w-full sm:w-auto whitespace-nowrap"
              >
                線上預約
              </Link>
              <Link
                to="/price-list"
                className="text-white/70 hover:text-white text-sm underline underline-offset-4 transition-colors w-full sm:w-auto whitespace-nowrap"
              >
                查看價格 →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}