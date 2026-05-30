import { useState, useEffect, useCallback } from "react";
import { heroData } from "@/mocks/home";
import { Link } from "react-router-dom";
import { handleImgError } from "@/mocks/constants";
import { getFormatUrl, buildSrcSet } from "@/utils/image";

const HERO_COUNT = heroData.images.length;

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideImgLoaded, setSlideImgLoaded] = useState(true);
  const [carouselReady, setCarouselReady] = useState(false);

  const nextSlide = useCallback(() => {
    setSlideImgLoaded(false);
    setCurrentIndex((prev) => (prev + 1) % HERO_COUNT);
  }, []);

  const goToSlide = useCallback((index: number) => {
    if (index === currentIndex) return;
    setSlideImgLoaded(false);
    setCurrentIndex(index);
  }, [currentIndex]);

  /* 延後 3 秒才啟動輪播，讓首屏 LCP 完全穩定 */
  useEffect(() => {
    const t = setTimeout(() => setCarouselReady(true), 3000);
    return () => clearTimeout(t);
  }, []);

  /* 輪播就緒後才啟動 auto-slide */
  useEffect(() => {
    if (!carouselReady) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, carouselReady]);

  /* 僅預載「下一張」，避免與 LCP 首幀搶頻寬 */
  useEffect(() => {
    if (!carouselReady) return;
    const nextSrc = heroData.images[(currentIndex + 1) % HERO_COUNT].src;
    const t = window.setTimeout(() => {
      const img = new Image();
      img.src = nextSrc;
    }, 2000);
    return () => clearTimeout(t);
  }, [currentIndex, carouselReady]);

  const { src: heroSrc, alt: heroAlt } = heroData.images[currentIndex];
  const isFirstFrame = currentIndex === 0;

  return (
    <section
      className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden bg-brand-cream"
    >
      {/* Background Layer — 首屏純靜態，無 parallax */}
      <div className="absolute inset-0" aria-hidden="true">
        <picture>
          <source srcSet={buildSrcSet(getFormatUrl(heroSrc, "avif"), [640, 960, 1280, 1920])} type="image/avif" sizes="100vw" />
          <source srcSet={buildSrcSet(getFormatUrl(heroSrc, "webp"), [640, 960, 1280, 1920])} type="image/webp" sizes="100vw" />
          <img
            src={heroSrc}
            alt={heroAlt}
            className={`w-full h-full object-cover ${
              isFirstFrame ? "opacity-100" : (slideImgLoaded ? "opacity-100" : "opacity-0")
            }`}
            style={isFirstFrame ? undefined : { transition: "opacity 1s ease" }}
            fetchPriority={isFirstFrame ? "high" : "auto"}
            loading={isFirstFrame ? "eager" : "lazy"}
            decoding="async"
            sizes="100vw"
            srcSet={buildSrcSet(heroSrc, [640, 960, 1280, 1920])}
            width={1920}
            height={1280}
            onLoad={() => setSlideImgLoaded(true)}
            onError={handleImgError}
          />
        </picture>
      </div>

      {/* Gradient overlay stays fixed for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 z-[1]" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-brand-gold text-sm md:text-base tracking-[0.2em] uppercase mb-4 md:mb-6 font-medium animate-fade-in">
          Golden Years Studio
        </p>
        <h2 className="text-display text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-tight mb-4 md:mb-6 animate-fade-in">
          {heroData.title}
        </h2>
        <p className="text-display text-white/90 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light italic mb-4 md:mb-6 animate-fade-in">
          {heroData.subtitle}
        </p>
        <p className="text-white/70 text-sm md:text-base max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed animate-fade-in">
          {heroData.description}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-in">
          <Link
            to="/price-list"
            className="btn-primary w-full sm:w-auto"
          >
            {heroData.ctaPrimary}
          </Link>
          <Link
            to="/booking"
            className="btn-outline border-white text-white hover:bg-white hover:text-brand-navy w-full sm:w-auto"
          >
            {heroData.ctaSecondary}
          </Link>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        {heroData.images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${
              index === currentIndex
                ? "bg-white"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`切換到第 ${index + 1} 張`}
          >
            <span className={`block rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white w-6 h-2"
                : "bg-white/40 w-2 h-2"
            }`} />
          </button>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 animate-bounce hidden md:block">
        <i className="ri-arrow-down-line text-white/50 text-xl" />
      </div>
    </section>
  );
}