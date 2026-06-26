import {
  formatTime,
  weekdayLabel,
  calculateArrivalTime,
  getMakeupStyleLabel,
  isStandaloneMakeupLabel,
} from '../api';
import type { SelectedSlot } from '../types';

type Props = {
  slot: SelectedSlot;
  serviceLabel: string;
  additional: Record<string, string> | undefined;
};

export default function ArrivalTimeNotice({ slot, serviceLabel, additional }: Props) {
  const arrival = calculateArrivalTime(slot.time, serviceLabel, additional ?? {});
  const isStandalone = isStandaloneMakeupLabel(serviceLabel);
  const styleLabel = getMakeupStyleLabel(additional ?? {}, { standalone: isStandalone });
  const isMakeupAddon = serviceLabel.includes('妝髮') && !isStandalone;

  return (
    <div className="mb-5 p-3 md:p-4 rounded-xl bg-brand-cream border border-brand-gold/30 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <i className="ri-time-line text-brand-gold text-base" aria-hidden />
        </div>
        <div className="min-w-0">
          {arrival ? (
            <>
              <p className="text-sm md:text-base font-semibold text-brand-navy leading-snug">
                建議到店時間：{slot.date}（{weekdayLabel(slot.date)}）{arrival}
              </p>
              <p className="text-xs md:text-sm text-brand-textMuted mt-1 leading-relaxed">
                {isStandalone
                  ? `妝髮開始時間為 ${formatTime(slot.time)}${styleLabel ? `，您選擇的是「${styleLabel}」` : ''}，請提前 5 分鐘抵達。`
                  : isMakeupAddon
                    ? `拍攝時間為 ${formatTime(slot.time)}，${styleLabel ? `您選擇的是「${styleLabel}」` : '含妝髮服務'}請提前到店完成造型準備。`
                    : `拍攝時間為 ${formatTime(slot.time)}，請提前 5 分鐘抵達以便完成準備。`}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm md:text-base font-semibold text-brand-navy leading-snug">
                {isStandalone ? '請提前 5 分鐘抵達' : isMakeupAddon ? '請提前到店完成造型準備' : '請提前 5 分鐘抵達'}
              </p>
              <p className="text-xs md:text-sm text-brand-textMuted mt-1 leading-relaxed">
                {isStandalone
                  ? `妝髮開始時間為 ${formatTime(slot.time)}，實際所需時間依所選妝髮方案而定。`
                  : isMakeupAddon
                    ? `拍攝時間為 ${formatTime(slot.time)}，含妝髮服務建議於拍攝時間前提前到達，實際時間依所選妝髮方案而定。`
                    : `拍攝時間為 ${formatTime(slot.time)}，建議提前到達以便完成準備。`}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}