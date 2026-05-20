import { useState, useEffect, useCallback } from "react";
import { heroData } from "@/mocks/home";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useParallax } from "@/hooks/useParallax";
import { handleImgError } from "@/mocks/constants";
import { getFormatUrl } from "@/utils/image";

const HERO_COUNT = heroData.images.length;

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideImgLoaded, setSlideImgLoaded] = useState(true);
  const [ref, visible] = useScrollReveal<HTMLElement>();
  const [isIntersecting, setIsIntersecting] = useState(true);
  const parallaxRef = useParallax(0.25);

  const nextSlide = useCallback(() => {
    setSlideImgLoaded(false);
    setCurrentIndex((prev) => (prev + 1) % HERO_COUNT);
  }, []);

  const goToSlide = useCallback((index: number) => {
    if (index === currentIndex) return;
    setSlideImgLoaded(false);
    setCurrentIndex(index);
  }, [currentIndex]);

  /* 離屏暫停 auto-slide，回畫面再續播 */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    if (!isIntersecting) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, isIntersecting]);

  /* 僅預載「下一張」，避免與 LCP 首幀搶頻寬 */
  useEffect(() => {
    const nextSrc = heroData.images[(currentIndex + 1) % HERO_COUNT].src;
    const t = window.setTimeout(() => {
      const img = new Image();
      img.src = nextSrc;
    }, 2000);
    return () => clearTimeout(t);
  }, [currentIndex]);

  const { src: heroSrc, alt: heroAlt } = heroData.images[currentIndex];

  return (
    <section
      ref={ref}
      className={`relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden bg-brand-cream sr-fade-up sr-slow ${visible ? "sr-visible" : ""}`}
    >
      {/* Parallax Background Layer */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 will-change-transform"
        aria-hidden="true"
      >
        <div className="absolute inset-0">
          <picture>
            <source srcSet={getFormatUrl(heroSrc, "avif")} type="image/avif" />
            <source srcSet={getFormatUrl(heroSrc, "webp")} type="image/webp" />
            <img
              src={heroSrc}
              alt={heroAlt}
              className={`w-full h-full object-cover transition-opacity duration-1000 ${
                slideImgLoaded ? "opacity-100" : "opacity-0"
              }`}
              fetchPriority={currentIndex === 0 ? "high" : "auto"}
              loading="eager"
              decoding="async"
              sizes="100vw"
              width={1920}
              height={1280}
              onLoad={() => setSlideImgLoaded(true)}
              onError={handleImgError}
            />
          </picture>
        </div>
      </div>

      {/* Gradient overlay stays fixed (no parallax) for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 z-[1]" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-brand-gold text-sm md:text-base tracking-[0.2em] uppercase mb-4 md:mb-6 font-medium animate-fade-in">
          Golden Years Studio
        </p>
        <h1 className="text-display text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-tight mb-4 md:mb-6 animate-fade-in">
          {heroData.title}
        </h1>
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