import { formatTime, getMakeupStyleLabel } from '../api';
import { LINE_OFFICIAL_URL } from '../config';
import type { BookingSummary } from '../types';

type Props = {
  summary: BookingSummary;
  onNewBooking: () => void;
};

export function BookingSuccess({ summary, onNewBooking }: Props) {
  const { booking, serviceLabel, storeLabel, arrivalTime } = summary;
  const start = booking.start_date_time;
  const [datePart, timePart] = start.includes(' ') ? start.split(' ') : [start, ''];

  return (
    <div className="text-center bg-white border border-brand-creamDark rounded-lg p-6 md:p-8 shadow-sm">
      <div
        className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-50 text-green-700
          text-2xl font-bold leading-[56px]"
        aria-hidden
      >
        ✓
      </div>
      <h2 className="text-xl font-semibold text-brand-navy mb-2">預約成功</h2>

      <p className="text-base text-brand-charcoal font-medium mb-1">
        期待與您見面！
      </p>
      <p className="text-sm text-brand-textMuted mb-4 leading-relaxed">
        我們已收到您的預約，拍攝當天請提前 5 分鐘抵達。
      </p>

      {arrivalTime ? (
        <div className="mb-4 p-3 rounded-lg bg-brand-cream border border-brand-gold/20">
          <div className="flex items-start gap-2 justify-center">
            <i className="ri-time-line text-brand-gold mt-0.5" aria-hidden />
            <div className="text-left">
              <p className="text-sm font-semibold text-brand-navy">
                建議到店時間：{datePart} {arrivalTime}
              </p>
              <p className="text-xs text-brand-textMuted mt-0.5 leading-relaxed">
                拍攝時間為 {timePart ? formatTime(timePart) : ''}，含妝髮服務請提前到店完成造型準備。
              </p>
            </div>
          </div>
        </div>
      ) : serviceLabel.includes('妝髮') ? (
        <div className="mb-4 p-3 rounded-lg bg-brand-cream border border-brand-gold/20">
          <div className="flex items-start gap-2 justify-center">
            <i className="ri-time-line text-brand-gold mt-0.5" aria-hidden />
            <div className="text-left">
              <p className="text-sm font-semibold text-brand-navy">
                請提前到店完成造型準備
              </p>
              <p className="text-xs text-brand-textMuted mt-0.5 leading-relaxed">
                拍攝時間為 {timePart ? formatTime(timePart) : ''}，含妝髮服務建議提前到達，實際時間依所選妝髮方案而定。
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <p className="text-base text-brand-charcoal mb-2">
        預約代碼：<strong className="text-brand-navy tracking-wider">{booking.code}</strong>
      </p>
      <ul className="list-none p-0 m-0 mb-4 text-brand-textMuted text-sm leading-relaxed space-y-1">
        <li>{serviceLabel} · {storeLabel}</li>
        <li>
          {datePart} {timePart ? formatTime(timePart) : ''}
        </li>
      </ul>
      <p className="text-sm text-brand-navy font-semibold mb-2">
        請查看您的電子信箱確認信，點擊信內連結以完成預約。
      </p>
      <p className="text-sm text-brand-textMuted mb-5">
        若未收到信件，請檢查垃圾郵件匣。
      </p>

      <p className="text-sm text-brand-textMuted mb-5 leading-relaxed">
        若需取消、更改時段，請直接至預約確認信取消並重新預約。
      </p>

      <a
        href={LINE_OFFICIAL_URL}
        className="
          inline-flex items-center justify-center gap-2.5
          w-full px-5 py-3.5 mb-3
          rounded-full text-white text-base font-bold
          cursor-pointer
          transition-all duration-150
          hover:-translate-y-0.5
        "
        style={{ background: '#06c755', boxShadow: '0 4px 14px rgba(6,199,85,0.35)' }}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span
          className="inline-flex items-center justify-center
            min-w-[40px] h-6 px-2 rounded-md
            text-xs font-extrabold tracking-wide
          "
          style={{ background: 'rgba(255,255,255,0.25)' }}
          aria-hidden
        >
          LINE
        </span>
        加入官方 LINE
      </a>

      <button
        type="button"
        onClick={onNewBooking}
        className="
          w-full px-5 py-3
          rounded-full bg-brand-creamDark text-brand-navy
          text-base font-semibold
          cursor-pointer
          transition-opacity duration-150
          hover:opacity-90
        "
      >
        預約下一筆
      </button>
    </div>
  );
}