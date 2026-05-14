import { useCallback } from "react";

export function useSmoothScroll() {
  const scrollTo = useCallback((target: string | HTMLElement | number) => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let top: number;

    if (typeof target === "string") {
      const el = document.getElementById(target);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      top = rect.top + window.scrollY;
    } else if (typeof target === "number") {
      top = target;
    } else {
      const rect = target.getBoundingClientRect();
      top = rect.top + window.scrollY;
    }

    window.scrollTo({
      top,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  }, []);

  const scrollToTop = useCallback(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  }, []);

  return { scrollTo, scrollToTop };
}