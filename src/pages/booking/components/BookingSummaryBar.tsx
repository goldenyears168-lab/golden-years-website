import { useBooking } from '../context/useBooking';
import { STORES } from '../config';
import { formatTime } from '../api';

export function BookingSummaryBar() {
  const { state } = useBooking();

  if (state.step < 2 || !state.externalService || !state.selectedVariant) {
    return null;
  }

  return (
    <div className="mb-6 p-3 md:p-4 bg-brand-cream rounded-lg border border-brand-creamDark text-sm text-brand-charcoal">
      <span className="text-brand-textMuted">已選：</span>
      {[
        state.externalService.title,
        state.selectedVariant.label,
        state.storeKey
          ? STORES.find((s) => s.key === state.storeKey)?.label
          : null,
        state.selectedSlot
          ? `${state.selectedSlot.date} ${formatTime(state.selectedSlot.time)}`
          : null,
      ]
        .filter(Boolean)
        .join('，')}
    </div>
  );
}