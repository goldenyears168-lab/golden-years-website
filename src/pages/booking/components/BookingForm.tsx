import { useEffect, useState, useRef } from 'react';
import { useBooking } from '../context/useBooking';
import { STORES } from '../config';
import {
  formatTime,
  weekdayLabel,
  normalizePhone,
} from '../api';
import { BookingErrorMessages } from '../domain/errors';
import type { ClientData } from '../types';
import DynamicField from './fields/DynamicField';
import ArrivalTimeNotice from './ArrivalTimeNotice';

export function BookingForm({
  fields,
  fieldsLoading,
  error,
  onSubmit,
  showSummary = true,
}: {
  fields: import('../types').AdditionalField[];
  fieldsLoading: boolean;
  error: string | null;
  onSubmit: (client: ClientData, additional: Record<string, string>) => void;
  showSummary?: boolean;
}) {
  const { state, dispatch } = useBooking();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [additional, setAdditional] = useState<Record<string, string>>();
  const [formError, setFormError] = useState<string | null>(null);
  const initializedRef = useRef(false);

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const slot = state.selectedSlot;
  const serviceLabel = state.externalService && state.selectedVariant
    ? `${state.externalService.title} · ${state.selectedVariant.label}`
    : '';
  const storeLabel = state.storeKey
    ? (STORES.find((s) => s.key === state.storeKey)?.label ?? '')
    : '';

  useEffect(() => {
    if (fields.length === 0 || initializedRef.current) return;
    initializedRef.current = true;
    setAdditional((prev) => {
      const next = { ...prev };
      for (const f of fields) {
        if (f.default && !next[f.name]) next[f.name] = f.default;
      }
      return next;
    });
  }, [fields]);

  const setField = (key: string, value: string) => {
    setAdditional((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError(BookingErrorMessages.VALIDATION_ERROR);
      return;
    }
    if (!email.trim()) {
      setFormError('請填寫電子信箱');
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setFormError('請填寫正確的電子信箱格式');
      return;
    }
    if (!phone.trim()) {
      setFormError('請填寫電話');
      return;
    }

    for (const f of fields) {
      if (f.is_null === '0' && !additional?.[f.name]?.trim()) {
        setFormError(`請填寫：${f.title.replace(/\s+/g, ' ').trim()}`);
        return;
      }
    }

    onSubmit(
      { name: name.trim(), email: email.trim(), phone: normalizePhone(phone.trim()) },
      additional ?? {},
    );
  };

  if (!slot) return null;

  return (
    <form
      className="bg-white border border-brand-creamDark rounded-lg p-4 md:p-5 shadow-sm"
      onSubmit={handleSubmit}
    >
      {/* Booking Summary */}
      {showSummary !== false && (
        <div className="mb-4 pb-3 border-b border-brand-creamDark">
          <h3 className="text-base font-semibold text-brand-navy mb-2">預約摘要</h3>
          <ul className="space-y-2">
            <li className="flex justify-between gap-3 text-sm">
              <span className="text-brand-textMuted flex-shrink-0">服務</span>
              <strong className="text-brand-charcoal text-right">{serviceLabel}</strong>
            </li>
            <li className="flex justify-between gap-3 text-sm">
              <span className="text-brand-textMuted flex-shrink-0">分店</span>
              <strong className="text-brand-charcoal text-right">{storeLabel}</strong>
            </li>
            <li className="flex justify-between gap-3 text-sm">
              <span className="text-brand-textMuted flex-shrink-0">時間</span>
              <strong className="text-brand-charcoal text-right">
                {slot.date}（{weekdayLabel(slot.date)}）{formatTime(slot.time)}
              </strong>
            </li>
          </ul>
          <button
            type="button"
            onClick={() => dispatch({ type: 'GO_TO_STEP', step: 3 })}
            data-testid="change-slot"
            className="mt-3 text-sm text-brand-gold hover:text-brand-navy underline cursor-pointer bg-transparent border-none p-0"
          >
            改選其他時段
          </button>
        </div>
      )}

      {/* Contact Info */}
      <fieldset className="border-none p-0 m-0 mb-4" disabled={state.submitting}>
        <legend className="text-base font-semibold text-brand-navy mb-2 block">聯絡資料</legend>

        <label className="flex flex-col gap-2 mb-5">
          <span className="text-sm font-medium text-brand-charcoal">
            姓名 <em className="text-red-600 not-italic">*</em>
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            data-testid="input-name"
            className="px-3 py-2 border-2 border-gray-300 rounded-lg text-base
              focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold
              bg-white text-brand-charcoal"
          />
        </label>

        <label className="flex flex-col gap-2 mb-5">
          <span className="text-sm font-medium text-brand-charcoal">
            電子信箱 <em className="text-red-600 not-italic">*</em>
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            data-testid="input-email"
            className="px-3 py-2 border-2 border-gray-300 rounded-lg text-base
              focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold
              bg-white text-brand-charcoal"
          />
        </label>

        <label className="flex flex-col gap-2 mb-5">
          <span className="text-sm font-medium text-brand-charcoal">
            電話 <em className="text-red-600 not-italic">*</em>
          </span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0912345678"
            required
            autoComplete="tel"
            data-testid="input-phone"
            className="px-3 py-2 border-2 border-gray-300 rounded-lg text-base
              focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold
              bg-white text-brand-charcoal"
          />
        </label>
      </fieldset>

      {/* Additional Fields */}
      {fieldsLoading ? (
        <p className="text-sm text-brand-textMuted mb-4">載入表單欄位…</p>
      ) : (
        <fieldset className="border-none p-0 m-0 mb-4" disabled={state.submitting}>
          {fields.map((field) => (
            <DynamicField
              key={field.name}
              field={field}
              value={additional?.[field.name] ?? ''}
              onChange={(v) => setField(field.name, v)}
            />
          ))}
        </fieldset>
      )}

      {/* Errors */}
      {formError || error ? (
        <div className="p-4 rounded-lg bg-red-50 text-red-700 text-sm mb-4" role="alert">
          <p>{formError ?? error}</p>
        </div>
      ) : null}

      {/* Arrival Time Notice */}
      <ArrivalTimeNotice
        slot={slot}
        serviceLabel={serviceLabel}
        additional={additional}
      />

      {/* Submit */}
      <button
        type="submit"
        data-testid="submit-booking"
        disabled={state.submitting || fieldsLoading}
        className="
          w-full inline-flex items-center justify-center gap-2
          px-6 py-4 md:py-5
          rounded-full bg-brand-navy text-white
          text-lg md:text-xl font-bold
          cursor-pointer
          shadow-lg shadow-brand-navy/25
          transition-all duration-200
          hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-navy/30
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
        "
      >
        {state.submitting ? (
          <>
            <i className="ri-loader-4-line animate-spin" aria-hidden />
            送出中…
          </>
        ) : (
          <>
            <i className="ri-calendar-check-line" aria-hidden />
            確認預約
          </>
        )}
      </button>
    </form>
  );
}