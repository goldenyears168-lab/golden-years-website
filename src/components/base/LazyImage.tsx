import { useState, type ImgHTMLAttributes } from "react";
import { FALLBACK_IMAGE } from "@/mocks/constants";

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  skeletonClassName?: string;
  decoding?: "async" | "sync" | "auto";
  fetchPriority?: "high" | "low" | "auto";
  srcSet?: string;
  sizes?: string;
}

export default function LazyImage({
  className = "",
  skeletonClassName = "",
  src,
  alt,
  loading = "lazy",
  decoding = "async",
  fetchPriority = "auto",
  srcSet,
  sizes,
  ...props
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
    setError(false);
  };

  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  return (
    <div className="relative overflow-hidden" aria-label={alt}>
      {!loaded && (
        <div
          className={`absolute inset-0 animate-pulse bg-brand-creamDark ${skeletonClassName}`}
        />
      )}
      <img
        src={
          error
            ? FALLBACK_IMAGE
            : src
        }
        alt={alt}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        srcSet={srcSet}
        sizes={sizes}
        className={`${className} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
}