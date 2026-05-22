import { useEffect, useState } from 'react';
import {
  formatTime,
  isFieldRequired,
  normalizePhone,
  parseSelectValues,
  weekdayLabel,
  calculateArrivalTime,
  getMakeupStyleLabel,
} from '../api';
import type { AdditionalField, ClientData, SelectedSlot } from '../types';

type Props = {
  serviceLabel: string;
  storeLabel: string;
  slot: SelectedSlot;
  fields: AdditionalField[];
  fieldsLoading: boolean;
  submitting: boolean;
  error: string | null;
  onBack: () => void;
  backLabel?: string;
  onSubmit: (client: ClientData, additional: Record<string, string>) => void;
  showSummary?: boolean;
};

export function BookingForm({
  serviceLabel,
  storeLabel,
  slot,
  fields,
  fieldsLoading,
  submitting,
  error,
  onBack,
  backLabel,
  onSubmit,
  showSummary = true,
}: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [additional, setAdditional] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (fields.length === 0) return;
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
      setFormError('請填寫姓名');
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
      if (isFieldRequired(f) && !additional[f.name]?.trim()) {
        setFormError(`請填寫：${f.title.replace(/\s+/g, ' ').trim()}`);
        return;
      }
    }

    onSubmit(
      { name: name.trim(), email: email.trim(), phone: normalizePhone(phone.trim()) },
      additional ?? {},
    );
  };

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
            onClick={onBack}
            className="mt-3 text-sm text-brand-gold hover:text-brand-navy underline cursor-pointer bg-transparent border-none p-0"
          >
            {backLabel ?? '改選其他時段'}
          </button>
        </div>
      )}

      {/* Contact Info */}
      <fieldset className="border-none p-0 m-0 mb-4" disabled={submitting}>
        <legend className="text-base font-semibold text-brand-navy mb-2 block">聯絡資料</legend>

        <label className="flex flex-col gap-1 mb-3">
          <span className="text-sm font-medium text-brand-charcoal">
            姓名 <em className="text-red-600 not-italic">*</em>
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className="px-3 py-2 border border-brand-creamDark rounded-lg text-base
              focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold
              bg-white text-brand-charcoal"
          />
        </label>

        <label className="flex flex-col gap-1 mb-3">
          <span className="text-sm font-medium text-brand-charcoal">
            電子信箱 <em className="text-red-600 not-italic">*</em>
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="px-3 py-2 border border-brand-creamDark rounded-lg text-base
              focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold
              bg-white text-brand-charcoal"
          />
        </label>

        <label className="flex flex-col gap-1 mb-3">
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
            className="px-3 py-2 border border-brand-creamDark rounded-lg text-base
              focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold
              bg-white text-brand-charcoal"
          />
        </label>
      </fieldset>

      {/* Additional Fields */}
      {fieldsLoading ? (
        <p className="text-sm text-brand-textMuted mb-4">載入表單欄位…</p>
      ) : (
        <fieldset className="border-none p-0 m-0 mb-4" disabled={submitting}>
          {fields.map((field) => (
            <DynamicField
              key={field.name}
              field={field}
              value={additional[field.name] ?? ''}
              onChange={(v) => setField(field.name, v)}
            />
          ))}
        </fieldset>
      )}

      {/* 自動計算建議到店時間 */}
      <ArrivalTimeNotice
        slot={slot}
        serviceLabel={serviceLabel}
        additional={additional}
      />

      {/* Errors */}
      {formError || error ? (
        <div className="p-4 rounded-lg bg-red-50 text-red-700 text-sm mb-4" role="alert">
          <p>{formError ?? error}</p>
        </div>
      ) : null}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || fieldsLoading}
        className="
          w-full px-6 py-3
          rounded-full bg-brand-navy text-white
          text-base font-semibold
          cursor-pointer
          transition-opacity duration-200
          hover:opacity-90
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {submitting ? '送出中…' : '確認預約'}
      </button>
    </form>
  );
}

function DynamicField({
  field,
  value,
  onChange,
}: {
  field: AdditionalField;
  value: string;
  onChange: (v: string) => void;
}) {
  const required = isFieldRequired(field);
  const title = field.title.replace(/\s+/g, ' ').trim();

  if (field.type === 'select') {
    const options = parseSelectValues(field.values);
    return (
      <div className="flex flex-col gap-1 mb-3">
        <span className="text-sm font-medium text-brand-charcoal">
          {title} {required ? <em className="text-red-600 not-italic">*</em> : null}
        </span>
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              aria-pressed={value === opt}
              className={`
                px-3 py-2 text-sm
                border-2 rounded-full
                cursor-pointer
                transition-all duration-150
                ${value === opt
                  ? 'border-brand-navy bg-brand-cream font-semibold'
                  : 'border-brand-creamDark bg-white hover:border-brand-gold'
                }
              `}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const isLong = title.length > 50;

  return (
    <label className="flex flex-col gap-1 mb-3">
      <span className="text-sm font-medium text-brand-charcoal">
        {title} {required ? <em className="text-red-600 not-italic">*</em> : null}
      </span>
      {isLong ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          placeholder={field.default ?? undefined}
          className="px-3 py-2 border border-brand-creamDark rounded-lg text-base
            focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold
            bg-white text-brand-charcoal resize-y"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.default ?? undefined}
          className="px-3 py-2 border border-brand-creamDark rounded-lg text-base
            focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold
            bg-white text-brand-charcoal"
        />
      )}
    </label>
  );
}

function ArrivalTimeNotice({
  slot,
  serviceLabel,
  additional,
}: {
  slot: SelectedSlot;
  serviceLabel: string;
  additional: Record<string, string>;
}) {
  const isMakeup = serviceLabel.includes('妝髮');
  if (!isMakeup) return null;

  const arrival = calculateArrivalTime(slot.time, serviceLabel, additional);
  const styleLabel = getMakeupStyleLabel(additional);

  return (
    <div className="mb-4 p-3 rounded-lg bg-brand-cream border border-brand-gold/20">
      <div className="flex items-start gap-2">
        <i className="ri-time-line text-brand-gold mt-0.5" aria-hidden />
        <div>
          {arrival ? (
            <>
              <p className="text-sm font-semibold text-brand-navy">
                建議到店時間：{slot.date}（{weekdayLabel(slot.date)}）{arrival}
              </p>
              <p className="text-xs text-brand-textMuted mt-0.5 leading-relaxed">
                拍攝時間為 {formatTime(slot.time)}，{styleLabel ? `您選擇的是「${styleLabel}」` : '含妝髮服務'}請提前到店完成造型準備。
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-brand-navy">
                請提前到店完成造型準備
              </p>
              <p className="text-xs text-brand-textMuted mt-0.5 leading-relaxed">
                拍攝時間為 {formatTime(slot.time)}，含妝髮服務建議於拍攝時間前提前到達，實際時間依所選妝髮方案而定。
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}