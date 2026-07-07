import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchSlots } from '../api';
import { BookingError, BookingErrorMessages } from '../domain/errors';
import type { AppointmentService } from '../service-mapping';
import type { StoreKey } from '../config';

export type UseSlotsFetchResult = {
  slotsByDate: Record<string, string[]>;
  slotIds: Record<string, Record<string, string>>;
  loading: boolean;
  error: string | null;
  setSlotsByDate: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  reset: () => void;
};

export function useSlotsFetch(
  service: AppointmentService | null,
  storeKey: string | null,
  dateFrom: string,
  dateTo: string,
  enabled: boolean,
): UseSlotsFetchResult {
  const [slotsByDate, setSlotsByDate] = useState<Record<string, string[]>>({});
  const [slotIds, setSlotIds] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef<string | null>(null);

  const cacheKey = `${service}-${storeKey}-${dateFrom}-${dateTo}`;

  useEffect(() => {
    if (!enabled || !service || !storeKey) return;
    if (loadedRef.current === cacheKey) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchSlots(service, storeKey as StoreKey, dateFrom, dateTo)
      .then(({ slotsByDate: matrix, slotIds: ids }) => {
        if (cancelled) return;
        setSlotsByDate(matrix ?? {});
        setSlotIds(ids ?? {});
      })
      .catch((e) => {
        if (!cancelled) {
          setError(
            e instanceof BookingError
              ? e.message
              : BookingErrorMessages.SLOTS_UNAVAILABLE,
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
          loadedRef.current = cacheKey;
        }
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, service, storeKey, dateFrom, dateTo, cacheKey]);

  const reset = useCallback(() => {
    setSlotsByDate({});
    setSlotIds({});
    setError(null);
    loadedRef.current = null;
  }, []);

  return { slotsByDate, slotIds, loading, error, setSlotsByDate, reset };
}
