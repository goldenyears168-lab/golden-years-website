import { useState, useEffect, useCallback } from 'react';
import { fetchAdditionalFields } from '../api';
import { BookingError, BookingErrorMessages } from '../domain/errors';
import type { AdditionalField } from '../types';

export type UseFieldsFetchResult = {
  fields: AdditionalField[];
  loading: boolean;
  error: string | null;
  setFields: React.Dispatch<React.SetStateAction<AdditionalField[]>>;
  reset: () => void;
};

export function useFieldsFetch(serviceId: number | null, enabled: boolean): UseFieldsFetchResult {
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
            e instanceof BookingError
              ? e.message
              : BookingErrorMessages.FIELDS_LOAD_FAILED,
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