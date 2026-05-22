import { useState, useEffect, useCallback } from 'react';
import { fetchAdditionalFields } from '../api';
import type { AdditionalField } from '../types';

export function useFieldsFetch(serviceId: number | null, enabled: boolean) {
  const [fields, setFields] = useState<AdditionalField[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !serviceId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchAdditionalFields(serviceId)
      .then((f) => {
        if (!cancelled) setFields(f);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(
            e instanceof Error
              ? e.message
              : '無法載入預約表單，請重新整理頁面後再試。',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, serviceId]);

  const reset = useCallback(() => {
    setFields([]);
    setError(null);
  }, []);

  return { fields, loading, error, setFields, reset };
}