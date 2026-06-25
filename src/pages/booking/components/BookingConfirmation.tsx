import { formatTime, weekdayLabel, getMakeupStyleLabel } from '../api';
import type { BookingSummary } from '../types';

export function BookingConfirmation({ summary }: { summary: BookingSummary }) {
  const { booking, serviceLabel, storeLabel, arrivalTime, additionalAnswers } = summary;
  const start = booking.start_date_time;
  const [datePart, timePart] = start.includes(' ') ? start.split(' ') : [start, ''];
  const timeFormatted = timePart ? formatTime(timePart) : '';

  const isMakeup = serviceLabel.includes('妝髮');
  const styleLabel = getMakeupStyleLabel(additionalAnswers);

  return (
    <div className="space-y-5">
      {/* 預約摘要 */}
      <div className="mb-2">
        <p className="text-base text-brand-charcoal font-medium mb-1">
          期待與您見面！
        </p>
        <p className="text-sm text-brand-textMuted leading-relaxed">
          我們已收到您的預約，拍攝當天請提前抵達。
        </p>
      </div>

      {/* 建議到店時間 */}
      <div className="p-4 rounded-xl bg-brand-cream border border-brand-gold/25">
        <div className="flex items-start gap-3 justify-center text-left">
          <div className="w-9 h-9 rounded-full bg-brand-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5">
            <i className="ri-time-line text-brand-gold text-base" aria-hidden />
          </div>
          <div className="min-w-0">
            {arrivalTime ? (
              <>
                <p className="text-sm md:text-base font-semibold text-brand-navy leading-snug">
                  建議到店時間：{datePart} {arrivalTime}
                </p>
                <p className="text-xs md:text-sm text-brand-textMuted mt-1 leading-relaxed">
                  拍攝時間為 {timeFormatted}
                  {isMakeup
                    ? `，${styleLabel ? `您選擇的是「${styleLabel}」` : '含妝髮服務'}請提前到店完成造型準備。`
                    : '，請提前 5 分鐘抵達以便完成準備。'}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm md:text-base font-semibold text-brand-navy leading-snug">
                  {isMakeup ? '請提前到店完成造型準備' : '請提前 5 分鐘抵達'}
                </p>
                <p className="text-xs md:text-sm text-brand-textMuted mt-1 leading-relaxed">
                  拍攝時間為 {timeFormatted}
                  {isMakeup
                    ? '，含妝髮服務建議於拍攝時間前提前到達，實際時間依所選妝髮方案而定。'
                    : '，建議提前到達以便完成準備。'}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 預約代碼 */}
      <p className="text-base text-brand-charcoal">
        預約代碼：
        <strong className="text-brand-navy tracking-wider ml-1">{booking.code}</strong>
      </p>

      {/* 預約資訊 */}
      <ul className="list-none p-0 m-0 text-brand-textMuted text-sm leading-relaxed space-y-1">
        <li>{serviceLabel} · {storeLabel}</li>
        <li>
          {datePart} {timeFormatted}
        </li>
      </ul>

      {/* 確認信提醒 */}
      <p className="text-sm text-brand-navy font-semibold">
        收到預約確認信才代表預約成功喔
      </p>
      <p className="text-sm text-brand-textMuted">
        若未收到信件，請檢查垃圾郵件匣。
      </p>

      <p className="text-sm text-brand-textMuted leading-relaxed">
        若需取消、更改時段，請直接至預約確認信取消並重新預約。
      </p>
    </div>
  );
}