import { useEffect, useRef } from "react";
import { getFormatUrl } from "@/utils/image";

interface LightboxImage {
  url: string;
  alt: string;
}

interface LightboxProps {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const callbacksRef = useRef({ onClose, onPrev, onNext });
  callbacksRef.current = { onClose, onPrev, onNext };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const { onClose: close, onPrev: prev, onNext: next } = callbacksRef.current;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, []);

  const currentImage = images[index];

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="圖片預覽"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        aria-label="上一張"
      >
        <i className="ri-arrow-left-s-line text-2xl md:text-3xl" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
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
      <div
        className="max-w-[90vw] max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <picture>
          <source srcSet={getFormatUrl(currentImage.url, "avif")} type="image/avif" />
          <source srcSet={getFormatUrl(currentImage.url, "webp")} type="image/webp" />
          <img
            src={currentImage.url}
            alt={currentImage.alt}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-md"
          />
        </picture>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}