import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", label: "首頁" },
  { path: "/about", label: "關於好時" },
  { path: "/price-list", label: "價目表" },
  { path: "/photography", label: "攝影服務" },
  { path: "/hair-makeup", label: "妝髮服務" },
  { path: "/courses", label: "課程活動" },
  { path: "/blog", label: "好時誌" },
  { path: "/booking", label: "線上預約" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 60);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const headerBgClass = scrolled
    ? "bg-brand-navy shadow-lg"
    : "bg-transparent";

  const textColorClass = "text-white/90 hover:text-white";

  const logoTextClass = "text-white";

  const mobileIconClass = "text-white";

  const textShadowClass = scrolled
    ? ""
    : "[text-shadow:_0_1px_3px_rgba(0,0,0,0.5)]";

  const navLinkBase = "text-xs xl:text-sm font-medium tracking-wide whitespace-nowrap transition-colors duration-300";

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    if (path === "/photography") return location.pathname.startsWith("/photography");
    return location.pathname === path;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBgClass}`}
      >
        <div className="container-brand">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img
                src="https://storage.readdy-site.link/project_files/837246a8-cef0-4cee-9ec0-8c040e316fc2/de8fcc45-8ee7-4674-8d6b-186e029f15ce_logo.jpg?v=93ac2161747426618b1e90281be62c65"
                alt="好時有影 Golden Years Studio"
                className="h-9 md:h-10 w-auto object-contain"
                fetchPriority="high"
                decoding="async"
                width="160"
                height="40"
              />
              {location.pathname === "/" ? (
                <h1 className={`text-sm md:text-base font-serif font-medium tracking-wide hidden sm:block transition-colors duration-300 m-0 p-0 leading-normal ${logoTextClass} ${textShadowClass}`}>
                  好時有影 Golden Years Studio
                </h1>
              ) : (
                <span className={`text-sm md:text-base font-serif font-medium tracking-wide hidden sm:block transition-colors duration-300 ${logoTextClass} ${textShadowClass}`}>
                  好時有影 Golden Years Studio
                </span>
              )}
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
              {navItems.map((item) => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`${navLinkBase} ${isActive(item.path) ? "text-brand-gold" : textColorClass} ${textShadowClass}`}
                >
                    {item.label}
                </Link>
            ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="選單"
            >
              <i
                className={`${mobileOpen ? "ri-close-line" : "ri-menu-line"} text-xl transition-colors duration-300 ${mobileIconClass} ${textShadowClass}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed top-0 right-0 bottom-0 z-50 w-[280px] max-w-[85vw] bg-brand-navy shadow-2xl transform transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <span className="text-sm font-serif font-medium text-white tracking-wide">選單</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              aria-label="關閉選單"
            >
              <i className="ri-close-line text-xl" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto px-5 py-3">
            <nav className="space-y-0">
              {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`block py-3 text-[15px] font-medium tracking-wide border-b border-white/5 ${
                      isActive(item.path) ? "text-brand-gold" : "text-white/90"
                    }`}
                  >
                    {item.label}
                  </Link>
              ))}
            </nav>
          </div>

          {/* Drawer Footer */}
          <div className="px-5 py-4 border-t border-white/10">
            <p className="text-[11px] text-white/50 text-center">
              Golden Years Studio · 好時有影
            </p>
          </div>
        </div>
      </div>
    </>
  );
}