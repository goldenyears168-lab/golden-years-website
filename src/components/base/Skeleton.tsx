import { type ReactNode, useState, useEffect } from "react";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  animate?: boolean;
  children?: ReactNode;
}

export function Skeleton({
  className = "",
  width,
  height,
  circle = false,
  animate = true,
  children,
}: SkeletonProps) {
  const base = "bg-brand-creamDark";
  const motion = animate ? "animate-pulse" : "";
  const shape = circle ? "rounded-full" : "rounded-md";

  const style: React.CSSProperties = {};
  if (width !== undefined) style.width = width;
  if (height !== undefined) style.height = height;

  return (
    <div
      className={`${base} ${motion} ${shape} ${className}`}
      style={style}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

/** Page-level skeleton layout used inside Suspense fallback */
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header placeholder */}
      <div className="h-16 bg-white/80 border-b border-brand-cream flex items-center justify-between px-4 md:px-6">
        <Skeleton width={160} height={24} className="rounded-sm" />
        <div className="hidden md:flex items-center gap-3">
          <Skeleton width={64} height={16} />
          <Skeleton width={64} height={16} />
          <Skeleton width={64} height={16} />
        </div>
      </div>

      {/* Hero placeholder */}
      <div className="h-[60vh] md:h-[480px] bg-brand-navy/10 flex items-center justify-center">
        <div className="text-center space-y-4 px-4">
          <Skeleton width={120} height={14} className="mx-auto rounded-full" />
          <Skeleton width="80%" height={40} className="mx-auto max-w-lg rounded-sm" />
          <Skeleton width="60%" height={20} className="mx-auto max-w-md rounded-sm" />
          <div className="flex items-center justify-center gap-3 pt-2">
            <Skeleton width={120} height={40} circle className="rounded-md" />
            <Skeleton width={120} height={40} circle className="rounded-md" />
          </div>
        </div>
      </div>

      {/* Content placeholder */}
      <div className="py-16 md:py-24 bg-brand-cream">
        <div className="container-brand">
          <div className="text-center mb-10 md:mb-14 space-y-3">
            <Skeleton width={80} height={14} className="mx-auto rounded-full" />
            <Skeleton width="50%" height={32} className="mx-auto max-w-md rounded-sm" />
            <Skeleton width="70%" height={18} className="mx-auto max-w-xl rounded-sm" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-brand-creamDark overflow-hidden">
                <Skeleton height={180} className="rounded-none" />
                <div className="p-4 space-y-2">
                  <Skeleton width="70%" height={18} />
                  <Skeleton width="40%" height={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}