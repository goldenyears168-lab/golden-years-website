import { Link } from "react-router-dom";
import Header from "@/components/feature/Header";
import Footer from "@/components/feature/Footer";
import FloatingButtons from "@/components/feature/FloatingButtons";
import PageSEO from "@/components/base/PageSEO";
import ParallaxHero from "@/components/base/ParallaxHero";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { photoCrop as photoCropImg } from "@/config/images";

const officialLinks = [
  {
    label: "內政部戶政司國民身分證申辦",
    url: "https://www.ris.gov.tw/app/portal/765",
    icon: "ri-government-line",
  },
  {
    label: "外交部申辦護照網路填表及預約",
    url: "https://ppass.boca.gov.tw/sp-ip-process-2.html",
    icon: "ri-passport-line",
  },
  {
    label: "衛生福利部健保卡網路申辦",
    url: "https://reurl.cc/qklkb0",
    icon: "ri-health-book-line",
  },
];

const steps = [
  {
    step: "01",
    title: "將相片上傳到裁切排版工具",
    desc: "選擇你要申辦的證件類型，上傳已拍好的大頭照電子檔。",
    icon: "ri-upload-cloud-line",
  },
  {
    step: "02",
    title: "裁切到適合的大小",
    desc: "參考畫面上的黃色輔助線，調整臉部比例與位置至符合規範。",
    icon: "ri-scissors-cut-line",
  },
  {
    step: "03",
    title: "下載到手機或電腦儲存",
    desc: "確認無誤後即可下載，排版好的 4×6 相紙尺寸檔案可直接帶去列印。",
    icon: "ri-download-cloud-line",
  },
];

