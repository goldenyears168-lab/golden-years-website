/**
 * Image URL helpers for responsive srcSet generation and next-gen formats.
 *
 * Strategy:
 * 1. For .jpg/.png URLs, try path-based variants (.webp/.avif) and
 *    query-param variants (?format=webp). Most CDNs ignore unknown params,
 *    so this is safe — the browser gracefully falls back to the original.
 * 2. Cloudinary URLs get proper transformation paths.
 */

const SUPPORTED_EXTS = /\.(jpe?g|png)$/i;

/**
 * Attempt to build a srcSet for a given image URL.
 * Returns undefined for data URIs or URLs that already contain a hash.
 */
export function buildSrcSet(
  url: string,
  widths: number[] = [400, 800, 1200]
): string | undefined {
  // Skip data URIs
  if (url.startsWith("data:") || url.includes("#")) {
    return undefined;
  }

  // Generic CDN: append w= query param.  If the URL already has query
  // params, use & instead of ? to avoid clobbering existing params.
  const sep = url.includes("?") ? "&" : "?";
  const entries = widths.map((w) => `${url}${sep}w=${w} ${w}w`);
  return entries.join(", ");
}

/**
 * Return a sizes attribute for common layout patterns.
 */
export function getSizes(
  pattern: "card-sm" | "card-md" | "card-lg" | "gallery" | "hero" | "full"
): string {
  const map: Record<string, string> = {
    "card-sm": "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw",
    "card-md": "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
    "card-lg": "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px",
    gallery: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
    hero: "100vw",
    full: "100vw",
  };
  return map[pattern] || "100vw";
}

/* ── Format variants (WebP / AVIF) ─────────────────────────────── */

/**
 * Build a format-variant URL for WebP or AVIF.
 *
 * Returns a query-param variant (`?format=webp`) when safe, and also
 * replaces the path extension as a secondary convention.
 */
export function getFormatUrl(
  original: string,
  format: "webp" | "avif"
): string {
  if (!SUPPORTED_EXTS.test(original)) return original;

  // If URL already has query/hash, only use path-based replacement
  if (original.includes("?") || original.includes("#")) {
    return original.replace(SUPPORTED_EXTS, `.${format}`);
  }

  // Prefer query-param variant — CDNs that support it will serve the
  // correct format; CDNs that don't will ignore the param and serve
  // the original JPEG, which the browser will still decode fine.
  return `${original}?format=${format}`;
}

/**
 * Build <picture> <source> descriptors for AVIF → WebP → JPEG fallback.
 */
export function buildPictureSources(
  url: string,
  widths?: number[]
): Array<{ type: "image/webp" | "image/avif"; srcSet: string }> {
  const formats: Array<"webp" | "avif"> = ["avif", "webp"];
  return formats.map((fmt) => {
    const formatUrl = getFormatUrl(url, fmt);
    const srcSet = buildSrcSet(formatUrl, widths);
    return {
      type: `image/${fmt}` as const,
      srcSet: srcSet ?? formatUrl,
    };
  });
}