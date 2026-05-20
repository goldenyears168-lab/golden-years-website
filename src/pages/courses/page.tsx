import { useEffect } from "react";
import Header from "@/components/feature/Header";
import Footer from "@/components/feature/Footer";
import FloatingButtons from "@/components/feature/FloatingButtons";
import PageSEO from "@/components/base/PageSEO";

export default function CoursesPage() {
  useEffect(() => {
    document.title = "課程活動｜好時有影 Golden Years Studio";
  }, []);

  return (
    <>
      <PageSEO
        title="課程活動 | 好時有影 Golden Years Studio 攝影教學與形象管理課程"
        description="好時有影課程活動列表。從一日攝影師挑戰到專業攝影班、彩妝課程與形象管理，企業團隊、社團活動與個人進修歡迎報名。"
      />
      <Header />
      <main className="min-h-screen bg-white">
        {/* Page Header */}
        <section className="bg-brand-navy py-10 md:py-14 pt-24 md:pt-28">
          <div className="container-brand text-center">
            <p className="text-brand-gold text-sm tracking-[0.15em] uppercase mb-2 font-medium">
              課程活動
            </p>
            <h1 className="text-display text-2xl md:text-3xl lg:text-4xl font-medium text-white mb-3">
              好時有影課程活動
            </h1>
          </div>
        </section>

        {/* Embedded Events Calendar */}
        <section className="container-brand py-8 md:py-12">
          <div className="rounded-xl overflow-hidden shadow-sm border border-brand-gold/10 h-[2000px]">
            <iframe
              src="https://events.goldentimeguide.com/embed"
              className="block w-full h-full"
              style={{ border: "none" }}
              loading="lazy"
              title="美好時光課程活動列表"
            />
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="container-brand pb-12 md:pb-16 text-center">
          <p className="text-sm text-brand-textMuted mb-4">
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
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}