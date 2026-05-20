import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function CoursesCTA() {
  const [headerRef, headerVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <section className="section-padding bg-white">
      <div className="container-brand text-center">
        <div
          ref={headerRef}
          className={`sr-fade-up ${headerVisible ? "sr-visible" : ""}`}
        >
          <p className="text-brand-gold text-sm tracking-[0.15em] uppercase mb-3 font-medium">
            課程活動
          </p>
          <h2 className="text-display text-2xl md:text-3xl lg:text-4xl font-medium mb-4">
            不只是按下快門，而是用鏡頭封存故事與祝福
          </h2>
          <p className="text-brand-textLight text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-8 md:mb-10">
            從一日攝影師挑戰到專業攝影班、彩妝課程與形象管理，我們用教育傳遞「看見人」的能力。歡迎企業團隊、社團活動與個人進修一起來玩。
          </p>
          <a
            href="https://events.goldentimeguide.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            前往課程活動官網
            <i className="ri-arrow-right-line" />
          </a>
          <p className="text-xs text-brand-textMuted mt-4">
            企業包班、社團合作歡迎
            <a
              href="https://line.me/R/ti/p/@614cnqns"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-gold hover:underline mx-1"
            >
              LINE 諮詢
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}