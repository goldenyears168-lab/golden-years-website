import { buildLineOaMessageUrl } from '../config';
import { buildBookingLinePrefillMessage } from '../lib/line-oa-message';
import { BookingConfirmation } from './BookingConfirmation';
import type { BookingSummary } from '../types';

type Props = {
  summary: BookingSummary;
  onNewBooking: () => void;
};

export function BookingSuccess({ summary, onNewBooking }: Props) {
  const linePrefillUrl = buildLineOaMessageUrl(buildBookingLinePrefillMessage(summary));

  return (
    <div className="text-center bg-white border border-brand-creamDark rounded-lg p-5 md:p-8 shadow-sm">
      <div
        className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-50 text-green-700
          text-2xl font-bold leading-[56px]"
        aria-hidden
      >
        ✓
      </div>
      <h2 className="text-xl font-semibold text-brand-navy mb-2">預約成功</h2>

      <BookingConfirmation summary={summary} />

      <p className="text-xs text-brand-textMuted leading-relaxed mb-3 text-left">
        想接收 LINE 拍攝提醒？加入官方 LINE 並
        <strong className="font-semibold text-brand-navy"> 傳送預填訊息 </strong>
        即可完成綁定。（請使用手機 LINE 開啟；確認信仍為正式預約憑據）
      </p>

      <a
        href={linePrefillUrl}
        className="
          inline-flex items-center justify-center gap-2.5
          w-full px-5 py-3 mb-3
          rounded-full text-brand-navy text-base font-semibold
          border-2 border-[#06c755] bg-white
          cursor-pointer
          transition-all duration-150
          hover:bg-green-50
        "
        target="_blank"
        rel="noopener noreferrer"
      >
        <span
          className="inline-flex items-center justify-center
            min-w-[40px] h-6 px-2 rounded-md
            text-xs font-extrabold tracking-wide text-white
          "
          style={{ background: '#06c755' }}
          aria-hidden
        >
          LINE
        </span>
        加入 LINE 並傳送預約資訊（選配）
      </a>

      <button
        type="button"
        onClick={onNewBooking}
        data-testid="new-booking"
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
