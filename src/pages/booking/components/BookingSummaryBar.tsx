import { useBooking } from '../context/useBooking';
import { STORES } from '../config';
import { formatTime } from '../api';

export function BookingSummaryBar() {
  const { state } = useBooking();

  if (state.step < 2 || !state.externalService || !state.selectedVariant) {
    return null;
  }

  return (
    <div className="mb-6 p-3 md:p-4 bg-brand-cream rounded-lg border border-brand-creamDark flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      <span className="text-brand-textMuted">已選：</span>
      <span className="font-medium text-brand-charcoal">
        {state.externalService.title}
      </span>
      <span className="text-brand-textMuted text-xs">·</span>
      <span className="text-brand-charcoal text-xs">
        {state.selectedVariant.label}
      </span>
      {state.storeKey && (
        <>
          <span className="text-brand-textMuted text-xs">·</span>
          <span className="text-brand-charcoal text-xs">
            {STORES.find((s) => s.key === state.storeKey)?.label}
          </span>
        </>
      )}
      {state.selectedSlot && (
        <>
          <span className="text-brand-textMuted text-xs">·</span>
          <span className="text-brand-charcoal text-xs">
            {state.selectedSlot.date} {formatTime(state.selectedSlot.time)}
          </span>
        </>
      )}
    </div>
  );
}