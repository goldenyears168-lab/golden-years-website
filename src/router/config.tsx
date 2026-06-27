import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { PageSkeleton } from "@/components/base/Skeleton";
import Home from "@/pages/home/page";

// ── lazy-loaded page components ──
const About = lazy(() => import("@/pages/about/page"));
const Pricing = lazy(() => import("@/pages/pricing/page"));
const PhotographyServices = lazy(() => import("@/pages/photography/page"));
const MakeupServices = lazy(() => import("@/pages/hair-makeup/page"));
const Blog = lazy(() => import("@/pages/blog/page"));
const Courses = lazy(() => import("@/pages/courses/page"));
const PhotoCrop = lazy(() => import("@/pages/photo-crop/page"));
const Booking = lazy(() => import("@/pages/booking/page"));
const BookingThankYou = lazy(() => import("@/pages/booking/thank-you/page"));
const BookingCancel = lazy(() => import("@/pages/booking/cancel/page"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <Suspense fallback={null}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "/about",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <About />
      </Suspense>
    ),
  },
  {
    path: "/price-list",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <Pricing />
      </Suspense>
    ),
  },
  {
    path: "/photography",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <PhotographyServices />
      </Suspense>
    ),
  },
  {
    path: "/hair-makeup",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <MakeupServices />
      </Suspense>
    ),
  },
  {
    path: "/courses",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <Courses />
      </Suspense>
    ),
  },
  {
    path: "/crop-tool",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <PhotoCrop />
      </Suspense>
    ),
  },
  {
    path: "/blog",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <Blog />
      </Suspense>
    ),
  },
  {
    path: "/booking",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <Booking />
      </Suspense>
    ),
  },
  {
    path: "/booking/thank-you",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <BookingThankYou />
      </Suspense>
    ),
  },
  {
    path: "/booking/cancel/:token",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <BookingCancel />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <NotFound />
      </Suspense>
    ),
  },
];

export default routes;