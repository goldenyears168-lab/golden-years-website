import { ctaData } from "@/mocks/home";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function CtaSection() {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-20 md:py-28 bg-brand-navy text-white text-center">
      <div
        ref={ref}
        className={`container-brand max-w-3xl sr-fade-up sr-slow ${isVisible ? "sr-visible" : ""}`}
      >
        <h2 className="text-display text-2xl md:text-3xl lg:text-4xl font-medium mb-6 md:mb-8">
          {ctaData.title}
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          {ctaData.buttons.map((btn) =>
            btn.external ? (
              <a
                key={btn.label}
                href={btn.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full sm:w-auto ${
                  btn.variant === "primary"
                    ? "btn-primary bg-white text-brand-navy hover:bg-brand-cream"
                    : "btn-outline border-white text-white hover:bg-white hover:text-brand-navy"
                }`}
              >
                {btn.label}
              </a>
            ) : (
              <Link
                key={btn.label}
                to={btn.href}
                className={`w-full sm:w-auto ${
                  btn.variant === "primary"
                    ? "btn-primary bg-white text-brand-navy hover:bg-brand-cream"
                    : "btn-outline border-white text-white hover:bg-white hover:text-brand-navy"
                }`}
              >
                {btn.label}
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  );
}