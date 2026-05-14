import { useLocation, Link } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();
  
  return (
    <div className="relative flex flex-col items-center justify-center h-screen text-center px-4 bg-brand-cream">
      <h1 className="absolute bottom-0 text-9xl md:text-[12rem] font-black text-brand-creamDark select-none pointer-events-none z-0">
        404
      </h1>
      <div className="relative z-10">
        <i className="ri-error-warning-line w-12 h-12 flex items-center justify-center text-brand-gold text-4xl mb-4" />
        <h1 className="text-xl md:text-2xl font-serif font-semibold text-brand-navy mt-6">找不到這個頁面</h1>
        <p className="mt-2 text-base text-brand-muted font-mono">{location.pathname}</p>
        <p className="mt-4 text-sm md:text-base text-brand-textLight max-w-md mx-auto leading-relaxed">
          您要尋找的頁面可能已被移除、更名或暫時無法使用。
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-brand-navy text-white text-sm font-medium rounded-md hover:bg-brand-navyLight transition-colors"
        >
          <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center" />
          返回首頁
        </Link>
      </div>
    </div>
  );
}