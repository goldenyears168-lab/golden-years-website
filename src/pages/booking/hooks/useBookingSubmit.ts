import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/useBooking';
import { STORES, STORAGE_KEY, type StoreKey } from '../config';
import { submitBooking, calculateArrivalTime } from '../api';
import { BookingErrorMessages } from '../domain/errors';
import type { ClientData, AdditionalField } from '../types';

export type UseBookingSubmitResult = {
  handleSubmit: (client: ClientData, additional: Record<string, string>) => Promise<void>;
};

export function useBookingSubmit(
  fields: AdditionalField[],
  setSlotsByDate: React.Dispatch<React.SetStateAction<Record<string, string[]>>>,
): UseBookingSubmitResult {
  const { state, dispatch } = useBooking();
  const navigate = useNavigate();
  const fieldsRef = useRef(fields);
  fieldsRef.current = fields;
  const setSlotsRef = useRef(setSlotsByDate);
  setSlotsRef.current = setSlotsByDate;

  const handleSubmit = useCallback(
    async (client: ClientData, additional: Record<string, string>) => {
      if (
        !state.selectedVariant ||
        !state.storeKey ||
        !state.selectedSlot ||
        !state.externalService
      )
        return;

      const storeLabel =
        STORES.find((s) => s.key === state.storeKey)?.label ?? '';

      const enrichedAdditional = { ...additional };
      const currentFields = fieldsRef.current;
      const noteField = currentFields.find((f) => {
        const text = `${f.title} ${f.name}`.toLowerCase();
        return /備註|note|comment|memo|remarks|註記|說明/.test(text);
      });
      if (noteField) {
        const userNote = enrichedAdditional[noteField.name] ?? '';
        const systemNote = `預約項目：${state.externalService.title} · ${state.selectedVariant.label} / 分店：${storeLabel}`;
        enrichedAdditional[noteField.name] = userNote
          ? `${systemNote} / ${userNote}`
          : systemNote;
      }

      if (!state.storeKey) {
        dispatch({
          type: 'SET_BOOK_ERROR',
          error: BookingErrorMessages.PROVIDER_NOT_FOUND,
        });
        return;
      }

      dispatch({ type: 'SET_SUBMITTING', submitting: true });
      dispatch({ type: 'SET_BOOK_ERROR', error: null });

      try {
        const result = await submitBooking({
          service: state.selectedVariant.service,
          storeKey: state.storeKey as StoreKey,
          date: state.selectedSlot.date,
          time: state.selectedSlot.time,
          appointmentId: state.selectedSlot.appointmentId,
          client,
          additional: enrichedAdditional,
        });

        const booking = result.bookings[0];
        if (!booking)
          throw new Error(
            '預約系統暫時無法處理您的請求，請稍後再試，或聯繫官方 LINE。',
          );

        const additionalAnswers = currentFields.map((f) => ({
          title: f.title.replace(/\s+/g, ' ').trim(),
          value: additional[f.name] ?? '',
        }));

        if (window.gtag) {
          window.gtag('event', 'service_booking', {
            event_category: 'engagement',
            event_label: `${state.externalService.title} · ${state.selectedVariant.label}`,
            store: storeLabel,
          });
          window.gtag('event', 'conversion', {
            send_to: 'AW-16966416142',
          });
        }

        const summary = {
          booking,
          serviceLabel: `${state.externalService.title} · ${state.selectedVariant.label}`,
          storeLabel,
          client,
          additionalAnswers,
          arrivalTime: calculateArrivalTime(
            state.selectedSlot.time,
            `${state.externalService.title} · ${state.selectedVariant.label}`,
            additional,
          ),
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(summary));
        navigate(`/booking/thank-you?code=${encodeURIComponent(booking.code)}`);

        setSlotsRef.current((prev) => {
          const day = prev[state.selectedSlot!.date] ?? [];
          return {
            ...prev,
            [state.selectedSlot!.date]: day.filter(
              (t) => t !== state.selectedSlot!.time,
            ),
          };
        });
      } catch (e) {
        dispatch({
          type: 'SET_BOOK_ERROR',
          error:
            e instanceof Error
              ? e.message
              : BookingErrorMessages.SUBMIT_FAILED,
        });
      } finally {
        dispatch({ type: 'SET_SUBMITTING', submitting: false });
      }
    },
    [
      state.selectedVariant,
      state.storeKey,
      state.selectedSlot,
      state.externalService,
      dispatch,
      navigate,
    ],
  );

  return { handleSubmit };
}
