import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";

// ── lazy-loaded page components ──
const Home = lazy(() => import("@/pages/home/page"));
const About = lazy(() => import("@/pages/about/page"));
const Pricing = lazy(() => import("@/pages/pricing/page"));
const PhotographyServices = lazy(() => import("@/pages/photography/page"));
const MakeupServices = lazy(() => import("@/pages/hair-makeup/page"));
const Blog = lazy(() => import("@/pages/blog/page"));
const Booking = lazy(() => import("@/pages/booking/page"));
const PhotoCrop = lazy(() => import("@/pages/photo-crop/page"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream">
      <div className="flex items-center gap-2 text-brand-textLight">
        <div className="w-2 h-2 rounded-full bg-brand-navy animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 rounded-full bg-brand-navy animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 rounded-full bg-brand-navy animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <Suspense fallback={<PageFallback />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "/about",
    element: (
      <Suspense fallback={<PageFallback />}>
        <About />
      </Suspense>
    ),
  },
  {
    path: "/price-list",
    element: (
      <Suspense fallback={<PageFallback />}>
        <Pricing />
      </Suspense>
    ),
  },
  {
    path: "/photography",
    element: (
      <Suspense fallback={<PageFallback />}>
        <PhotographyServices />
      </Suspense>
    ),
  },
  {
    path: "/hair-makeup",
    element: (
      <Suspense fallback={<PageFallback />}>
        <MakeupServices />
      </Suspense>
    ),
  },
  {
    path: "/crop-tool",
    element: (
      <Suspense fallback={<PageFallback />}>
        <PhotoCrop />
      </Suspense>
    ),
  },
  {
    path: "/blog",
    element: (
      <Suspense fallback={<PageFallback />}>
        <Blog />
      </Suspense>
    ),
  },
  {
    path: "/booking",
    element: (
      <Suspense fallback={<PageFallback />}>
        <Booking />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<PageFallback />}>
        <NotFound />
      </Suspense>
    ),
  },
];

export default routes;