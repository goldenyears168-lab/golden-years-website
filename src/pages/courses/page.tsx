import { Link } from 'react-router-dom';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';
import FloatingButtons from '@/components/feature/FloatingButtons';
import PageSEO from '@/components/base/PageSEO';
import ParallaxHero from '@/components/base/ParallaxHero';
import { courseData } from '@/mocks/courses';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { courses as coursesImg } from '@/config/images';
import ChallengeCourseSection from './components/ChallengeCourseSection';
import {
  colorSeasonData,
  photographyProData,
  makeupProData,
  imageManagementData,
  bookClubData,
} from '@/mocks/course-templates';

export default function Courses() {
  const allCourses = [
    colorSeasonData,
    photographyProData,
    makeupProData,
    imageManagementData,
    bookClubData,
  ];

  return (
    <>
      <PageSEO
        title="課程活動 | 好時有影 Golden Years | 一日攝影師、彩妝班、形象管理"
        description="好時有影攝影課程與工作坊：一日攝影師體驗、四季色彩診斷、攝影專業班、彩妝專業班、形象管理課程。不只是傳遞技術，而是傳遞「看見人」的能力。台北公館報名中。"
      />
      <Header />
      <main>
        <HeroSection />
        <QuoteSection />
        <CourseNav />
        <ChallengeCourseSection />
        <ComingSoonSection courses={allCourses} />
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
      heightClass="h-[420px] md:h-[500px]"
      image={coursesImg.hero}
      imageAlt="好時有影台北攝影課程工作坊"
      imageOpacity={0.40}
      overlayClassName="bg-gradient-to-b from-brand-navy/60 via-brand-navy/40 to-brand-navy/60"
      parallaxRate={0.20}
      revealVisible={visible}
      sectionRef={ref}
    >
      <div className="text-center px-4">
        <span className="inline-block font-serif-en text-xs md:text-sm tracking-[0.2em] uppercase text-brand-gold mb-4">
          Courses & Events
        </span>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4">
          好時有影課程活動
        </h1>
        <p className="font-serif text-sm md:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
          不只是傳遞技術，而是傳遞一種「看見人」的能力
        </p>
      </div>
    </ParallaxHero>
  );
}

/* ===================== Quote ===================== */
function QuoteSection() {
  const [ref, visible] = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className={`py-16 md:py-20 bg-white sr-fade-up ${visible ? "sr-visible" : ""}`}>
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <i className="ri-double-quotes-l w-8 h-8 flex items-center justify-center text-brand-gold text-3xl mb-6" />
          <p className="font-serif text-base md:text-lg text-brand-charcoal leading-relaxed mb-6 whitespace-pre-line">
            {courseData.intro.quote}
          </p>
          <p className="text-sm text-brand-muted">
            — {courseData.intro.author}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ===================== Course Nav ===================== */
function CourseNav() {
  const [ref, visible] = useScrollReveal<HTMLDivElement>();

  const navItems = [
    { id: 'challenge-one-day', label: '一日攝影師' },
    { id: 'color-season', label: '四季測色課' },
    { id: 'photography-pro', label: '攝影專業班' },
    { id: 'makeup-pro', label: '彩妝專業班' },
    { id: 'image-management', label: '形象管理班' },
    { id: 'book-club', label: '讀書會' },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section ref={ref} className={`sticky top-16 z-40 bg-brand-cream border-y border-brand-cream py-3 md:py-4 sr-fade-up ${visible ? "sr-visible" : ""}`}>
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center gap-2 md:gap-3 overflow-x-auto hide-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="flex-shrink-0 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium text-brand-textLight hover:text-brand-navy hover:bg-white transition-all cursor-pointer whitespace-nowrap border border-brand-cream hover:border-brand-navy/10"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== Coming Soon ===================== */
function ComingSoonSection({ courses }: { courses: typeof import('@/mocks/course-templates').colorSeasonData[] }) {
  const [ref, visible] = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className={`py-16 md:py-24 bg-brand-cream sr-fade-up ${visible ? "sr-visible" : ""}`}>
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <span className="inline-block font-serif-en text-xs md:text-sm tracking-[0.2em] uppercase text-brand-gold mb-3">
              Coming Soon
            </span>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-brand-navy mb-3">
              更多課程即將推出
            </h2>
            <p className="font-serif text-brand-muted text-sm md:text-base max-w-xl mx-auto">
              我們正在籌備更多精彩課程，敬請期待。歡迎追蹤我們的動態，第一時間獲得開課消息。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {courses.map((course, index) => (
              <div
                key={course.id}
                id={course.id}
                className={`bg-white rounded-lg p-6 md:p-8 border border-brand-creamDark sr-fade-up sr-fast ${visible ? "sr-visible" : ""}`}
                style={{ transitionDelay: visible ? `${index * 100}ms` : "0ms" }}
              >
                <span className="inline-block font-serif-en text-xs tracking-[0.15em] uppercase text-brand-gold mb-2">
                  {course.enTitle}
                </span>
                <h3 className="font-serif text-lg md:text-xl font-semibold text-brand-navy mb-2">
                  {course.title}
                </h3>
                <p className="font-serif text-sm text-brand-muted mb-4">
                  {course.subtitle}
                </p>
                <p className="text-sm text-brand-textLight line-clamp-3 mb-5">
                  {course.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-brand-textMuted border-t border-brand-creamDark pt-4">
                  <span className="flex items-center gap-1">
                    <i className="ri-user-line w-3 h-3 flex items-center justify-center" />
                    {course.info.people}
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="ri-time-line w-3 h-3 flex items-center justify-center" />
                    {course.info.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== CTA ===================== */
function CTASection() {
  const [ref, visible] = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className={`py-16 md:py-20 bg-brand-navy sr-fade-up ${visible ? "sr-visible" : ""}`}>
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white mb-4">
            準備好開始你的學習旅程了嗎？
          </h2>
          <p className="font-serif text-sm md:text-base text-white/70 mb-8 max-w-lg mx-auto">
            無論是拿起相機、認識色彩，還是探索個人品牌，我們都有適合你的課程。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 px-8 py-3 bg-brand-gold text-brand-navy rounded-md font-serif text-sm hover:bg-white transition-colors whitespace-nowrap"
            >
              <i className="ri-calendar-line w-4 h-4 flex items-center justify-center" />
              線上預約
            </Link>
            <Link
              to="/price-list"
              className="inline-flex items-center gap-2 px-8 py-3 border border-white/30 text-white rounded-md font-serif text-sm hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              <i className="ri-price-tag-3-line w-4 h-4 flex items-center justify-center" />
              查看方案
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}