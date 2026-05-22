import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import FloatingButtons from '@/components/feature/FloatingButtons';
import PageSEO from '@/components/base/PageSEO';
import ParallaxHero from '@/components/base/ParallaxHero';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { booking as bookingImg } from '@/config/images';
import { BookingApp } from './components/BookingApp';

const shootingFlow = [
  {
    step: '1',
    title: '線上預約',
    desc: '線上預約選擇拍攝項目與時間，收到預約信',
    icon: 'ri-calendar-line',
  },
  {
    step: '2',
    title: '造型準備',
    desc: '可自備妝髮，或加購專業妝髮服務。',
    icon: 'ri-scissors-cut-line',
  },
  {
    step: '3',
    title: '進棚拍攝',
    desc: '站姿、坐姿、表情都會引導，不需要自己想姿勢。',
    icon: 'ri-camera-3-line',
  },
  {
    step: '4',
    title: '挑選照片',
    desc: '拍完在現場挑圖，我們會給予建議。',
    icon: 'ri-image-line',
  },
  {
    step: '5',
    title: '按張計費結帳',
    desc: '根據最終選擇的照片數量計費。',
    icon: 'ri-price-tag-3-line',
  },
  {
    step: '6',
    title: '7天內交件',
    desc: '7天內將修圖後的電子檔以 Email 寄出，收到成品還可以再改稿 2 次。',
    icon: 'ri-mail-send-line',
  },
];

export default function Booking() {
  const [heroRef, heroVisible] = useScrollReveal<HTMLElement>();
  const [flowRef, flowVisible] = useScrollReveal<HTMLElement>();
  const [widgetRef, widgetVisible] = useScrollReveal<HTMLElement>();

  return (
    <>
      <PageSEO
        title="線上預約 | 好時有影 Golden Years Studio | 韓式證件照、形象照預約"
        description="立即預約好時有影專業攝影服務。線上選擇韓式證件照、形象照、畢業寫真等拍攝時段，查看預約須知與拍攝流程。台北公館攝影工作室，線上預約系統快速方便。"
      />
      <Header />
      <main>
        {/* Hero */}
        <ParallaxHero
          heightClass="h-[360px] md:h-[440px]"
          image={bookingImg.hero}
          imageAlt="好時有影台北攝影服務線上預約"
          imageOpacity={0.30}
          parallaxRate={0.20}
          revealVisible={heroVisible}
          sectionRef={heroRef}
        >
          <div className="text-center px-4">
            <span className="inline-block font-serif-en text-xs md:text-sm tracking-[0.2em] uppercase text-brand-gold mb-4">
              Online Booking
            </span>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4">
              好時有影線上預約
            </h1>
            <p className="font-serif text-sm md:text-base text-white/80 max-w-xl mx-auto">
              請確認服務內容與須知
            </p>
          </div>
        </ParallaxHero>

        {/* Shooting Flow */}
        <section
          ref={flowRef}
          className={`py-12 md:py-16 bg-white sr-fade-up ${flowVisible ? "sr-visible" : ""}`}
        >
          <div className="w-full px-4 md:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-serif text-xl md:text-2xl font-semibold text-brand-navy text-center mb-10">
                服務流程
              </h2>

              {/* Mobile: vertical timeline */}
              <div className="lg:hidden relative pl-12">
                <div className="absolute left-[19px] top-5 bottom-5 w-px bg-brand-gold/30" />
                {shootingFlow.map((flow, idx) => (
                  <div
                    key={flow.step}
                    className={`relative mb-10 last:mb-0 sr-fade-up sr-fast ${flowVisible ? "sr-visible" : ""}`}
                    style={{ transitionDelay: flowVisible ? `${idx * 100}ms` : "0ms" }}
                  >
                    <div className="absolute -left-12 top-0 w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center border-[3px] border-white shadow-sm z-10">
                      <span className="text-brand-navy font-bold text-sm">{flow.step}</span>
                    </div>
                    <div className="pt-1.5">
                      <h4 className="font-serif text-base font-semibold text-brand-navy mb-1.5">
                        {flow.title}
                      </h4>
                      <p className="text-xs text-brand-muted leading-relaxed">
                        {flow.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: horizontal timeline */}
              <div className="hidden lg:block relative">
                <div className="absolute top-[20px] left-[8%] right-[8%] h-px bg-brand-gold/30" />
                <div className="flex justify-between items-start">
                  {shootingFlow.map((flow, idx) => (
                    <div
                      key={flow.step}
                      className={`flex flex-col items-center w-[14%] sr-fade-up sr-fast ${flowVisible ? "sr-visible" : ""}`}
                      style={{ transitionDelay: flowVisible ? `${idx * 100}ms` : "0ms" }}
                    >
                      <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center border-[3px] border-white shadow-sm z-10 mb-4">
                        <span className="text-brand-navy font-bold text-sm">{flow.step}</span>
                      </div>
                      <h4 className="font-serif text-base font-semibold text-brand-navy mb-2 text-center">
                        {flow.title}
                      </h4>
                      <p className="text-xs text-brand-muted leading-relaxed text-center">
                        {flow.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Slots App */}
        <section
          ref={widgetRef}
          className={`py-12 md:py-16 bg-brand-cream sr-fade-up ${widgetVisible ? "sr-visible" : ""}`}
        >
          <div className="w-full px-4 md:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-lg border border-brand-navy/5 p-4 md:p-6 lg:p-8">
                <BookingApp />
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