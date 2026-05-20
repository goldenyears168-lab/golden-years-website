import { Link } from "react-router-dom";
import Header from "@/components/feature/Header";
import Footer from "@/components/feature/Footer";
import FloatingButtons from "@/components/feature/FloatingButtons";
import PageSEO from "@/components/base/PageSEO";
import LazyImage from "@/components/base/LazyImage";
import {
  pricingCategories,
  makeupPricing,
  workshopPricing,
} from "@/mocks/pricing";
import ParallaxHero from "@/components/base/ParallaxHero";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { pricing as pricingImg } from "@/config/images";
import FAQSchema from "@/components/base/FAQSchema";
import FAQItem from "@/pages/hair-makeup/components/FAQItem";
import PriceTableSchema from "@/components/base/PriceTableSchema";
import { pricingFAQ } from "@/mocks/pricing-faq";

/* ------------------------------------------------------------------ */
/*  價格比較表結構化資料                                                */
/* ------------------------------------------------------------------ */
const priceTableItems = [
  ...pricingCategories.flatMap((cat) =>
    cat.items
      .filter((item) => item.price !== "專案報價")
      .map((item) => ({
        name: item.title,
        description: item.subtitle,
        price: item.price,
        priceCurrency: "TWD",
        category: cat.title,
      }))
  ),
  ...makeupPricing.map((item) => ({
    name: item.title,
    description: `拍攝前準備時間 ${item.duration}`,
    price: item.price,
    priceCurrency: "TWD",
    category: "妝髮服務",
  })),
  ...workshopPricing.items.map((item) => ({
    name: item.title,
    description: item.description,
    price: item.price,
    priceCurrency: "TWD",
    category: "工作坊課程",
  })),
];

// 價目頁 FAQ 結構化資料
const flatFAQ = pricingFAQ.flatMap((cat) => cat.qa);

