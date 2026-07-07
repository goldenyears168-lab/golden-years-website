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
  allowedTimes?: string[],
): UseSlotsFetchResult {
  const [slotsByDate, setSlotsByDate] = useState<Record<string, string[]>>({});
  const [slotIds, setSlotIds] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef<string | null>(null);

  const cacheKey = `${service}-${storeKey}-${dateFrom}-${dateTo}-${allowedTimes?.join(',') ?? ''}`;

  useEffect(() => {
    if (!enabled || !service || !storeKey) {
      if (enabled) {
        setSlotsByDate({});
        setSlotIds({});
        setError(null);
        loadedRef.current = null;
      }
      return;
    }
    if (loadedRef.current === cacheKey) return;

    let cancelled = false;
    setSlotsByDate({});
    setSlotIds({});
    setLoading(true);
    setError(null);

    fetchSlots(service, storeKey as StoreKey, dateFrom, dateTo)
      .then(({ slotsByDate: matrix, slotIds: ids }) => {
        if (cancelled) return;

        if (allowedTimes && allowedTimes.length > 0) {
          const filtered: Record<string, string[]> = {};
          const filteredIds: Record<string, Record<string, string>> = {};
          for (const [date, times] of Object.entries(matrix ?? {})) {
            const matched = times.filter((t) => allowedTimes.includes(t.slice(0, 5)));
            if (matched.length > 0) {
              filtered[date] = matched;
              if (ids[date]) {
                filteredIds[date] = Object.fromEntries(
                  matched
                    .filter((time) => ids[date]?.[time])
                    .map((time) => [time, ids[date]![time]!]),
                );
              }
            }
          }
          setSlotsByDate(filtered);
          setSlotIds(filteredIds);
        } else {
          setSlotsByDate(matrix ?? {});
          setSlotIds(ids ?? {});
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
  }, [enabled, service, storeKey, dateFrom, dateTo, cacheKey, allowedTimes]);

  const reset = useCallback(() => {
    setSlotsByDate({});
    setSlotIds({});
    setError(null);
    loadedRef.current = null;
  }, []);

  return { slotsByDate, slotIds, loading, error, setSlotsByDate, reset };
}
