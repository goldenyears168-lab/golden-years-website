import { useState, type ImgHTMLAttributes } from "react";
import { FALLBACK_IMAGE } from "@/mocks/constants";
import { buildSrcSet, getSizes, buildPictureSources } from "@/utils/image";

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  skeletonClassName?: string;
  decoding?: "async" | "sync" | "auto";
  fetchPriority?: "high" | "low" | "auto";
  srcSet?: string;
  sizes?: string;
  autoSrcSet?: boolean;
  containerClassName?: string;
  /** Explicitly enable/disable <picture> with WebP/AVIF sources.
   *  When omitted, auto-enabled for .jpg/.png URLs. */
  formats?: ("webp" | "avif")[] | null;
  /** Sizes pattern when using autoSrcSet or formats */
  sizesPattern?: "card-sm" | "card-md" | "card-lg" | "gallery" | "hero" | "full";
}

export default function LazyImage({
  className = "",
  skeletonClassName = "",
  src,
  alt,
  loading = "lazy",
  decoding = "async",
  fetchPriority = "auto",
  srcSet: propSrcSet,
  sizes: propSizes,
  autoSrcSet = false,
  containerClassName = "",
  formats,
  sizesPattern = "card-md",
  width,
  height,
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

  // Auto-generate srcSet when autoSrcSet is true and no explicit srcSet provided
  const effectiveSrcSet = propSrcSet ?? (autoSrcSet && typeof src === "string" ? buildSrcSet(src) : undefined);
  const effectiveSizes = propSizes ?? (autoSrcSet && effectiveSrcSet ? getSizes(sizesPattern) : undefined);

  // Auto-enable next-gen formats for photo URLs unless explicitly disabled (null)
  const shouldUseFormats = formats !== null && (
    formats !== undefined
      ? formats.length > 0
      : typeof src === "string" && /\.(jpe?g|png)$/i.test(src) && !src.startsWith("data:")
  );

  const pictureSources = shouldUseFormats && typeof src === "string"
    ? buildPictureSources(src, [400, 800, 1200])
    : undefined;

  const mergedOnError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    handleError();
    props.onError?.(e);
  };

  const imgNode = (
    <img
      src={error ? FALLBACK_IMAGE : src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      srcSet={effectiveSrcSet}
      sizes={effectiveSizes}
      className={`${className} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
      onLoad={handleLoad}
      onError={mergedOnError}
      width={width}
      height={height}
      {...props}
    />
  );

  return (
    <div
      className={`relative overflow-hidden ${containerClassName}`}
      aria-label={alt}
      style={width && height ? { aspectRatio: `${Number(width)} / ${Number(height)}` } : undefined}
    >
      {!loaded && (
        <div className={`absolute inset-0 animate-pulse bg-brand-creamDark ${skeletonClassName}`} />
      )}
      {pictureSources ? (
        <picture>
          {pictureSources.map((s) => (
            <source key={s.type} srcSet={s.srcSet} type={s.type} />
          ))}
          {imgNode}
        </picture>
      ) : (
        imgNode
      )}
    </div>
  );
}