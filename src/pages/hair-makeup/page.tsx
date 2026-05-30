import { Link } from "react-router-dom";
import Header from "@/components/feature/Header";
import Footer from "@/components/feature/Footer";
import FloatingButtons from "@/components/feature/FloatingButtons";
import PageSEO from "@/components/base/PageSEO";
import { makeupPageData } from "@/mocks/makeup-services";
import ParallaxHero from "@/components/base/ParallaxHero";
import LazyImage from "@/components/base/LazyImage";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import FAQItem from "./components/FAQItem";
import { hairMakeup as makeupImg } from "@/config/images";
import FAQSchema from "@/components/base/FAQSchema";

// 妝髮頁 FAQ 結構化資料
const flatFAQ = makeupPageData.faq.flatMap((cat) => cat.qa);

export default function MakeupServices() {
  return (
    <>
      <PageSEO
        title="妝髮造型服務 | 好時有影 Golden Years | 韓式妝髮、證件照妝容、台北"
        description="好時有影專業妝髮造型服務，羽彤老師帶領的造型團隊。提供基礎妝容、精緻妝髮、訂製造型方案，搭配攝影服務一站完成。適合證件照、形象照、婚紗等場合。台北公館妝髮工作室。"
        keywords="妝髮造型,韓式妝髮,證件照妝容,台北化妝師,婚紗妝髮,新娘秘書,男生妝髮,女生妝髮,專業妝髮,台北妝髮工作室"
      />
      <FAQSchema questions={flatFAQ} pageName="hair-makeup" />
      <Header />
      <main>
        <HeroSection />
        <QuoteSection />
        <ComparisonSection />
        <PlansSection />
        <FAQSection />
        <BookingTimelineSection />
        <CTASection />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}

/* ===================== Hero ===================== */
function HeroSection() {
  const [ref, visible] = useScrollReveal<HTMLElement>();

  return (
    <ParallaxHero
      heightClass="h-[380px] md:h-[480px]"
      image={makeupImg.hero}
      imageAlt="好時有影台北專業妝髮造型服務"
      imageOpacity={0.30}
      parallaxRate={0.20}
      revealVisible={visible}
      sectionRef={ref}
    >
      <div className="text-center px-4">
        <div className="inline-flex items-center gap-3 mb-5">
          <span className="block w-8 md:w-10 h-px bg-brand-gold" />
          <p className="text-brand-gold text-xs md:text-sm tracking-[0.2em] uppercase font-medium">
            Hair & Makeup
          </p>
          <span className="block w-8 md:w-10 h-px bg-brand-gold" />
        </div>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-5 max-w-3xl mx-auto leading-tight">
          {makeupPageData.hero.title}
        </h1>
        <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          {makeupPageData.hero.subtitle}
        </p>
      </div>
    </ParallaxHero>
  );
}

/* ===================== Quote（羽彤老師） ===================== */
function QuoteSection() {
  const [imgRef, imgVisible] = useScrollReveal<HTMLDivElement>();
  const [textRef, textVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <section className="section-padding bg-brand-creamDark">
      <div className="container-brand">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-center">
          <div
            ref={imgRef}
            className={`sr-slide-left ${imgVisible ? "sr-visible" : ""}`}
          >
            <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: "3 / 4" }}>
              <LazyImage
                src={makeupImg.teacher}
                alt="好時有影首席造型師羽彤老師專業妝髮"
                className="w-full h-full object-cover object-top"
                loading="lazy"
                decoding="async"
                width={600}
                height={800}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pt-16 pb-5 px-5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-px bg-brand-gold" />
                  <span className="text-white text-sm font-medium">
                    羽彤老師
                  </span>
                  <span className="text-white/60 text-xs">
                    首席造型師
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={textRef}
            className={`sr-slide-right ${textVisible ? "sr-visible" : ""}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center bg-brand-navy rounded-full flex-shrink-0">
                <i className="ri-double-quotes-l text-white text-sm" />
              </div>
              <div>
                <p className="text-brand-gold text-sm font-medium">
                  {makeupPageData.quote.author}
                </p>
                <p className="text-xs text-brand-textMuted">
                  妝髮不只是修飾，而是一種陪伴
                </p>
              </div>
            </div>
            <div className="space-y-5">
              {makeupPageData.quote.content.split("\n\n").map((paragraph, index) => (
                <p
                  key={index}
                  className="text-brand-textLight leading-[1.9] text-sm md:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== Comparison ===================== */
function ComparisonSection() {
  const [ref, visible] = useScrollReveal<HTMLDivElement>();

  const compareCards = [
    {
      label: "A",
      title: "女生基礎妝",
      price: "NT$ 800",
      duration: "30 min",
      items: [
        { name: "底妝", ok: true },
        { name: "修容", ok: true },
        { name: "眼妝", note: "內眼線" },
        { name: "髮型", ok: false },
      ],
    },
    {
      label: "B",
      title: "男生基礎妝",
      price: "NT$ 600",
      duration: "30 min",
      items: [
        { name: "底妝", ok: true },
        { name: "修容", ok: true },
        { name: "眼妝", ok: false },
        { name: "髮型", ok: false },
      ],
    },
    {
      label: "C",
      title: "女生精緻妝髮",
      price: "NT$ 1,500",
      duration: "1 hr",
      popular: true,
      items: [
        { name: "底妝", ok: true },
        { name: "修容", ok: true },
        { name: "眼妝", ok: true },
        { name: "髮型", ok: true },
      ],
    },
    {
      label: "D",
      title: "男生精緻妝髮",
      price: "NT$ 1,200",
      duration: "1 hr",
      items: [
        { name: "底妝", ok: true },
        { name: "修容", ok: true },
        { name: "眼妝", ok: true },
        { name: "髮型", ok: true },
      ],
    },
    {
      label: "E",
      title: "訂製妝髮專案",
      price: "NT$ 3,000",
      duration: "1.5 hr",
      items: [
        { name: "底妝", ok: true },
        { name: "修容", ok: true },
        { name: "眼妝", note: "含假睫毛" },
        { name: "髮型", ok: true },
      ],
    },
  ];

  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-brand">
        <div
          ref={ref}
          className={`text-center mb-10 md:mb-14 sr-fade-up ${visible ? "sr-visible" : ""}`}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="block w-8 md:w-10 h-px bg-brand-gold" />
            <p className="text-brand-gold text-xs md:text-sm tracking-[0.2em] uppercase font-medium">
              Compare
            </p>
            <span className="block w-8 md:w-10 h-px bg-brand-gold" />
          </div>
          <h2 className="text-display text-2xl md:text-3xl lg:text-4xl font-medium">
            方案快速比較
          </h2>
          <p className="text-brand-textLight text-sm md:text-base mt-3 max-w-xl mx-auto">
            一張表看懂所有方案差異，選擇最適合你的妝髮服務
          </p>
        </div>

        {/* Desktop Table */}
        <div className={`hidden md:block overflow-x-auto sr-fade-up ${visible ? "sr-visible" : ""}`}>
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b-2 border-brand-navy/10">
                <th className="text-left py-4 px-3 text-brand-textMuted font-normal text-xs tracking-wider uppercase">
                  比較項目
                </th>
                <th className="text-center py-4 px-3 text-brand-navy font-medium">
                  女生基礎妝
                </th>
                <th className="text-center py-4 px-3 text-brand-navy font-medium">
                  男生基礎妝
                </th>
                <th className="text-center py-4 px-3 text-brand-navy font-medium">
                  <span className="inline-flex items-center gap-1">
                    女生精緻妝髮
                    <span className="text-[10px] bg-brand-gold/20 text-brand-gold px-1.5 py-0.5 rounded">
                      推薦
                    </span>
                  </span>
                </th>
                <th className="text-center py-4 px-3 text-brand-navy font-medium">
                  男生精緻妝髮
                </th>
                <th className="text-center py-4 px-3 text-brand-navy font-medium">
                  訂製妝髮專案
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-brand-navy/[0.06]">
                <td className="py-4 px-3 text-brand-textLight">價格</td>
                <td className="py-4 px-3 text-center font-medium text-brand-navy">NT$ 800</td>
                <td className="py-4 px-3 text-center font-medium text-brand-navy">NT$ 600</td>
                <td className="py-4 px-3 text-center font-medium text-brand-navy">NT$ 1,500</td>
                <td className="py-4 px-3 text-center font-medium text-brand-navy">NT$ 1,200</td>
                <td className="py-4 px-3 text-center font-medium text-brand-navy">NT$ 3,000</td>
              </tr>
              <tr className="border-b border-brand-navy/[0.06] bg-brand-creamDark/30">
                <td className="py-4 px-3 text-brand-textLight">時間</td>
                <td className="py-4 px-3 text-center text-brand-textLight">30 min</td>
                <td className="py-4 px-3 text-center text-brand-textLight">30 min</td>
                <td className="py-4 px-3 text-center text-brand-textLight">1 hr</td>
                <td className="py-4 px-3 text-center text-brand-textLight">1 hr</td>
                <td className="py-4 px-3 text-center text-brand-textLight">1.5 hr</td>
              </tr>
              <tr className="border-b border-brand-navy/[0.06]">
                <td className="py-4 px-3 text-brand-textLight">底妝</td>
                <td className="py-4 px-3 text-center"><i className="ri-check-line text-brand-gold" /></td>
                <td className="py-4 px-3 text-center"><i className="ri-check-line text-brand-gold" /></td>
                <td className="py-4 px-3 text-center"><i className="ri-check-line text-brand-gold" /></td>
                <td className="py-4 px-3 text-center"><i className="ri-check-line text-brand-gold" /></td>
                <td className="py-4 px-3 text-center"><i className="ri-check-line text-brand-gold" /></td>
              </tr>
              <tr className="border-b border-brand-navy/[0.06] bg-brand-creamDark/30">
                <td className="py-4 px-3 text-brand-textLight">修容</td>
                <td className="py-4 px-3 text-center"><i className="ri-check-line text-brand-gold" /></td>
                <td className="py-4 px-3 text-center"><i className="ri-check-line text-brand-gold" /></td>
                <td className="py-4 px-3 text-center"><i className="ri-check-line text-brand-gold" /></td>
                <td className="py-4 px-3 text-center"><i className="ri-check-line text-brand-gold" /></td>
                <td className="py-4 px-3 text-center"><i className="ri-check-line text-brand-gold" /></td>
              </tr>
              <tr className="border-b border-brand-navy/[0.06]">
                <td className="py-4 px-3 text-brand-textLight">眼妝</td>
                <td className="py-4 px-3 text-center text-brand-textMuted">內眼線</td>
                <td className="py-4 px-3 text-center text-brand-textMuted">—</td>
                <td className="py-4 px-3 text-center"><i className="ri-check-line text-brand-gold" /></td>
                <td className="py-4 px-3 text-center"><i className="ri-check-line text-brand-gold" /></td>
                <td className="py-4 px-3 text-center text-brand-gold text-xs">含假睫毛</td>
              </tr>
              <tr className="border-b border-brand-navy/[0.06] bg-brand-creamDark/30">
                <td className="py-4 px-3 text-brand-textLight">髮型</td>
                <td className="py-4 px-3 text-center text-brand-textMuted">—</td>
                <td className="py-4 px-3 text-center text-brand-textMuted">—</td>
                <td className="py-4 px-3 text-center"><i className="ri-check-line text-brand-gold" /></td>
                <td className="py-4 px-3 text-center"><i className="ri-check-line text-brand-gold" /></td>
                <td className="py-4 px-3 text-center"><i className="ri-check-line text-brand-gold" /></td>
              </tr>
              <tr className="border-b border-brand-navy/[0.06]">
                <td className="py-4 px-3 text-brand-textLight">造型溝通</td>
                <td className="py-4 px-3 text-center text-brand-textMuted">—</td>
                <td className="py-4 px-3 text-center text-brand-textMuted">—</td>
                <td className="py-4 px-3 text-center text-brand-textMuted">—</td>
                <td className="py-4 px-3 text-center text-brand-textMuted">—</td>
                <td className="py-4 px-3 text-center"><i className="ri-check-line text-brand-gold" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className={`md:hidden grid grid-cols-1 gap-4 sr-fade-up sr-slow ${visible ? "sr-visible" : ""}`}>
          {compareCards.map((card) => (
            <div
              key={card.label}
              className={`bg-white rounded-lg p-5 border ${card.popular ? "border-brand-gold/40" : "border-brand-cream"}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-brand-navy text-white text-xs font-medium flex items-center justify-center">
                    {card.label}
                  </span>
                  <h4 className="text-sm font-medium text-brand-navy">{card.title}</h4>
                </div>
                {card.popular && (
                  <span className="text-[10px] bg-brand-gold/15 text-brand-gold px-2 py-0.5 rounded font-medium">
                    推薦
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2 mb-4 pb-3 border-b border-brand-cream">
                <span className="text-brand-navy font-medium text-base">{card.price}</span>
                <span className="text-brand-textMuted text-xs">· {card.duration}</span>
              </div>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {card.items.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    {item.ok ? (
                      <i className="ri-check-line text-brand-gold text-xs" />
                    ) : (
                      <i className="ri-close-line text-brand-textMuted text-xs" />
                    )}
                    <span className={`text-xs ${item.ok ? "text-brand-textLight" : "text-brand-textMuted"}`}>
                      {item.name}
                      {item.note && (
                        <span className="text-brand-textMuted"> ({item.note})</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-brand-textMuted mt-6">
          詳細方案說明請見下方，或
          <a href="https://line.me/R/ti/p/@614cnqns" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline">
            私訊 LINE 官方帳號
          </a>
          詢問
        </p>
      </div>
    </section>
  );
}

/* ===================== Plans（奇偶交錯排版，合併 observer） ===================== */
function PlansSection() {
  const [headerRef, headerVisible] = useScrollReveal<HTMLDivElement>();
  const [plansRef, plansVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-brand-creamDark">
      <div className="container-brand">
        <div
          ref={headerRef}
          className={`text-center py-16 md:py-24 sr-fade-up ${headerVisible ? "sr-visible" : ""}`}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="block w-8 md:w-10 h-px bg-brand-gold" />
            <p className="text-brand-gold text-xs md:text-sm tracking-[0.2em] uppercase font-medium">
              方案說明
            </p>
            <span className="block w-8 md:w-10 h-px bg-brand-gold" />
          </div>
          <h2 className="text-display text-2xl md:text-3xl lg:text-4xl font-medium">
            選擇適合你的妝髮方案
          </h2>
        </div>

        <div ref={plansRef}>
          {makeupPageData.plans.map((plan, index) => (
            <PlanBlock key={plan.id} plan={plan} index={index} visible={plansVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface PlanBlockProps {
  plan: (typeof makeupPageData.plans)[0];
  index: number;
  visible: boolean;
}

function PlanBlock({ plan, index, visible }: PlanBlockProps) {
  const isReversed = index % 2 === 1;

  return (
    <div
      className={`py-12 md:py-20 ${index > 0 ? "border-t border-brand-cream" : ""} sr-fade-up ${visible ? "sr-visible" : ""}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center ${isReversed ? "lg:flex-row-reverse" : ""}`}>
        {/* 圖片 */}
        <div className={isReversed ? "lg:order-2" : "lg:order-1"}>
          <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: "3 / 4" }}>
            <LazyImage
              src={plan.image}
              alt={`好時有影台北${plan.title}`}
              className="w-full h-full object-cover object-top"
              loading="lazy"
              decoding="async"
              width={600}
              height={800}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute top-4 left-4">
              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium tracking-wider ${
                  plan.popular
                    ? "bg-brand-navy text-white"
                    : "bg-white/90 text-brand-navy backdrop-blur-sm"
                }`}
              >
                {plan.label} 方案
                {plan.popular && <span className="text-brand-gold">POPULAR</span>}
              </span>
            </div>
          </div>
        </div>

        {/* 文字 */}
        <div className={isReversed ? "lg:order-1" : "lg:order-2"}>
          <div className="mb-6">
            <h3 className="text-display text-xl md:text-2xl lg:text-3xl font-medium mb-2">
              {plan.title}
            </h3>
            <p className="text-sm text-brand-textMuted">{plan.tagline}</p>
          </div>

          <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-brand-cream">
            <p className="text-brand-navy font-medium text-lg md:text-xl">{plan.price}</p>
            <span className="text-brand-textMuted text-sm">· {plan.duration}</span>
          </div>

          <div className="mb-6">
            <p className="text-xs text-brand-textMuted mb-3 uppercase tracking-wider">包含項目</p>
            <ul className="space-y-2">
              {plan.includes.map((item) => (
                <li key={item} className="text-sm text-brand-textLight flex items-start gap-2">
                  <i className="ri-check-line text-brand-gold mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {plan.excludes.length > 0 && (
            <div className="mb-6">
              <p className="text-xs text-brand-textMuted mb-3 uppercase tracking-wider">不包含</p>
              <ul className="space-y-2">
                {plan.excludes.map((item) => (
                  <li key={item} className="text-sm text-brand-textMuted flex items-start gap-2">
                    <i className="ri-close-line flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-start gap-2 bg-white/60 rounded-md p-3">
            <i className="ri-time-line text-brand-gold mt-0.5 flex-shrink-0 text-sm" />
            <p className="text-xs text-brand-textLight leading-[1.6]">{plan.arrivalNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== FAQ ===================== */
function FAQSection() {
  const [headerRef, headerVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-brand max-w-3xl">
        <div
          ref={headerRef}
          className={`text-center mb-10 md:mb-14 sr-fade-up ${headerVisible ? "sr-visible" : ""}`}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="block w-8 md:w-10 h-px bg-brand-gold" />
            <p className="text-brand-gold text-xs md:text-sm tracking-[0.2em] uppercase font-medium">
              FAQ
            </p>
            <span className="block w-8 md:w-10 h-px bg-brand-gold" />
          </div>
          <h2 className="text-display text-2xl md:text-3xl lg:text-4xl font-medium">
            妝髮服務常見問題
          </h2>
        </div>

        {makeupPageData.faq.map((item, index) => (
          <FAQItem key={item.category} faq={item} defaultOpenIndex={index === 0 ? 0 : -1} />
        ))}
      </div>
    </section>
  );
}

/* ===================== Booking Timeline ===================== */
function BookingTimelineSection() {
  const [ref, visible] = useScrollReveal<HTMLDivElement>();

  const steps = [
    {
      icon: "ri-calendar-check-line",
      title: "預約時加購",
      desc: "請於預約拍攝時，在加購項目中勾選您需要的「妝髮服務」選項，即可一併安排。",
    },
    {
      icon: "ri-user-smile-line",
      title: "素顏前來",
      desc: "為達最佳效果，建議您當天素顏前來（可擦保養品）。造型師會為您進行簡易清潔與妝前打底。",
    },
  ];

  return (
    <section className="section-padding bg-brand-creamDark">
      <div className="container-brand max-w-3xl">
        <div
          ref={ref}
          className={`text-center mb-10 md:mb-14 sr-fade-up ${visible ? "sr-visible" : ""}`}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="block w-8 md:w-10 h-px bg-brand-gold" />
            <p className="text-brand-gold text-xs md:text-sm tracking-[0.2em] uppercase font-medium">
              Booking
            </p>
            <span className="block w-8 md:w-10 h-px bg-brand-gold" />
          </div>
          <h2 className="text-display text-2xl md:text-3xl font-medium">
            如何預約妝髮服務
          </h2>
        </div>

        {/* Desktop Timeline — horizontal */}
        <div
          className={`hidden md:block sr-fade-up ${visible ? "sr-visible" : ""}`}
        >
          <div className="flex items-start justify-between relative">
            {/* dashed connector */}
            <div className="absolute top-7 left-[calc(12%+12px)] right-[calc(12%+12px)] border-t-2 border-dashed border-brand-gold/40" />
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center" style={{ width: `${100 / steps.length}%` }}>
                <div className="relative z-10 w-14 h-14 rounded-full bg-white border-2 border-brand-gold flex items-center justify-center mb-4">
                  <i className={`${step.icon} text-brand-navy text-lg`} />
                </div>
                <span className="text-xs text-brand-gold font-medium mb-1.5">
                  Step {index + 1}
                </span>
                <h4 className="text-sm font-medium text-brand-navy mb-2">{step.title}</h4>
                <p className="text-xs text-brand-textLight leading-relaxed max-w-[220px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Timeline — vertical */}
        <div className="md:hidden relative sr-fade-up sr-slow">
          {/* vertical line */}
          <div className="absolute left-[19px] top-6 bottom-6 w-px bg-brand-gold/40" />
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="relative z-10 w-10 h-10 rounded-full bg-white border-2 border-brand-gold flex items-center justify-center flex-shrink-0">
                  <i className={`${step.icon} text-brand-navy text-sm`} />
                </div>
                <div className="pt-1">
                  <span className="text-[10px] text-brand-gold font-medium tracking-wider uppercase">
                    Step {index + 1}
                  </span>
                  <h4 className="text-sm font-medium text-brand-navy mt-0.5 mb-1">{step.title}</h4>
                  <p className="text-xs text-brand-textLight leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 服務備註 */}
      <div className="mt-10 md:mt-14 sr-fade-up sr-slow">
        <div className="bg-white rounded-lg border border-brand-cream p-5 md:p-6">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-brand-cream">
            <i className="ri-information-line text-brand-gold text-sm" />
            <h3 className="text-sm font-medium text-brand-navy">服務備註</h3>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
            {[
              "持學生證可優惠折100元（證件照除外）",
              "無沖印實體照片",
              "專業自然修圖，可校稿兩次",
              "成品為高畫質電子檔",
              "於一週內交件（隔日交件＋100元/張）",
              "預設灰色背景，換購白色背景總價+500元",
            ].map((note, index) => (
              <li
                key={index}
                className="flex items-start gap-2.5 text-xs md:text-sm text-brand-textLight leading-[1.7]"
              >
                <i className="ri-check-line text-brand-gold mt-0.5 flex-shrink-0 text-xs" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ===================== CTA ===================== */
function CTASection() {
  const [ref, visible] = useScrollReveal<HTMLElement>();

  return (
    <section className="py-20 md:py-28 bg-brand-navy text-white text-center">
      <div
        ref={ref}
        className={`container-brand max-w-2xl sr-fade-up sr-slow ${visible ? "sr-visible" : ""}`}
      >
        <div className="w-12 h-px bg-brand-gold mx-auto mb-6" />
        <h2 className="text-display text-xl md:text-2xl lg:text-3xl font-medium mb-8">
          準備好預約你的妝髮服務了嗎？
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
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
            className="text-white/70 text-sm hover:text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors whitespace-nowrap"
          >
            或透過 LINE 詢問
          </a>
        </div>
      </div>
    </section>
  );
}