import { useBooking } from '../context/useBooking';
import { DAYS_AHEAD, SERVICES } from '../config';
import { getDetailKey, SERVICE_DETAILS } from '../data/service-details';
import { ServiceStep } from './ServiceStep';
import { StoreStep } from './StoreStep';
import { SlotsView } from './SlotsView';
import { BookingForm } from './BookingForm';
import { ServiceDetailPanel } from './ServiceDetailPanel';
import type { UseSlotsFetchResult } from '../hooks/useSlotsFetch';
import type { UseFieldsFetchResult } from '../hooks/useFieldsFetch';
import type { ClientData } from '../types';

type BookingStepContentProps = {
  dateRange: {
    from: string;
    to: string;
    dates: string[];
  };
  slotsFetch: UseSlotsFetchResult;
  fieldsFetch: UseFieldsFetchResult;
  onSubmit: (client: ClientData, additional: Record<string, string>) => void;
};

export function BookingStepContent({
  dateRange,
  slotsFetch,
  fieldsFetch,
  onSubmit,
}: BookingStepContentProps) {
  const { state, dispatch } = useBooking();

  const detailKey = (() => {
    if (!state.externalService || !state.selectedVariant) return null;
    if (state.externalService.isStandaloneMakeup) return 'standalone-makeup';
    const variantType: 'basic' | 'makeup' =
      state.selectedVariant.simplybookId ===
      state.externalService.variants.basic.simplybookId
        ? 'basic'
        : 'makeup';
    return getDetailKey(state.externalService.id, variantType);
  })();

  return (
    <div className="relative">
      {state.step === 1 && (
        <div className="animate-step-enter">
          <ServiceStep />
          {detailKey && SERVICE_DETAILS[detailKey] && (
            <ServiceDetailPanel data={SERVICE_DETAILS[detailKey]} />
          )}
        </div>
      )}

      {state.step === 2 && (
        <div className="animate-step-enter">
          <StoreStep />
        </div>
      )}

      {state.step === 3 && (
        <div className="animate-step-enter">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-brand-navy mb-1">
              選擇日期與時段
            </h2>
            <p className="text-sm text-brand-textMuted">
              {dateRange.from} ～ {dateRange.to}（近 {DAYS_AHEAD} 天）
            </p>
          </div>
          <SlotsView
            dates={dateRange.dates}
            slotsByDate={slotsFetch.slotsByDate}
            slotIds={slotsFetch.slotIds}
            loading={slotsFetch.loading}
            error={slotsFetch.error}
            isStandaloneMakeup={state.externalService?.isStandaloneMakeup}
          />
        </div>
      )}

      {state.step === 4 &&
        state.selectedVariant &&
        state.selectedSlot &&
        state.storeKey &&
        state.externalService && (
          <div className="animate-step-enter">
            <button
              type="button"
              onClick={() => dispatch({ type: 'GO_TO_STEP', step: 3 })}
              className="
                inline-flex items-center mb-4
                px-0 py-2 border-none bg-transparent
                text-brand-navy text-sm font-semibold
                cursor-pointer
                hover:text-brand-gold
                transition-colors
              "
            >
              ← 返回修改時段
            </button>
            <BookingForm
              fields={fieldsFetch.fields}
              fieldsLoading={fieldsFetch.loading}
              error={state.bookError ?? fieldsFetch.error}
              onSubmit={onSubmit}
              showSummary={false}
            />
          </div>
        )}
    </div>
  );
}