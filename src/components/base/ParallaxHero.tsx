import { useParallax } from "@/hooks/useParallax";
import { handleImgError } from "@/mocks/constants";

interface ParallaxHeroProps {
  heightClass?: string;
  image: string;
  imageAlt: string;
  imageOpacity?: number;
  overlayClassName?: string;
  parallaxRate?: number;
  revealVisible?: boolean;
  revealClassName?: string;
  sectionRef?: React.RefObject<HTMLElement | null>;
  fetchPriority?: "high" | "low" | "auto";
  children: React.ReactNode;
}

export default function ParallaxHero({
  heightClass = "h-[380px] md:h-[480px]",
  image,
  imageAlt,
  imageOpacity = 0.30,
  overlayClassName = "bg-gradient-to-b from-brand-navy/70 via-brand-navy/50 to-brand-navy/70",
  parallaxRate = 0.25,
  revealVisible = false,
  revealClassName = "sr-fade-up",
  sectionRef,
  fetchPriority = "high",
  children,
}: ParallaxHeroProps) {
  const parallaxRef = useParallax(parallaxRate);

  return (
    <section
      ref={sectionRef}
      className={`relative ${heightClass} flex items-center justify-center overflow-hidden bg-brand-navy ${revealClassName} ${revealVisible ? "sr-visible" : ""}`}
    >
      {/* Parallax Background */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 will-change-transform"
        aria-hidden="true"
      >
        <img
          src={image}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: imageOpacity }}
          loading="eager"
          decoding="async"
          fetchPriority={fetchPriority}
          width={1920}
          height={1080}
          onError={handleImgError}
        />
      </div>

      {/* Fixed Overlay */}
      <div className={`absolute inset-0 ${overlayClassName} z-[1]`} />

      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </section>
  );
}