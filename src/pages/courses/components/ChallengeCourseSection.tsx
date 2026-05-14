import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseData } from '@/mocks/courses';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { handleImgError } from "@/mocks/constants";

function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: { url: string; alt: string }[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        aria-label="上一張"
      >
        <i className="ri-arrow-left-s-line text-2xl md:text-3xl" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        aria-label="下一張"
      >
        <i className="ri-arrow-right-s-line text-2xl md:text-3xl" />
      </button>
      <button
        onClick={onClose}
        className="absolute top-3 md:top-6 right-3 md:right-6 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        aria-label="關閉"
      >
        <i className="ri-close-line text-2xl" />
      </button>
      <div className="max-w-[90vw] max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[index].url}
          alt={images[index].alt}
          className="max-w-[90vw] max-h-[85vh] object-contain rounded-md"
          onError={handleImgError}
          width={1200}
          height={800}
        />
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}

export default function ChallengeCourseSection() {
  const { challengePhotographer } = courseData;
  const [mainImage, setMainImage] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const [ref, visible] = useScrollReveal<HTMLDivElement>();
  const [galleryRef, galleryVisible] = useScrollReveal<HTMLDivElement>();
  const [philosophyRef, philosophyVisible] = useScrollReveal<HTMLDivElement>();
  const [testimonialRef, testimonialVisible] = useScrollReveal<HTMLDivElement>();
  const [ctaRef, ctaVisible] = useScrollReveal<HTMLDivElement>();

  const handlePrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? challengePhotographer.gallery.length - 1 : lightboxIndex - 1);
    }
  };

  const handleNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === challengePhotographer.gallery.length - 1 ? 0 : lightboxIndex + 1);
    }
  };

  return (
    <section id="challenge-one-day" className="py-16 md:py-24 bg-white">
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div ref={ref} className={`text-center mb-10 md:mb-14 sr-fade-up ${visible ? "sr-visible" : ""}`}>
            <span className="inline-block font-serif-en text-xs md:text-sm tracking-[0.2em] uppercase text-brand-gold mb-3">
              Featured Workshop
            </span>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-brand-navy mb-3">
              {challengePhotographer.title}
            </h2>
            <p className="font-serif text-brand-muted text-sm md:text-base max-w-xl mx-auto">
              {challengePhotographer.subtitle}
            </p>
          </div>

          {/* Info + Experience + Audience */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16 sr-fade-up ${visible ? "sr-visible" : ""}`}>
            <div className="bg-brand-cream rounded-lg p-6 md:p-8">
              <h4 className="font-serif text-base md:text-lg font-semibold text-brand-navy mb-4 flex items-center gap-2">
                <i className="ri-information-line w-5 h-5 flex items-center justify-center text-brand-gold" />
                活動資訊
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm">
                  <i className="ri-user-line w-4 h-4 flex items-center justify-center text-brand-gold" />
                  <span className="text-brand-charcoal">適合人數：{challengePhotographer.info.people}</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <i className="ri-time-line w-4 h-4 flex items-center justify-center text-brand-gold" />
                  <span className="text-brand-charcoal">體驗時間：{challengePhotographer.info.time}</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <i className="ri-money-cny-circle-line w-4 h-4 flex items-center justify-center text-brand-gold" />
                  <span className="text-brand-charcoal">收費價格：每人 {challengePhotographer.info.price}</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <i className="ri-image-line w-4 h-4 flex items-center justify-center text-brand-gold" />
                  <span className="text-brand-charcoal">成品：{challengePhotographer.info.deliverable}</span>
                </li>
              </ul>
            </div>

            <div className="bg-brand-cream rounded-lg p-6 md:p-8">
              <h4 className="font-serif text-base md:text-lg font-semibold text-brand-navy mb-4 flex items-center gap-2">
                <i className="ri-camera-line w-5 h-5 flex items-center justify-center text-brand-gold" />
                體驗內容
              </h4>
              <ul className="space-y-3">
                {challengePhotographer.experience.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <i className="ri-checkbox-circle-line w-4 h-4 flex items-center justify-center text-brand-gold mt-0.5" />
                    <span className="text-brand-charcoal">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-brand-cream rounded-lg p-6 md:p-8">
              <h4 className="font-serif text-base md:text-lg font-semibold text-brand-navy mb-4 flex items-center gap-2">
                <i className="ri-heart-line w-5 h-5 flex items-center justify-center text-brand-gold" />
                適合對象
              </h4>
              <ul className="space-y-3">
                {challengePhotographer.audience.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <i className="ri-user-smile-line w-4 h-4 flex items-center justify-center text-brand-gold mt-0.5" />
                    <span className="text-brand-charcoal">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Gallery */}
          <div ref={galleryRef} className={`mb-12 md:mb-16 sr-fade-up ${galleryVisible ? "sr-visible" : ""}`}>
            <div className="rounded-lg overflow-hidden mb-4 cursor-pointer"
              onClick={() => setLightboxIndex(mainImage)}
            >
              <img
                src={challengePhotographer.gallery[mainImage].url}
                alt={`好時有影一日攝影師課程${challengePhotographer.gallery[mainImage].alt}`}
                className="w-full h-auto max-h-[600px] object-cover"
                loading="eager"
                decoding="async"
                onError={handleImgError}
                width={900}
                height={600}
              />
            </div>
            <div className="grid grid-cols-4 gap-2 md:gap-3">
              {challengePhotographer.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(idx)}
                  className={`rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                    mainImage === idx ? 'ring-2 ring-brand-navy' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`好時有影一日攝影師課程${img.alt}`}
                    className="w-full h-20 md:h-24 object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={handleImgError}
                    width={160}
                    height={96}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Philosophy */}
          <div ref={philosophyRef} className={`bg-brand-navy rounded-lg p-8 md:p-12 mb-12 md:mb-16 text-center sr-scale-up ${philosophyVisible ? "sr-visible" : ""}`}>
            <h3 className="font-serif text-xl md:text-2xl font-semibold text-brand-gold mb-4">
              {challengePhotographer.philosophy.title}
            </h3>
            <p className="font-serif text-sm md:text-base text-white/90 max-w-2xl mx-auto leading-relaxed">
              {challengePhotographer.philosophy.text}
            </p>
          </div>

          {/* Testimonials */}
          <div ref={testimonialRef} className={`mb-12 md:mb-16 sr-fade-up ${testimonialVisible ? "sr-visible" : ""}`}>
            <h3 className="font-serif text-xl md:text-2xl font-semibold text-brand-navy text-center mb-8">
              學員回饋
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {challengePhotographer.testimonials.map((t, idx) => (
                <div key={idx} className="bg-brand-cream rounded-lg p-6 md:p-8">
                  <i className="ri-double-quotes-l w-6 h-6 flex items-center justify-center text-brand-gold text-2xl mb-4" />
                  <p className="font-serif text-sm text-brand-charcoal leading-relaxed mb-4">
                    {t.quote}
                  </p>
                  <p className="text-xs text-brand-muted">{t.author}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div ref={ctaRef} className={`text-center sr-fade-up ${ctaVisible ? "sr-visible" : ""}`}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate("/booking")}
                className="inline-flex items-center gap-2 px-8 py-3 bg-brand-navy text-white rounded-md font-serif text-sm hover:bg-brand-charcoal transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-calendar-line w-4 h-4 flex items-center justify-center" />
                立即預約體驗
              </button>
              <Link
                to="/booking"
                className="text-brand-textMuted text-sm hover:text-brand-navy underline underline-offset-4 transition-colors whitespace-nowrap"
              >
                或查看其他課程
              </Link>
            </div>
            <p className="text-xs text-brand-muted mt-4">
              或追蹤我們的
              <a href={challengePhotographer.igLink} target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline">
                Instagram
              </a>
              獲取最新活動資訊
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={challengePhotographer.gallery}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </section>
  );
}