export default function PhotoCrop() {
  const [heroRef, heroVisible] = useScrollReveal<HTMLElement>();
  const [infoRef, infoVisible] = useScrollReveal<HTMLDivElement>();
  const [toolRef, toolVisible] = useScrollReveal<HTMLDivElement>();
  const [stepsRef, stepsVisible] = useScrollReveal<HTMLDivElement>();
  const [ctaRef, ctaVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <>
      <PageSEO
        title="免費大頭照裁切工具 | 好時有影 Golden Years | 身分證、護照、健保卡規格"
        description="好時有影自製免費大頭照裁切排版工具。身分證、護照、健保卡規格都能裁，自動排版 4×6 相紙尺寸。線上裁切證件照、大頭照、履歷照、簽證照，三步完成下載。"
      />
      <Header />
      <main>
        {/* Hero */}
        <ParallaxHero
          heightClass="h-[360px] md:h-[440px]"
          image={photoCropImg.hero}
          imageAlt="好時有影免費大頭照裁切工具證件照排版"
          imageOpacity={0.30}
          parallaxRate={0.20}
          revealVisible={heroVisible}
          sectionRef={heroRef}
        >
          <div className="text-center px-4">
            <span className="inline-block font-serif-en text-xs md:text-sm tracking-[0.2em] uppercase text-brand-gold mb-4">
              Free Tool
            </span>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4">
              好時有影免費大頭照裁切工具
            </h1>
            <p className="font-serif text-sm md:text-base text-white/80 max-w-xl mx-auto">
              老闆自製好用的免費裁切工具，身分證、護照、健保卡規格都能裁
            </p>
          </div>
        </ParallaxHero>

        {/* Info Section */}
        <section className="py-12 md:py-16 bg-brand-cream">
          <div className="w-full px-4 md:px-6 lg:px-8">
            <div
              ref={infoRef}
              className={`max-w-4xl mx-auto sr-fade-up ${infoVisible ? "sr-visible" : ""}`}
            >
              <div className="text-center mb-10">
                <h2 className="font-serif text-xl md:text-2xl font-semibold text-brand-navy mb-3">
                  電子檔時代，自己裁切超方便
                </h2>
                <p className="text-sm text-brand-muted max-w-2xl mx-auto leading-relaxed">
                  2 吋照片裁切線上工具，適用於證件照、大頭照、身分證、健保卡、履歷照、簽證照等規格。
                  身分證、護照、健保卡的電子檔，已都能用於線上申請，不必印出來。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-10">
                {officialLinks.map((link, idx) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bg-white rounded-lg p-5 border border-brand-navy/5 hover:border-brand-gold/40 transition-all group sr-fade-up sr-fast ${infoVisible ? "sr-visible" : ""}`}
                    style={{ transitionDelay: `${idx * 80}ms` }}
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center mb-3 group-hover:bg-brand-gold/10 transition-colors">
                      <i className={`${link.icon} w-5 h-5 flex items-center justify-center text-brand-gold`} />
                    </div>
                    <p className="text-sm font-medium text-brand-charcoal mb-1">
                      {link.label}
                    </p>
                    <p className="text-xs text-brand-muted flex items-center gap-1">
                      前往官方網站
                      <i className="ri-external-link-line w-3 h-3 flex items-center justify-center" />
                    </p>
                  </a>
                ))}
              </div>

              <div className="bg-white rounded-lg p-6 md:p-8 border border-brand-navy/5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <i className="ri-information-line text-brand-gold text-xl" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-brand-navy mb-2">
                      好時有影無提供實體沖印照片
                    </h3>
                    <p className="text-sm text-brand-textLight leading-relaxed">
                      裁切與自動排版的小工具，可協助裁成大頭照的適當比例，並排版到 4×6 相紙可供下載。
                      拍完照片到全家或 7-ELEVEN 列印很方便，而到相館畫質更好。
                    </p>
                  </div>
                </div>
                <p className="text-xs text-brand-muted mt-3">
                  好時有影 — 最高 CP 值的韓式證件照首選品牌｜中山證件照｜公館證件照｜台北證件照
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tool Iframe */}
        <section className="py-12 md:py-16 bg-white">
          <div className="w-full px-4 md:px-6 lg:px-8">
            <div
              ref={toolRef}
              className={`max-w-5xl mx-auto sr-fade-up ${toolVisible ? "sr-visible" : ""}`}
            >
              <div className="text-center mb-8">
                <h2 className="font-serif text-xl md:text-2xl font-semibold text-brand-navy mb-3">
                  裁切排版工具
                </h2>
                <p className="text-sm text-brand-muted">
                  請在下方選擇證件類型，上傳照片後參考黃色輔助線進行裁切
                </p>
              </div>

              <div className="rounded-lg border border-brand-navy/5 overflow-hidden">
                <iframe
                  src="https://s1031432.github.io/yctest/inch2_head2.html"
                  title="自助裁切大頭照工具"
                  className="w-full h-[700px] md:h-[800px] border-0 block"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-12 md:py-16 bg-brand-creamDark">
          <div className="w-full px-4 md:px-6 lg:px-8">
            <div
              ref={stepsRef}
              className={`max-w-4xl mx-auto sr-fade-up ${stepsVisible ? "sr-visible" : ""}`}
            >
              <div className="text-center mb-10">
                <h2 className="font-serif text-xl md:text-2xl font-semibold text-brand-navy mb-3">
                  使用步驟
                </h2>
                <p className="text-sm text-brand-muted">三步完成，簡單上手</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {steps.map((s, idx) => (
                  <div
                    key={s.step}
                    className={`bg-white rounded-lg p-6 text-center border border-brand-navy/5 sr-fade-up sr-fast ${stepsVisible ? "sr-visible" : ""}`}
                    style={{ transitionDelay: `${idx * 100}ms` }}
                  >
                    <div className="w-12 h-12 rounded-full bg-brand-navy flex items-center justify-center mx-auto mb-4">
                      <i className={`${s.icon} w-6 h-6 flex items-center justify-center text-brand-gold`} />
                    </div>
                    <span className="text-xs text-brand-gold font-medium tracking-wider mb-2 block">
                      Step {s.step}
                    </span>
                    <h3 className="text-base font-semibold text-brand-charcoal mb-2">
                      {s.title}
                    </h3>
                    <p className="text-sm text-brand-muted leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section ref={ctaRef} className={`py-14 md:py-20 bg-brand-navy text-white text-center sr-fade-up ${ctaVisible ? "sr-visible" : ""}`}>
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="font-serif text-xl md:text-2xl lg:text-3xl font-medium mb-6">
              需要專業韓式證件照？
            </h2>
            <p className="text-sm text-white/80 mb-8 max-w-lg mx-auto leading-relaxed">
              自助裁切方便又快速，但如果想要專業妝髮、攝影與修圖，歡迎預約好時有影的韓式證件照服務。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/photography?category=id-formal"
                className="bg-white text-brand-navy px-6 py-3 rounded-md text-sm font-medium hover:bg-brand-cream transition-colors whitespace-nowrap"
              >
                證件照服務
              </Link>
              <Link
                to="/booking"
                className="border border-white text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-white hover:text-brand-navy transition-colors whitespace-nowrap"
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