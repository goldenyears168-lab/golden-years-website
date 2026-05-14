import { Link } from "react-router-dom";
import Header from "@/components/feature/Header";
import Footer from "@/components/feature/Footer";
import FloatingButtons from "@/components/feature/FloatingButtons";
import PageSEO from "@/components/base/PageSEO";
import ParallaxHero from "@/components/base/ParallaxHero";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { blogPageData } from "@/mocks/blog";
import { blog as blogImg } from "@/config/images";
import BlogCategoryNav from "./components/BlogCategoryNav";
import BlogArticleGrid from "./components/BlogArticleGrid";

export default function Blog() {
  const [heroRef, heroVisible] = useScrollReveal<HTMLElement>();
  const [ctaRef, ctaVisible] = useScrollReveal<HTMLElement>();

  return (
    <>
      <PageSEO
        title="好時誌部落格 | 好時有影 Golden Years | 攝影知識、妝髮技巧、生活美學"
        description="好時誌 — 好時有影官方部落格。分享攝影技巧、妝髮造型知識、證件照拍攝攻略、畢業寫真準備指南、形象照穿搭建議等實用內容。讓每一次拍攝都更完美。"
      />
      <Header />
      <main>
        {/* Hero */}
        <ParallaxHero
          heightClass="h-[380px] md:h-[480px]"
          image={blogImg.hero}
          imageAlt="好時有影好時誌部落格攝影知識"
          imageOpacity={0.30}
          parallaxRate={0.20}
          revealVisible={heroVisible}
          sectionRef={heroRef}
        >
          <div className="text-center px-4">
            <span className="inline-block font-serif-en text-xs md:text-sm tracking-[0.2em] uppercase text-brand-gold mb-4">
              {blogPageData.hero.subtitle}
            </span>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4">
              {blogPageData.hero.title}
            </h1>
            <p className="font-serif text-sm md:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
              {blogPageData.hero.description}
            </p>
          </div>
        </ParallaxHero>

        {/* Sticky Category Nav */}
        <BlogCategoryNav />

        {/* Articles */}
        <section className="py-12 md:py-16 bg-brand-cream">
          <div className="w-full px-4 md:px-6 lg:px-8">
            <BlogArticleGrid />
          </div>
        </section>

        {/* CTA */}
        <section
          ref={ctaRef}
          className={`py-16 md:py-20 bg-brand-navy sr-fade-up sr-slow ${ctaVisible ? "sr-visible" : ""}`}
        >
          <div className="w-full px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white mb-4">
                用影像記錄您的故事
              </h2>
              <p className="font-serif text-sm md:text-base text-white/70 mb-8 max-w-lg mx-auto">
                每個人生階段都值得被好好記錄。讓我們陪伴您，留下最珍貴的影像。
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/photography"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-brand-gold text-brand-navy rounded-md font-serif text-sm hover:bg-white transition-colors whitespace-nowrap"
                >
                  <i className="ri-camera-line w-4 h-4 flex items-center justify-center" />
                  攝影服務
                </Link>
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 px-8 py-3 border border-white/30 text-white rounded-md font-serif text-sm hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  <i className="ri-calendar-line w-4 h-4 flex items-center justify-center" />
                  線上預約
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}