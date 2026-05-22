import { STORE_IMAGES, type ExternalService } from '../config-services';
import type { ServiceVariant } from '../config-services';
import type { StoreKey } from '../config';

type Props = {
  selectedStore: StoreKey | null;
  onSelect: (storeKey: StoreKey) => void;
  selectedService?: ExternalService | null;
  selectedVariant?: ServiceVariant | null;
};

export function StoreStep({ selectedStore, onSelect, selectedService, selectedVariant }: Props) {
  const stores = Object.entries(STORE_IMAGES) as [StoreKey, typeof STORE_IMAGES[StoreKey]][];

  return (
    <div>
      {/* Mini header */}
      {selectedService && (
        <div className="mb-4 text-center">
          <p className="text-sm text-brand-textMuted">
            已選擇：
            <span className="font-medium text-brand-charcoal">
              {selectedService.title}
            </span>
            {selectedVariant && (
              <>
                <span className="text-brand-textMuted mx-1">·</span>
                <span className="text-brand-gold font-medium">
                  {selectedVariant.label}
                </span>
              </>
            )}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 max-w-3xl mx-auto">
        {stores.map(([key, data]) => {
          const active = selectedStore === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              className={`
                group flex flex-col
                bg-white rounded-xl border-2 overflow-hidden
                transition-all duration-300 text-left
                ${active
                  ? 'border-brand-navy shadow-md'
                  : 'border-brand-creamDark hover:border-brand-gold/50 hover:shadow-sm'
                }
                cursor-pointer p-0
              `}
            >
              {/* Tiny top image */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-brand-cream">
                <img
                  src={data.image}
                  alt={data.label}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/5" />
                {active && (
                  <div className="absolute inset-0 bg-brand-navy/20 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-brand-navy text-white flex items-center justify-center">
                      <i className="ri-check-line text-sm" />
                    </div>
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="p-2.5 sm:p-3">
                <h4 className="text-sm sm:text-base font-bold text-brand-navy mb-0.5 truncate">
                  {data.label}
                </h4>
                <p className="text-xs text-brand-textMuted leading-snug line-clamp-2">
                  {data.address}
                </p>
                <p className="text-xs text-brand-gold mt-1 truncate">
                  <i className="ri-subway-line mr-0.5" />
                  {data.transport}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-brand-textMuted mt-4">
        點選分店後將自動進入下一步
      </p>
    </div>
  );
}