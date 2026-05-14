import { Link } from "react-router-dom";
import Header from "@/components/feature/Header";
import Footer from "@/components/feature/Footer";
import FloatingButtons from "@/components/feature/FloatingButtons";
import PageSEO from "@/components/base/PageSEO";
import FounderStory from "./components/FounderStory";
import TeamSection from "./components/TeamSection";
import ValuesSection from "./components/ValuesSection";
import Milestones from "./components/Milestones";
import ParallaxHero from "@/components/base/ParallaxHero";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { handleImgError } from "@/mocks/constants";
import { about as aboutImg } from "@/config/images";

export default function About() {
  const [heroRef, heroVisible] = useScrollReveal<HTMLDivElement>();
  const [bannerRef, bannerVisible] = useScrollReveal<HTMLDivElement>();
  const [ctaRef, ctaVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <>
      <PageSEO
        title="關於好時有影 | Golden Years Studio 攝影工作室 | 台北公館"
        description="了解好時有影 Golden Years Studio 的品牌故事。Annie 總監帶領的專業攝影團隊，深耕台北公館，為頂尖學府與百大企業提供形象照、畢業寫真與人生紀錄。我們是祝福者、陪伴者、送行者。"
      />
      <Header />
      <main>
        {/* Page Hero */}
        <ParallaxHero
          heightClass="h-[420px] md:h-[500px]"
          image={aboutImg.hero}
          imageAlt="好時有影台北公館攝影工作室關於頁"
          imageOpacity={0.30}
          parallaxRate={0.20}
          revealVisible={heroVisible}
          sectionRef={heroRef}
        >
          <div className="text-center px-4">
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="block w-8 md:w-12 h-px bg-brand-gold" />
              <p className="text-brand-gold text-xs md:text-sm tracking-[0.2em] uppercase font-medium">
                關於好時
              </p>
              <span className="block w-8 md:w-12 h-px bg-brand-gold" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-5 max-w-3xl mx-auto leading-tight">
              我們是祝福者、陪伴者、送行者
            </h1>
            <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              為人生重要時刻留下影像與祝福，參與著人們的故事，紀錄日常生活的定格和延續
            </p>
          </div>
        </ParallaxHero>

        {/* Team Photo Banner */}
        <section className="pb-16 md:pb-24 bg-brand-cream">
          <div
            ref={bannerRef}
            className={`container-brand sr-fade-up ${bannerVisible ? "sr-visible" : ""}`}
          >
            <div className="relative rounded-lg overflow-hidden group">
              <img
                src={aboutImg.banner}
                alt="好時有影台北公館攝影工作室團隊空間"
                className="w-full h-[300px] md:h-[480px] lg:h-[520px] object-cover object-center"
                loading="lazy"
                decoding="async"
                onError={handleImgError}
                width={1200}
                height={520}
              />
              {/* 精緻圖說覆層 */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pt-20 md:pt-28 pb-6 md:pb-8 px-6 md:px-10">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 md:gap-6">
                  <div>
                    <div className="inline-flex items-center gap-2.5 mb-2.5">
                      <span className="w-8 h-px bg-brand-gold" />
                      <span className="text-brand-gold text-[10px] md:text-xs tracking-[0.2em] uppercase font-medium">好時有影工作室</span>
                    </div>
                    <p className="text-white text-base md:text-lg font-medium leading-snug">
                      為每一位顧客，記錄人生重要時刻
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-white/50 text-[10px] md:text-xs tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/60" />
                    <span>Photography Studio · Taipei · Since 2021</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FounderStory />
        <TeamSection />
        <ValuesSection />
        <Milestones />

        {/* CTA */}
        <section className="py-20 md:py-28 bg-brand-navy text-white text-center">
          <div
            ref={ctaRef}
            className={`container-brand max-w-2xl sr-fade-up sr-slow ${ctaVisible ? "sr-visible" : ""}`}
          >
            <div className="w-12 h-px bg-brand-gold mx-auto mb-6" />
            <h2 className="text-display text-xl md:text-2xl lg:text-3xl font-medium mb-8">
              想更了解我們的服務？
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/price-list"
                className="btn-primary bg-white text-brand-navy hover:bg-brand-cream w-full sm:w-auto whitespace-nowrap"
              >
                查看價目表
              </Link>
              <Link
                to="/booking"
                className="btn-outline border-white text-white hover:bg-white hover:text-brand-navy w-full sm:w-auto whitespace-nowrap"
              >
                線上預約
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