import { useEffect, useRef, useState } from 'react';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import FloatingButtons from '@/components/feature/FloatingButtons';
import PageSEO from '@/components/base/PageSEO';
import ParallaxHero from '@/components/base/ParallaxHero';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { booking as bookingImg } from '@/config/images';

const bookingNotice = [
  {
    icon: 'ri-calendar-check-line',
    title: '預約系統開放未來近 14 日內的預約',
  },
  {
    icon: 'ri-close-circle-line',
    title: '若需取消、更改時段，請直接至預約確認信取消並重新預約',
  },
  {
    icon: 'ri-file-list-line',
    title: '若要拍攝形象照＋證件照，請先選擇形象照再備註加購證件照',
  },
  {
    icon: 'ri-group-line',
    title: '若要拍攝多種項目或更換多套衣服，請預約兩個時段，一個時段低消一張',
  },
];

const preparation = [
  {
    icon: 'ri-t-shirt-line',
    title: '服裝須自備',
    desc: '工作室有學士服帽與黑色領帶，無提供其餘服裝',
  },
  {
    icon: 'ri-scissors-cut-line',
    title: '自助整理工具',
    desc: '店裡備有吹風機、電捲棒與掛燙機可供使用',
  },
  {
    icon: 'ri-restaurant-line',
    title: '維護環境整潔',
    desc: '工作室內請勿飲食，食物飲料垃圾請自行帶離',
  },
  {
    icon: 'ri-question-line',
    title: '任何疑問',
    desc: '歡迎私訊 IG：goldenyears_studio',
  },
];

const shootingFlow = [
  {
    step: '1',
    title: '線上預約',
    desc: '先在網站上選擇拍攝項目與時間，收到預約信就代表預約成功了。',
    icon: 'ri-calendar-line',
  },
  {
    step: '2',
    title: '到棚拍攝',
    desc: '站姿、坐姿、表情都會引導，不需要自己想姿勢。',
    icon: 'ri-camera-3-line',
  },
  {
    step: '3',
    title: '精選照片',
    desc: '拍完現場挑片，我們會給予建議。',
    icon: 'ri-image-line',
  },
  {
    step: '4',
    title: '按張計費結帳',
    desc: '根據選擇的照片數量計費，透明公開。',
    icon: 'ri-price-tag-3-line',
  },
  {
    step: '5',
    title: '成品交付',
    desc: '修圖完成後以 Email 寄出電子檔，收到成品還可以再改稿 2 次。',
    icon: 'ri-mail-send-line',
  },
];

/* ===================== Deferred Booking Widget ===================== */
const BookingWidget = () => {
  const widgetContainerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  /* Intersection Observer：進入 viewport 才載入，避免阻塞首頁渲染 */
  useEffect(() => {
    const el = widgetContainerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* 真正載入 SimplyBook script */
  useEffect(() => {
    if (!shouldLoad || scriptRef.current) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://widget.simplybook.asia/v2/widget/widget.js';
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const win = window as any;
      if (win.SimplybookWidget) {
        // eslint-disable-next-line no-new
        new win.SimplybookWidget({
          widget_type: 'iframe',
          url: 'https://goldenyearsportrait2.simplybook.asia',
          theme: 'creative',
          theme_settings: {
            timeline_show_end_time: '0',
            timeline_modern_display: 'as_slots',
            timeline_hide_unavailable: '1',
            index_page_content_grid:
              '[{"template":"col_25_50_25","items":["timetable","about-us","contacts"]}]',
            hide_past_days: '0',
            sb_base_color: '#2a3e5e',
            display_item_mode: 'block',
            booking_nav_bg_color: '#2a3e5e',
            body_bg_color: '#fdfbf7',
            sb_review_image: '',
            dark_font_color: '#2d2d2d',
            light_font_color: '#ffffff',
            btn_color_1: '#1a2b4a',
            hide_img_mode: '0',
            show_sidebar: '0',
            sb_busy: '#c8b8a5',
            sb_available: '#e8ecf2',
          },
          timeline: 'modern_week',
          datepicker: 'top_calendar',
          is_rtl: false,
          app_config: {
            clear_session: 0,
            allow_switch_to_ada: 0,
            predefined: [],
          },
          container_id: 'sbw_4bnfxe',
        });
      }
      setIsLoaded(true);
    };
    document.head.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
      scriptRef.current = null;
    };
  }, [shouldLoad]);

  return (
    <>
      {!isLoaded && (
        <div className="flex flex-col items-center justify-center py-16 md:py-20 text-brand-muted">
          <div className="w-10 h-10 border-2 border-brand-creamDark border-t-brand-gold rounded-full animate-spin mb-4" />
          <p className="text-sm">預約系統載入中...</p>
          <p className="text-xs mt-1">請向下捲動以啟動預約表單</p>
        </div>
      )}
      <div id="sbw_4bnfxe" ref={widgetContainerRef} />
    </>
  );
};

