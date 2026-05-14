import { Link } from "react-router-dom";

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <a
        href="https://line.me/R/ti/p/@614cnqns"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-[#06C755] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="LINE官方帳號"
      >
        <i className="ri-line-fill text-white text-xl" />
      </a>
      <Link
        to="/booking"
        className="w-12 h-12 rounded-full bg-brand-navy flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="線上預約"
      >
        <i className="ri-calendar-check-line text-white text-lg" />
      </Link>
    </div>
  );
}