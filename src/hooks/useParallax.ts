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

    const applyOffset = () => {
      ticking = false;
      const el = ref.current;
      if (!el) return;
      const y = Math.round(window.scrollY * rate);
      /* translate3d 促進合成層，減少與主執行緒版面計算的牽連 */
      el.style.transform = `translate3d(0, ${y}px, 0)`;
    };

    const handleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(applyOffset);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    applyOffset();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [rate]);

  return ref;
}