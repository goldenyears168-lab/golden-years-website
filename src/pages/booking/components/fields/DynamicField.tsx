import { isFieldRequired } from '../../api';
import type { AdditionalField } from '../../types';

type Props = {
  field: AdditionalField;
  value: string;
  onChange: (v: string) => void;
};

export default function DynamicField({ field, value, onChange }: Props) {
  const required = isFieldRequired(field);
  const title = field.title.replace(/\s+/g, ' ').trim();

  if (field.type === 'textarea') {
    return (
      <label className="flex flex-col gap-2 mb-5">
        <span className="text-sm font-medium text-brand-charcoal">
          {title} {required ? <em className="text-red-600 not-italic">*</em> : null}
        </span>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder={field.default ?? undefined}
          className="px-3 py-2 border-2 border-gray-300 rounded-lg text-base
            focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold
            bg-white text-brand-charcoal resize-y"
        />
      </label>
    );
  }

  if (field.type === 'select') {
    const options = field.values ?? [];
    return (
      <div className="flex flex-col gap-2 mb-5">
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
    <label className="flex flex-col gap-2 mb-5">
      <span className="text-sm font-medium text-brand-charcoal">
        {title} {required ? <em className="text-red-600 not-italic">*</em> : null}
      </span>
      {isLong ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          placeholder={field.default ?? undefined}
          className="px-3 py-2 border-2 border-gray-300 rounded-lg text-base
            focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold
            bg-white text-brand-charcoal resize-y"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.default ?? undefined}
          className="px-3 py-2 border-2 border-gray-300 rounded-lg text-base
            focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold
            bg-white text-brand-charcoal"
        />
      )}
    </label>
  );
}