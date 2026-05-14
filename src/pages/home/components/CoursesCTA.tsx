import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { courseData } from "@/mocks/courses";
import LazyImage from "@/components/base/LazyImage";

export default function CoursesCTA() {
  const [headerRef, headerVisible] = useScrollReveal<HTMLDivElement>();
  const [gridRef, gridVisible] = useScrollReveal<HTMLDivElement>();
  const [ctaRef, ctaVisible] = useScrollReveal<HTMLDivElement>();

  const previewCourses = courseData.allCourses.slice(0, 3);

  return (
    <section className="section-padding bg-white">
      <div className="container-brand">
        <div
          ref={headerRef}
          className={`text-center mb-12 md:mb-16 sr-fade-up ${headerVisible ? "sr-visible" : ""}`}
        >
          <p className="text-brand-gold text-sm tracking-[0.15em] uppercase mb-3 font-medium">
            課程活動
          </p>
          <h2 className="text-display text-2xl md:text-3xl lg:text-4xl font-medium mb-4">
            不只是按下快門，而是用鏡頭封存故事與祝福
          </h2>
          <p className="text-brand-textLight text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            從一日攝影師挑戰到專業攝影班、彩妝課程與形象管理，我們用教育傳遞「看見人」的能力。歡迎企業團隊、社團活動與個人進修一起來玩。
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-10 md:mb-14"
        >
          {previewCourses.map((course, index) => (
            <div
              key={course.id}
              className={`card-base sr-fade-up sr-fast ${gridVisible ? "sr-visible" : ""}`}
              style={{ transitionDelay: gridVisible ? `${index * 120}ms` : "0ms" }}
            >
              <div className="relative overflow-hidden aspect-square">
                <LazyImage
                  src={course.image}
                  alt={`好時有影台北${course.title}`}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                  decoding="async"
                  width={600}
                  height={600}
                />
                {course.featured && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-brand-navy text-white text-xs font-medium rounded-md">
                    熱門推薦
                  </span>
                )}
              </div>
              <div className="p-5 md:p-6">
                <span className="inline-block font-serif-en text-xs tracking-[0.15em] uppercase text-brand-gold mb-2">
                  {course.subtitle}
                </span>
                <h3 className="text-base font-serif font-medium mb-2 leading-snug">
                  {course.title}
                </h3>
                <p className="text-sm text-brand-textLight line-clamp-2 mb-4">
                  {course.description}
                </p>
                <Link
                  to={`/courses#${course.id}`}
                  className="inline-flex items-center gap-1 text-sm text-brand-navy font-medium hover:text-brand-gold transition-colors whitespace-nowrap"
                >
                  了解詳情
                  <i className="ri-arrow-right-line" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div
          ref={ctaRef}
          className={`text-center sr-fade-up sr-delay-2 ${ctaVisible ? "sr-visible" : ""}`}
        >
          <Link
            to="/courses"
            className="btn-primary inline-flex items-center gap-2"
          >
            探索全部課程
            <i className="ri-arrow-right-line" />
          </Link>
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