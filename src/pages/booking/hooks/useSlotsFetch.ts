import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchSlots } from '../api';
import { BookingError, BookingErrorMessages } from '../domain/errors';
import type { StoreKey } from '../config';

export type UseSlotsFetchResult = {
  slotsByDate: Record<string, string[]>;
  loading: boolean;
  error: string | null;
  setSlotsByDate: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  reset: () => void;
};

export function useSlotsFetch(
  serviceId: number | null,
  storeKey: string | null,
  dateFrom: string,
  dateTo: string,
  enabled: boolean,
  allowedTimes?: string[],
): UseSlotsFetchResult {
  const [slotsByDate, setSlotsByDate] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Track cache key so we re-fetch when service or store changes
  const loadedRef = useRef<string | null>(null);

  const cacheKey = `${serviceId}-${storeKey}-${dateFrom}-${dateTo}-${allowedTimes?.join(',') ?? ''}`;

  useEffect(() => {
    if (!enabled || !serviceId || !storeKey) return;
    if (loadedRef.current === cacheKey) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchSlots(serviceId, storeKey as StoreKey, dateFrom, dateTo)
      .then(({ slotsByDate: matrix }) => {
        if (cancelled) return;

        // Apply allowedTimes filter if specified
        if (allowedTimes && allowedTimes.length > 0) {
          const filtered: Record<string, string[]> = {};
          for (const [date, times] of Object.entries(matrix ?? {})) {
            const matched = times.filter((t) => allowedTimes.includes(t.slice(0, 5)));
            if (matched.length > 0) {
              filtered[date] = matched;
            }
          }
          setSlotsByDate(filtered);
        } else {
          setSlotsByDate(matrix ?? {});
        }
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
  }, [enabled, serviceId, storeKey, dateFrom, dateTo, cacheKey, allowedTimes]);

  const reset = useCallback(() => {
    setSlotsByDate({});
    setError(null);
    loadedRef.current = null;
  }, []);

  return { slotsByDate, loading, error, setSlotsByDate, reset };
}