/* ------------------------------------------------------------------ */
/*  子元件：攝影服務的單一分類（含動畫）                                */
/* ------------------------------------------------------------------ */
function AnimatedCategory({ category }: { category: typeof pricingCategories[0] }) {
  const [headerRef, headerVisible] = useScrollReveal<HTMLDivElement>();
  const [gridRef, gridVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <div className="mb-10 md:mb-12 last:mb-0">
      {/* 子分類標題 */}
      <div
        ref={headerRef}
        className={`flex items-center gap-3 mb-5 md:mb-6 sr-fade-up ${headerVisible ? "sr-visible" : ""}`}
      >
        <div className="w-9 h-9 flex items-center justify-center bg-brand-navy rounded-md">
          <i className={`${category.icon} text-white text-sm`} />
        </div>
        <h3 className="text-display text-lg md:text-xl font-medium">
          {category.title}
        </h3>
      </div>

      {/* 項目卡片 */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
      >
        {category.items.map((item, index) => (
          <div
            key={item.id}
            className={`group bg-white rounded-lg border border-brand-creamDark overflow-hidden hover:border-brand-gold/30 hover:-translate-y-1 hover:shadow-sm transition-all duration-300 flex flex-row sr-fade-up sr-fast ${gridVisible ? "sr-visible" : ""}`}
            style={{ transitionDelay: gridVisible ? `${index * 60}ms` : "0ms" }}
          >
            <div className="w-28 flex-shrink-0 aspect-[3/4]">
              <LazyImage
                src={item.image}
                alt={`好時有影台北${item.title}`}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                width={112}
                height={150}
                autoSrcSet
                sizes="(max-width: 640px) 20vw, 112px"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="flex-1 flex flex-col justify-center p-4 min-w-0">
              <h4 className="text-sm md:text-base font-serif font-medium leading-snug">
                {item.title}
              </h4>
              <p className="text-xs text-brand-textLight mt-0.5">
                {item.subtitle}
              </p>
              <div className="mt-2">
                <span className="text-brand-navy font-semibold text-sm md:text-base">
                  {item.price === "專案報價" ? item.price : `${item.price}/張`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  子元件：統一區塊標題                                                */
/* ------------------------------------------------------------------ */
function SectionHeader({
  label,
  title,
  subtitle,
  visible,
}: {
  label: string;
  title: string;
  subtitle?: string;
  visible: boolean;
}) {
  return (
    <div className={`text-center mb-8 md:mb-10 sr-fade-up ${visible ? "sr-visible" : ""}`}>
      <div className="inline-flex items-center gap-3 mb-4">
        <span className="block w-8 md:w-10 h-px bg-brand-gold" />
        <p className="text-brand-gold text-xs md:text-sm tracking-[0.2em] uppercase font-medium whitespace-nowrap">
          {label}
        </p>
        <span className="block w-8 md:w-10 h-px bg-brand-gold" />
      </div>
      <h2 className="text-display text-2xl md:text-3xl lg:text-4xl font-medium mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-brand-textLight text-sm md:text-base max-w-xl mx-auto leading-[1.8]">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  主頁面                                                            */
/* ------------------------------------------------------------------ */
export default function Pricing() {
  const [heroRef, heroVisible] = useScrollReveal<HTMLElement>();
  const [photoRef, photoVisible] = useScrollReveal<HTMLElement>();
  const [makeupRef, makeupVisible] = useScrollReveal<HTMLElement>();
  const [workshopRef, workshopVisible] = useScrollReveal<HTMLElement>();
  const [faqRef, faqVisible] = useScrollReveal<HTMLDivElement>();
  const [ctaRef, ctaVisible] = useScrollReveal<HTMLElement>();

  return (
    <>
      <PageSEO
        title="價目表 | 好時有影 Golden Years Studio | 攝影、妝髮、課程價格透明公開"
        description="好時有影完整價目表：韓式證件照 NT$1,500 起、形象照 NT$3,500 起、妝髮服務 NT$600 起、工作坊課程。所有價格透明公開，無隱藏費用。台北公館攝影工作室，立即線上預約。"
      />
      <FAQSchema questions={flatFAQ} pageName="pricing" />
      <PriceTableSchema items={priceTableItems} pageName="pricing" />
      <Header />
      <main>
        {/* ===== Hero ===== */}
        <ParallaxHero
          heightClass="h-[380px] md:h-[480px]"
          image={pricingImg.hero}
          imageAlt="好時有影台北攝影妝髮價目表"
          imageOpacity={0.30}
          parallaxRate={0.20}
          revealVisible={heroVisible}
          sectionRef={heroRef}
        >
          <div className="text-center px-4">
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="block w-8 md:w-10 h-px bg-brand-gold" />
              <p className="text-brand-gold text-xs md:text-sm tracking-[0.2em] uppercase font-medium">
                價目表
              </p>
              <span className="block w-8 md:w-10 h-px bg-brand-gold" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4 leading-tight">
              好時有影價目表
            </h1>
            <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              每一個方案都經過精心設計，確保你獲得最高品質的攝影體驗
            </p>
          </div>
        </ParallaxHero>

        {/* ===== 攝影服務 ===== */}
        <section
          ref={photoRef}
          className="py-16 md:py-24 bg-brand-cream"
        >
          <div className="container-brand">
            <SectionHeader
              label="Photography"
              title="攝影服務"
              subtitle="從職涯形象到人生里程碑，為每個重要時刻留下專業影像"
              visible={photoVisible}
            />

            {/* 子分類 */}
            <div className="mb-10 md:mb-12">
              {pricingCategories.map((category) => (
                <AnimatedCategory key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* ===== 妝髮服務 ===== */}
        <section
          ref={makeupRef}
          className="py-16 md:py-24 bg-brand-creamDark"
        >
          <div className="container-brand">
            <SectionHeader
              label="Hair & Makeup"
              title="妝髮服務"
              subtitle="專業造型團隊，為你打造最適合上鏡的妝容與髮型"
              visible={makeupVisible}
            />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {makeupPricing.map((item, index) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-lg overflow-hidden border border-brand-creamDark hover:-translate-y-1 hover:shadow-sm transition-all duration-300 sr-fade-up sr-fast ${makeupVisible ? "sr-visible" : ""}`}
                  style={{ transitionDelay: makeupVisible ? `${index * 60}ms` : "0ms" }}
                >
                  <div className="relative overflow-hidden aspect-[3/4]">
                    <LazyImage
                      src={item.image}
                      alt={`好時有影台北${item.title}`}
                      className="w-full h-full object-cover object-center"
                      width={400}
                      height={533}
                      autoSrcSet
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="text-xs md:text-sm font-serif font-medium leading-snug mb-1">
                      {item.title}
                    </h3>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-brand-navy font-semibold text-sm">
                        {item.price}
                      </span>
                      <span className="text-xs text-brand-textMuted whitespace-nowrap">
                        {item.duration}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 工作坊課程 ===== */}
        <section
          ref={workshopRef}
          className="py-16 md:py-24 bg-brand-cream"
        >
          <div className="container-brand">
            <SectionHeader
              label="Workshop"
              title="工作坊課程"
              subtitle="親身體驗攝影師的一天，從佈光到修圖，完整了解專業流程"
              visible={workshopVisible}
            />

            <div className="max-w-lg mx-auto">
              {workshopPricing.items.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-lg overflow-hidden border border-brand-creamDark hover:-translate-y-1 hover:shadow-sm transition-all duration-300 flex flex-row sr-fade-up ${workshopVisible ? "sr-visible" : ""}`}
                >
                  <div className="w-32 md:w-40 flex-shrink-0">
                    <LazyImage
                      src={item.image}
                      alt={`好時有影台北${item.title}`}
                      className="w-full h-full object-cover object-center"
                      width={160}
                      height={160}
                      autoSrcSet
                      sizes="(max-width: 768px) 128px, 160px"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center p-4 md:p-5">
                    <h3 className="text-sm md:text-base font-serif font-medium mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-brand-navy font-semibold mb-1">
                      {item.price}
                    </p>
                    <p className="text-xs text-brand-textLight leading-[1.8]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section
          ref={faqRef}
          className="py-16 md:py-24 bg-brand-cream"
        >
          <div className="container-brand max-w-3xl">
            <SectionHeader
              label="FAQ"
              title="價目常見問題"
              subtitle="關於攝影、妝髮、課程定價的詳細解答，讓你預約前一切透明"
              visible={faqVisible}
            />
            {pricingFAQ.map((item, index) => (
              <FAQItem key={item.category} faq={item} defaultOpenIndex={index === 0 ? 0 : -1} />
            ))}
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-20 md:py-28 bg-brand-navy text-white text-center">
          <div
            ref={ctaRef}
            className={`container-brand max-w-2xl sr-fade-up sr-slow ${ctaVisible ? "sr-visible" : ""}`}
          >
            <div className="w-12 h-px bg-brand-gold mx-auto mb-6" />
            <h2 className="text-display text-xl md:text-2xl lg:text-3xl font-medium mb-8">
              準備好預約你的專屬拍攝時段了嗎？
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/booking"
                className="btn-primary bg-white text-brand-navy hover:bg-brand-cream w-full sm:w-auto whitespace-nowrap"
              >
                線上預約
              </Link>
              <a
                href="https://line.me/R/ti/p/@614cnqns"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline border-white text-white hover:bg-white hover:text-brand-navy w-full sm:w-auto whitespace-nowrap"
              >
                LINE 詢問
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}