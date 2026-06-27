import { Link } from "react-router-dom";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export default function Footer() {
  const { scrollToTop } = useSmoothScroll();
  return (
    <footer className="bg-brand-cream text-brand-text">
      {/* ─── Layer 1: Brand Signature ─── */}
      <div className="container-brand pt-16 md:pt-24 pb-10 md:pb-14">
        <div className="flex flex-col items-center text-center">
          {/* Logo — original colour, no invert */}
          <Link to="/" className="mb-5">
            <img
              src="https://storage.readdy-site.link/project_files/837246a8-cef0-4cee-9ec0-8c040e316fc2/de8fcc45-8ee7-4674-8d6b-186e029f15ce_logo.jpg?v=93ac2161747426618b1e90281be62c65"
              alt="好時有影"
              className="h-14 md:h-16 w-auto object-contain"
              width="160"
              height="64"
            />
          </Link>

          {/* Brand tagline */}
          <p className="font-serif text-lg md:text-xl text-brand-navy tracking-wide mb-6">
            讓每一個好時，都有你我的身影
          </p>

          {/* Gold divider line */}
          <div className="w-40 md:w-56 border-t border-brand-gold/30 mb-7" />

          {/* Social icons — circle outline */}
          <div className="flex items-center gap-3">
            {[
              {
                href: "https://www.instagram.com/goldenyears_studio/",
                icon: "ri-instagram-line",
                label: "Instagram",
              },
              {
                href: "https://www.facebook.com/welcome2goldenyearstudio",
                icon: "ri-facebook-fill",
                label: "Facebook",
              },
              {
                href: "https://line.me/R/ti/p/@goldenyearsphoto",
                icon: "ri-line-fill",
                label: "LINE",
              },
              {
                href: "mailto:goldenyears166@gmail.com",
                icon: "ri-mail-line",
                label: "Email",
              },
            ].map(({ href, icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-full border border-brand-navy/15 flex items-center justify-center text-brand-navy hover:border-brand-gold hover:text-brand-navy transition-colors duration-300"
              >
                <i className={`${icon} text-base`} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Layer 2: Info Architecture ─── */}
      <div className="container-brand pb-12 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">

          {/* Column 1 — Store info */}
          <div>
            <h3 className="font-serif text-base font-medium text-brand-navy mb-5">
              門市資訊
            </h3>
            <div className="space-y-4">
              {/* Gongguan */}
              <div className="bg-white rounded-lg p-4">
                <p className="font-medium text-sm text-brand-navy mb-3">
                  公館店
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-brand-text">
                    <span className="w-4 h-4 flex items-center justify-center text-brand-gold mt-0.5 shrink-0">
                      <i className="ri-map-pin-line text-xs" />
                    </span>
                    <span className="leading-relaxed">
                      台北市中正區汀州路三段160巷4號6樓
                      <br />
                      <span className="text-brand-textMuted">（近捷運公館站 1號出口）</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-brand-text">
                    <span className="w-4 h-4 flex items-center justify-center text-brand-gold shrink-0">
                      <i className="ri-phone-line text-xs" />
                    </span>
                    <span>02-2936 5460</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-brand-text">
                    <span className="w-4 h-4 flex items-center justify-center text-brand-gold shrink-0">
                      <i className="ri-time-line text-xs" />
                    </span>
                    <span>
                      週一～週日 12:00–19:00
                      <span className="text-brand-navy ml-1">❰不定期公休❱</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Zhongshan */}
              <div className="bg-white rounded-lg p-4">
                <p className="font-medium text-sm text-brand-navy mb-3">
                  中山店
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-brand-text">
                    <span className="w-4 h-4 flex items-center justify-center text-brand-gold mt-0.5 shrink-0">
                      <i className="ri-map-pin-line text-xs" />
                    </span>
                    <span className="leading-relaxed">
                      台北市中山區南京東路一段10號4樓
                      <br />
                      <span className="text-brand-textMuted">（近捷運中山站 2號出口）</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-brand-text">
                    <span className="w-4 h-4 flex items-center justify-center text-brand-gold shrink-0">
                      <i className="ri-phone-line text-xs" />
                    </span>
                    <span>02-2709 2224</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-brand-text">
                    <span className="w-4 h-4 flex items-center justify-center text-brand-gold shrink-0">
                      <i className="ri-time-line text-xs" />
                    </span>
                    <span>
                      週一～週日 12:00–19:00
                      <span className="text-brand-navy ml-1">❰不定期公休❱</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 — Quick links */}
          <div>
            <h3 className="font-serif text-base font-medium text-brand-navy mb-5">
              快速連結
            </h3>
            <div className="space-y-3">
              {[
                { to: "/photography", label: "攝影服務" },
                { to: "/hair-makeup", label: "妝髮服務" },
                { to: "/courses", label: "課程活動" },
                { to: "/price-list", label: "價目表" },
                { to: "/booking", label: "線上預約" },
                { to: "/crop-tool", label: "自助裁切大頭照" },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-2 text-sm text-brand-text hover:text-brand-gold transition-colors duration-300 group"
                >
                  <span className="w-1 h-1 rounded-full bg-brand-gold/40 group-hover:bg-brand-gold transition-colors" />
                  <span className="whitespace-nowrap">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3 — Contact & collaboration */}
          <div>
            <h3 className="font-serif text-base font-medium text-brand-navy mb-5">
              聯絡與合作
            </h3>
            <div className="space-y-4">
              <a
                href="mailto:goldenyears166@gmail.com"
                className="flex items-start gap-2 text-sm text-brand-text hover:text-brand-gold transition-colors duration-300"
              >
                <span className="w-4 h-4 flex items-center justify-center text-brand-gold mt-0.5 shrink-0">
                  <i className="ri-mail-line text-xs" />
                </span>
                <span>goldenyears166@gmail.com</span>
              </a>

              <div className="bg-white rounded-lg p-4">
                <p className="font-serif text-sm text-brand-navy mb-2">
                  歡迎各類邀約及合作
                </p>
                <p className="text-sm text-brand-text leading-relaxed">
                  品牌聯名、企業形象拍攝、活動紀錄、講師邀約等，歡迎來信洽談。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Layer 3: Bottom Bar ─── */}
      <div className="border-t border-brand-navy/10">
        <div className="container-brand py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-brand-textMuted">
            © 2026 Golden Years Studio. All rights reserved.
          </p>

          <p className="text-xs text-brand-textMuted">
            純官網預約制 · 開放兩週內時段預約
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-brand-textMuted hover:text-brand-navy transition-colors duration-300 cursor-pointer"
            aria-label="回到頁面頂部"
          >
            <span className="whitespace-nowrap">回到頂部</span>
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-up-line" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}