export default function Booking() {
  const [heroRef, heroVisible] = useScrollReveal<HTMLElement>();
  const [noticeRef, noticeVisible] = useScrollReveal<HTMLElement>();
  const [flowRef, flowVisible] = useScrollReveal<HTMLElement>();
  const [widgetRef, widgetVisible] = useScrollReveal<HTMLElement>();

  return (
    <>
      <PageSEO
        title="線上預約 | 好時有影 Golden Years Studio | 韓式證件照、形象照預約"
        description="立即預約好時有影專業攝影服務。線上選擇韓式證件照、形象照、畢業寫真等拍攝時段，查看預約須知與拍攝流程。台北公館攝影工作室，SimplyBook 線上預約系統快速方便。"
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
              請先確認服務內容與須知，再填寫預約表單
            </p>
          </div>
        </ParallaxHero>

        {/* Notice Section */}
        <section
          ref={noticeRef}
          className={`py-12 md:py-16 bg-brand-cream sr-fade-up ${noticeVisible ? "sr-visible" : ""}`}
        >
          <div className="w-full px-4 md:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10 md:mb-12">
                <h2 className="font-serif text-xl md:text-2xl font-semibold text-brand-navy mb-3">
                  預約須知
                </h2>
                <p className="text-sm text-brand-muted">
                  預約即代表您已閱讀並同意服務須知，謝謝您！
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-8 md:mb-10">
                {bookingNotice.map((item, idx) => (
                  <div
                    key={idx}
                    className={`bg-white rounded-lg pl-5 pr-5 py-5 flex items-start gap-4 border border-brand-navy/5 border-l-[3px] border-l-brand-gold sr-fade-up sr-fast ${noticeVisible ? "sr-visible" : ""}`}
                    style={{ transitionDelay: noticeVisible ? `${idx * 80}ms` : "0ms" }}
                  >
                    <div className="w-9 h-9 rounded-full bg-brand-cream flex items-center justify-center flex-shrink-0">
                      <i className={`${item.icon} w-4 h-4 flex items-center justify-center text-brand-gold text-sm`} />
                    </div>
                    <p className="text-sm text-brand-charcoal pt-1.5 leading-relaxed">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>

              <div className={`bg-brand-cream/40 rounded-xl p-6 md:p-8 sr-fade-up sr-slow ${noticeVisible ? "sr-visible" : ""}`}>
                <h3 className="font-serif text-base md:text-lg font-semibold text-brand-navy mb-5 flex items-center gap-2">
                  <i className="ri-t-shirt-line w-5 h-5 flex items-center justify-center text-brand-gold" />
                  拍攝前準備
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                  {preparation.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 sr-fade-up sr-fast ${noticeVisible ? "sr-visible" : ""}`}
                      style={{ transitionDelay: noticeVisible ? `${(idx + 4) * 80}ms` : "0ms" }}
                    >
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                        <i className={`${item.icon} w-4 h-4 flex items-center justify-center text-brand-navy text-sm`} />
                      </div>
                      <div className="pt-0.5">
                        <p className="text-sm font-medium text-brand-charcoal">{item.title}</p>
                        <p className="text-xs text-brand-muted mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Shooting Flow */}
        <section
          ref={flowRef}
          className={`py-12 md:py-16 bg-white sr-fade-up ${flowVisible ? "sr-visible" : ""}`}
        >
          <div className="w-full px-4 md:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-serif text-xl md:text-2xl font-semibold text-brand-navy text-center mb-10">
                拍攝流程
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
                      className={`flex flex-col items-center w-[17%] sr-fade-up sr-fast ${flowVisible ? "sr-visible" : ""}`}
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

        {/* SimplyBook Widget — lazy loaded via Intersection Observer */}
        <section
          ref={widgetRef}
          className={`py-12 md:py-16 bg-brand-cream sr-fade-up ${widgetVisible ? "sr-visible" : ""}`}
        >
          <div className="container-brand">
            <div className="text-center mb-10">
              <h2 className="font-serif text-xl md:text-2xl font-semibold text-brand-navy mb-3">
                預約表單
              </h2>
              <p className="text-sm text-brand-muted">
                請直接在下方選擇服務項目與時段完成預約
              </p>
            </div>

            <div className="bg-white rounded-lg border border-brand-navy/5 relative min-h-[300px]">
              <BookingWidget />
            </div>

            {/* External booking fallback */}
            <p className="text-center text-sm text-brand-muted mt-6">
              若預約系統無法顯示，請嘗試：
              <a
                href="https://goldenyearsportrait2.simplybook.asia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-navy hover:text-brand-gold font-semibold border-b border-brand-navy/20 hover:border-brand-gold transition-all ml-1"
              >
                開啟外部預約頁面 →
              </a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}