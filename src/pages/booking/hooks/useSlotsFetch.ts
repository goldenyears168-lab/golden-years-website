import { useState, useEffect, useCallback } from 'react';
import { fetchSlots } from '../api';

export function useSlotsFetch(
  serviceId: number | null,
  providerId: number | null,
  dateFrom: string,
  dateTo: string,
  enabled: boolean,
) {
  const [slotsByDate, setSlotsByDate] = useState<Record<string, string[]>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !serviceId || !providerId) return;
    if (Object.keys(slotsByDate).length > 0) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchSlots(serviceId, providerId, dateFrom, dateTo)
      .then(({ slotsByDate: matrix }) => {
        if (!cancelled) setSlotsByDate(matrix);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(
            e instanceof Error
              ? e.message
              : '查詢可預約時段失敗，請重新整理頁面或聯繫官方 LINE。',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, serviceId, providerId, dateFrom, dateTo, slotsByDate]);

  const reset = useCallback(() => {
    setSlotsByDate({});
    setError(null);
  }, []);

  return { slotsByDate, loading, error, setSlotsByDate, reset };
}