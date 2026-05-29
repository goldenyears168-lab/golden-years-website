import { formatTime, weekdayLabel, getMakeupStyleLabel } from '../api';
import { LINE_OFFICIAL_URL } from '../config';
import { BookingConfirmation } from './BookingConfirmation';
import type { BookingSummary } from '../types';

type Props = {
  summary: BookingSummary;
  onNewBooking: () => void;
};

export function BookingSuccess({ summary, onNewBooking }: Props) {
  const { booking } = summary;
  const start = booking.start_date_time;
  const [datePart, timePart] = start.includes(' ') ? start.split(' ') : [start, ''];
  const timeFormatted = timePart ? formatTime(timePart) : '';

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