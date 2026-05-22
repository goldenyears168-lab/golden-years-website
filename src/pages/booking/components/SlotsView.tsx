import { useEffect, useMemo, useState } from 'react';
import { formatTime, getDateRange, weekdayLabel } from '../api';
import type { SelectedSlot } from '../types';

type Props = {
  dates: string[];
  slotsByDate: Record<string, string[]>;
  loading: boolean;
  error: string | null;
  onSelectSlot: (slot: SelectedSlot) => void;
};

function dateChipMeta(dateStr: string, today: string): { tag?: string; sub: string; week: string } {
  const d = new Date(`${dateStr}T12:00:00`);
  const sub = `${d.getMonth() + 1}/${d.getDate()}`;
  const week = weekdayLabel(dateStr);
  const tag = dateStr === today ? '今日' : undefined;
  return { tag, sub, week };
}

export function SlotsView({
  dates,
  slotsByDate,
  loading,
  error,
  onSelectSlot,
}: Props) {
  const availableDates = useMemo(
    () => dates.filter((d) => (slotsByDate[d]?.length ?? 0) > 0),
    [dates, slotsByDate],
  );

  const todayStr = useMemo(() => getDateRange(1).dates[0], []);

  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    if (availableDates.length === 0) {
      setActiveDate(null);
      return;
    }
    setActiveDate((prev) =>
      prev && availableDates.includes(prev) ? prev : availableDates[0],
    );
  }, [availableDates]);

  /* clear selectedTime when date changes */
  useEffect(() => {
    setSelectedTime(null);
  }, [activeDate]);

  const timesForActive = activeDate ? (slotsByDate[activeDate] ?? []) : [];

  const handleTimeClick = (time: string) => {
    if (!activeDate || selectedTime) return;
    setSelectedTime(time);
    onSelectSlot({ date: activeDate, time });
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
      <div className="p-4 rounded-lg bg-red-50 text-red-700 text-sm" role="alert">
        <p>{error}</p>
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
      <p className="text-sm text-brand-textMuted mb-4">
        選擇日期與時段，將前往下一頁填寫預約資料
      </p>

      <div
        className="flex gap-2.5 overflow-x-auto pb-2 mb-4"
        role="tablist"
        aria-label="可預約日期"
      >
        {availableDates.map((date) => {
          const { tag, sub, week } = dateChipMeta(date, todayStr);
          const active = activeDate === date;
          return (
            <button
              key={date}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveDate(date)}
              className={`
                flex flex-col items-center gap-0.5
                min-w-[72px] px-3 py-2.5
                border-2 rounded-xl
                cursor-pointer
                transition-all duration-150
                flex-shrink-0
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

      {activeDate ? (
        <div role="tabpanel" className="border-t border-brand-creamDark pt-4">
          <p className="text-sm font-semibold text-brand-textMuted mb-3">
            {activeDate}（{weekdayLabel(activeDate)}）可預約時段
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {timesForActive.map((t) => {
              const isSelected = selectedTime === t;
              return (
                <button
                  key={t}
                  type="button"
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