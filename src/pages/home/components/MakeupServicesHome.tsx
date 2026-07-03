import { useScrollReveal } from "@/hooks/useScrollReveal";
import { home as homeImg } from "@/config/images";
import { Link } from "react-router-dom";
import LazyImage from "@/components/base/LazyImage";

export default function MakeupServicesHome() {
  const [sectionRef, visible] = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className={`section-padding bg-brand-creamDark sr-fade-up ${visible ? "sr-visible" : ""}`}
    >
      <div className="container-brand">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-brand-gold text-sm tracking-[0.15em] uppercase mb-3 font-medium">
            妝髮服務
          </p>
          <h2 className="text-display text-2xl md:text-3xl lg:text-4xl font-medium mb-4">
            專業妝髮，為鏡頭前的你加分
          </h2>
          <p className="text-brand-textLight text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            由首席造型師羽彤老師領軍，提供女生精緻妝髮、男生基礎妝等多元方案，讓你在鏡頭前呈現最佳狀態。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* 圖片 */}
          <div className="rounded-lg overflow-hidden">
            <LazyImage
              src="https://photo.goldenyearsphoto.com/team/styling-session.webp"
              alt="好時有影台北專業妝髮造型服務"
              className="w-full h-[320px] sm:h-[400px] md:h-[480px] object-cover object-center"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 1024px) 100vw, 50vw"
              width={1200}
              height={800}
            />
          </div>

          {/* 文字 */}
          <div>
            <div className="mb-6">
              <p className="text-sm text-brand-textLight leading-relaxed mb-4">
                攝影棚燈光與日常環境不同，鏡頭也會放大膚況與細節。我們的妝髮團隊熟悉棚燈特性，能針對鏡頭與修圖需求調整妝感，讓畫面自然、乾淨、耐看。
              </p>
              <p className="text-sm text-brand-textLight leading-relaxed mb-4">
                從女生基礎妝到男生精緻妝髮，我們提供完整方案選擇。無論是形象照、畢業照、情侶寫真，都能為你量身打造最適合的妝髮風格。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <Link
                to="/hair-makeup"
                className="btn-primary whitespace-nowrap"
              >
                了解妝髮方案
              </Link>
              <span className="text-xs text-brand-textMuted">
                方案價格 NT$ 600 起
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}