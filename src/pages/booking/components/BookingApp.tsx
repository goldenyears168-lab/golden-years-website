import { useEffect, useMemo, useRef } from 'react';
import { useBooking } from '../context/useBooking';
import { ProgressBar } from './ProgressBar';
import { BookingSummaryBar } from './BookingSummaryBar';
import { BookingStepContent } from './BookingStepContent';
import { useSlotsFetch } from '../hooks/useSlotsFetch';
import { useFieldsFetch } from '../hooks/useFieldsFetch';
import { useBookingSubmit } from '../hooks/useBookingSubmit';
import {
  SERVICES,
  DAYS_AHEAD,
  type StoreKey,
} from '../config';
import { getDateRange } from '../api';

const STEP_LABELS = ['選擇服務', '選擇分店', '選擇時段', '填寫資料'];

export function BookingApp() {
  const { state, dispatch } = useBooking();
  const wizardRef = useRef<HTMLDivElement>(null);
  const prevStepRef = useRef<number>(1);

  const dateRange = useMemo(() => getDateRange(DAYS_AHEAD), []);

  const providerId = useMemo(() => {
    if (!state.selectedVariant || !state.storeKey) return null;
    const svc = SERVICES.find((s) => s.id === state.selectedVariant.simplybookId);
    return svc?.providers[state.storeKey] ?? null;
  }, [state.selectedVariant, state.storeKey]);

  const slotsFetch = useSlotsFetch(
    state.selectedVariant?.simplybookId ?? null,
    providerId,
    dateRange.from,
    dateRange.to,
    state.step === 3,
    state.externalService?.id === 'id-formal' ? ['14:45', '16:00'] : undefined,
  );

  const fieldsFetch = useFieldsFetch(
    state.selectedVariant?.simplybookId ?? null,
    state.step === 4,
  );

  const { handleSubmit } = useBookingSubmit(fieldsFetch.fields, slotsFetch.setSlotsByDate);

  /* Scroll to wizard container on step change */
  useEffect(() => {
    if (!wizardRef.current) return;
    if (prevStepRef.current === state.step) return;
    prevStepRef.current = state.step;
    const headerOffset = 80;
    const top =
      wizardRef.current.getBoundingClientRect().top +
      window.scrollY -
      headerOffset;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }, [state.step]);

  /* Auto-scroll to service detail panel when a variant is selected */
  useEffect(() => {
    if (state.step !== 1 || !state.selectedVariant) return;
    const timer = setTimeout(() => {
      const el = document.getElementById('service-detail-panel');
      if (!el) return;
      const headerOffset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [state.step, state.selectedVariant]);

  return (
    <div ref={wizardRef}>
      <ProgressBar labels={STEP_LABELS} />
      <BookingSummaryBar />
      <BookingStepContent
        dateRange={dateRange}
        slotsFetch={slotsFetch}
        fieldsFetch={fieldsFetch}
        onSubmit={handleSubmit}
      />
    </div>
  );
}