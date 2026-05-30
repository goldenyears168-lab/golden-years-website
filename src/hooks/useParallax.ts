import { useEffect, useRef } from "react";

export function useParallax(rate = 0.25): React.RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    let rafId = 0;
    let ticking = false;
    let isVisible = true;

    const applyOffset = () => {
      ticking = false;
      if (!isVisible) return;
      const el = ref.current;
      if (!el) return;
      const y = Math.round(window.scrollY * rate);
      /* translate3d 促進合成層，減少與主執行緒版面計算的牽連 */
      el.style.transform = `translate3d(0, ${y}px, 0)`;
    };

    const handleScroll = () => {
      if (!ticking && isVisible) {
        rafId = requestAnimationFrame(applyOffset);
        ticking = true;
      }
    };

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          applyOffset();
          window.addEventListener("scroll", handleScroll, { passive: true });
        } else {
          window.removeEventListener("scroll", handleScroll);
          cancelAnimationFrame(rafId);
          ticking = false;
        }
      },
      { threshold: 0 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [rate]);

  return ref;
}