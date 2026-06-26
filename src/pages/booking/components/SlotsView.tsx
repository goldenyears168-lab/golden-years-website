import { useEffect, useMemo, useRef, useState } from 'react';
import { useBooking } from '../context/useBooking';
import { formatTime, getDateRange, weekdayLabel } from '../api';

export function SlotsView({
  dates,
  slotsByDate,
  slotIds = {},
  loading,
  error,
  isStandaloneMakeup = false,
}: {
  dates: string[];
  slotsByDate: Record<string, string[]>;
  slotIds?: Record<string, Record<string, string>>;
  loading: boolean;
  error: string | null;
  isStandaloneMakeup?: boolean;
}) {
  const { dispatch } = useBooking();
  const availableDates = useMemo(
    () => (dates ?? []).filter((d) => ((slotsByDate ?? {})[d]?.length ?? 0) > 0),
    [dates, slotsByDate],
  );

  const todayStr = useMemo(() => getDateRange(1).dates[0], []);

  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  /* scroll detection */
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll, { passive: true });
    const timers = [setTimeout(checkScroll, 100), setTimeout(checkScroll, 500)];
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
      timers.forEach(clearTimeout);
    };
  }, [availableDates]);

  const scrollBy = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.55;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  useEffect(() => {
    if (availableDates.length === 0) {
      setActiveDate(null);
      return;
    }
    setActiveDate((prev) =>
      prev && availableDates.includes(prev) ? prev : availableDates[0],
    );
  }, [availableDates]);

  useEffect(() => {
    setSelectedTime(null);
  }, [activeDate]);

  const timesForActive = activeDate ? (slotsByDate[activeDate] ?? []) : [];

  const handleTimeClick = (time: string) => {
    if (!activeDate || selectedTime) return;
    setSelectedTime(time);
    dispatch({
      type: 'SELECT_SLOT',
      slot: {
        date: activeDate,
        time,
        appointmentId: slotIds[activeDate]?.[time.slice(0, 5)],
      },
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-brand-textMuted">
        <div className="w-9 h-9 border-[3px] border-brand-creamDark border-t-brand-navy rounded-full animate-spin" />
        <p className="text-sm">正在查詢可預約時段…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50 text-red-700 text-sm space-y-2" role="alert">
        <p className="font-semibold">預約系統暫時無法使用</p>
        <p className="text-xs opacity-80">{error}</p>
        <p className="text-xs">請截圖此錯誤訊息給客服，或稍後再試。</p>
      </div>
    );
  }

  if (availableDates.length === 0) {
    return (
      <div className="p-6 text-center text-brand-textMuted bg-white rounded-lg border border-dashed border-brand-creamDark">
        <p className="text-sm">近 14 天內沒有可預約時段，請改選其他服務或分店。</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-brand-creamDark rounded-lg p-4 md:p-5 shadow-sm">
      <p className="text-sm text-brand-textMuted mb-3">
        選擇日期與時段，將前往下一頁填寫預約資料
      </p>

      {/* Date chips */}
      <div className="relative mb-3">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollBy('left')}
            data-testid="scroll-left"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20
              w-8 h-8 rounded-full bg-white/95 border border-brand-creamDark
              flex items-center justify-center shadow-sm cursor-pointer
              hover:bg-brand-cream transition-colors"
            aria-label="向左滑動日期"
          >
            <i className="ri-arrow-left-s-line text-brand-navy text-lg" aria-hidden />
          </button>
        )}

        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollBy('right')}
            data-testid="scroll-right"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20
              w-8 h-8 rounded-full bg-white/95 border border-brand-creamDark
              flex items-center justify-center shadow-sm cursor-pointer
              hover:bg-brand-cream transition-colors"
            aria-label="向右滑動日期"
          >
            <i className="ri-arrow-right-s-line text-brand-navy text-lg" aria-hidden />
          </button>
        )}

        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-2 w-10 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-2 w-10 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        )}

        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory"
          role="tablist"
          aria-label="可預約日期"
        >
          {availableDates.map((date) => {
            const d = new Date(`${date}T12:00:00`);
            const sub = `${d.getMonth() + 1}/${d.getDate()}`;
            const week = weekdayLabel(date);
            const tag = date === todayStr ? '今日' : undefined;
            const active = activeDate === date;
            return (
              <button
                key={date}
                type="button"
                role="tab"
                data-testid={`date-${date}`}
                aria-selected={active}
                onClick={() => setActiveDate(date)}
                className={`
                  flex flex-col items-center gap-0.5
                  min-w-[72px] px-3 py-2.5
                  border-2 rounded-xl
                  cursor-pointer
                  transition-all duration-150
                  flex-shrink-0 snap-start
                  ${active
                    ? 'border-brand-navy bg-brand-cream'
                    : 'border-brand-creamDark bg-brand-cream hover:border-brand-gold'
                  }
                `}
              >
                {tag ? (
                  <span className={`text-[0.65rem] font-bold text-white px-2 py-0.5 rounded-full leading-tight ${active ? 'bg-brand-navy' : 'bg-brand-gold'}`}>
                    {tag}
                  </span>
                ) : null}
                <span className="text-sm font-semibold text-brand-navy">{week}</span>
                <span className="text-base font-bold text-brand-navy tabular-nums">{sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile scroll hint */}
      <p className="text-xs text-brand-textMuted text-center mb-4 lg:hidden">
        <i className="ri-arrow-left-right-line mr-1" aria-hidden />
        左右滑動或點擊箭頭查看更多日期
      </p>

      {activeDate ? (
        <div role="tabpanel" className="border-t border-brand-creamDark pt-4">
          <p className="text-sm font-semibold text-brand-textMuted mb-3">
            {activeDate}（{weekdayLabel(activeDate)}）可預約時段
            {isStandaloneMakeup
              ? '（此為妝髮開始時間，請依方案預留足夠時間）'
              : '（此為攝影棚時段，妝髮服務會需要再更提前）'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {timesForActive.map((t) => {
              const isSelected = selectedTime === t;
              return (
                <button
                  key={t}
                  type="button"
                  data-testid={`time-${t}`}
                  disabled={!!selectedTime}
                  onClick={() => handleTimeClick(t)}
                  className={`
                    min-h-[44px] px-2 py-2.5
                    border-2 rounded-xl
                    text-base font-bold tabular-nums
                    cursor-pointer
                    transition-all duration-150
                    ${isSelected
                      ? 'bg-brand-navy border-brand-navy text-white'
                      : 'border-brand-creamDark bg-brand-cream text-brand-navy hover:border-brand-gold hover:-translate-y-0.5'
                    }
                    ${selectedTime && !isSelected ? 'opacity-40 cursor-not-allowed' : ''}
                  `}
                >
                  {formatTime(t)}
                </button>
              );
            })}
          </div>
          {selectedTime && (
            <p className="mt-3 text-sm text-brand-navy font-medium text-center animate-pulse">
              已選擇 {formatTime(selectedTime)}，正在前往填寫資料…
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}