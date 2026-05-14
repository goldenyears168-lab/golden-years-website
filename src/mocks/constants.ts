/** Fallback image shown when a photo fails to load */
export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&q=80";

/** Error handler for native <img> elements */
export function handleImgError(
  e: React.SyntheticEvent<HTMLImageElement>,
): void {
  const target = e.currentTarget;
  if (target.src !== FALLBACK_IMAGE) {
    target.src = FALLBACK_IMAGE;
  }
}