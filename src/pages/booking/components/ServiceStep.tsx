import { useState } from 'react';
import { EXTERNAL_SERVICES, type ExternalService, type ServiceVariant } from '../config-services';
import { LINE_OFFICIAL_URL } from '../config';

type Props = {
  selectedService: ExternalService | null;
  selectedVariant: ServiceVariant | null;
  onSelect: (service: ExternalService, variant: ServiceVariant) => void;
};

type Grouped = {
  categoryId: string;
  categoryLabel: string;
  categoryIcon: string;
  services: ExternalService[];
};

function groupByCategory(services: ExternalService[]): Grouped[] {
  const map = new Map<string, Grouped>();
  for (const s of services) {
    const existing = map.get(s.categoryId);
    if (existing) {
      existing.services.push(s);
    } else {
      map.set(s.categoryId, {
        categoryId: s.categoryId,
        categoryLabel: s.categoryLabel,
        categoryIcon: s.categoryIcon,
        services: [s],
      });
    }
  }
  return Array.from(map.values());
}

export function ServiceStep({ selectedService, selectedVariant, onSelect }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(
    selectedService?.id ?? null,
  );

  const handleCardClick = (service: ExternalService) => {
    if (service.isLineRedirect && service.lineUrl) {
      window.open(service.lineUrl, '_blank');
      return;
    }
    setExpandedId((prev) => (prev === service.id ? null : service.id));
  };

  const handleVariantSelect = (
    service: ExternalService,
    variant: ServiceVariant,
  ) => {
    onSelect(service, variant);
  };

  const bookableServices = EXTERNAL_SERVICES.filter((s) => !s.isLineRedirect);
  const grouped = groupByCategory(bookableServices);

  return (
    <div className="space-y-6 md:space-y-8">
      {grouped.map((group) => (
        <div key={group.categoryId}>
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <div className="w-7 h-7 flex items-center justify-center bg-brand-navy rounded-md">
              <i className={`${group.categoryIcon} text-white text-xs`} />
            </div>
            <h3 className="text-sm md:text-base font-semibold text-brand-navy">
              {group.categoryLabel}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {group.services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isExpanded={expandedId === service.id}
                isSelected={
                  selectedService?.id === service.id && selectedVariant !== null
                }
                selectedVariantLabel={
                  selectedService?.id === service.id
                    ? selectedVariant?.label
                    : undefined
                }
                onCardClick={() => handleCardClick(service)}
                onVariantSelect={(variant) =>
                  handleVariantSelect(service, variant)
                }
              />
            ))}
          </div>
        </div>
      ))}

      {/* 企業團體合作獨立 CTA */}
      <div className="rounded-xl border border-brand-gold/20 bg-brand-cream/40 p-4 md:p-5 text-center">
        <p className="text-sm text-brand-textMuted mb-3">
          有團體或企業拍攝需求？我們提供專案報價與客製化服務
        </p>
        <a
          href={LINE_OFFICIAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-navy text-white text-sm font-medium hover:bg-brand-navy/90 transition-colors"
        >
          <i className="ri-chat-1-line" />
          LINE 洽詢專案報價
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ServiceCard                                                        */
/* ------------------------------------------------------------------ */
function ServiceCard({
  service,
  isExpanded,
  isSelected,
  selectedVariantLabel,
  onCardClick,
  onVariantSelect,
}: {
  service: ExternalService;
  isExpanded: boolean;
  isSelected: boolean;
  selectedVariantLabel?: string;
  onCardClick: () => void;
  onVariantSelect: (variant: ServiceVariant) => void;
}) {
  return (
    <div
      className={`
        flex flex-col
        bg-white rounded-lg border-2 overflow-hidden transition-all duration-300
        ${isSelected ? 'border-brand-navy shadow-md' : 'border-brand-creamDark hover:border-brand-gold/50'}
      `}
    >
      {/* Top bar: image + text */}
      <button
        type="button"
        onClick={onCardClick}
        className="
          flex items-center gap-2 sm:gap-3 md:gap-4 p-2.5 sm:p-3 md:p-4
          bg-white border-none cursor-pointer text-left
        "
      >
        {/* Image */}
        <div className="relative w-16 aspect-[3/4] sm:w-20 md:w-28 lg:w-36 flex-shrink-0 rounded-lg overflow-hidden bg-brand-cream">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
          {service.isLineRedirect && (
            <div className="absolute inset-0 bg-brand-navy/80 flex items-center justify-center">
              <span className="text-white text-xs font-bold leading-tight text-center px-1">LINE<br/>洽詢</span>
            </div>
          )}
          {isSelected && (
            <div className="absolute inset-0 bg-brand-navy/30 flex items-center justify-center">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-brand-navy text-white flex items-center justify-center">
                <i className="ri-check-line text-sm" />
              </div>
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm sm:text-base md:text-lg font-bold text-brand-navy leading-snug">
            {service.title}
          </h4>
          <p className="text-xs sm:text-sm text-brand-textMuted mt-1 leading-snug hidden sm:block truncate">
            {service.subtitle}
          </p>
          <p className="text-xs text-brand-gold font-semibold mt-1">
            ${service.priceFrom.toLocaleString()} 起
          </p>
        </div>
      </button>

      {/* Expandable variants */}
      {isExpanded && !service.isLineRedirect && (
        <div className="px-3 pb-3 sm:px-4 sm:pb-4 border-t border-brand-creamDark space-y-2 pt-2.5">
          <p className="text-xs text-brand-textMuted mb-1">選擇方案：</p>
          <button
            type="button"
            onClick={() => onVariantSelect(service.variants.basic)}
            className={`
              w-full px-3 py-2.5 sm:py-3 rounded-md border-2 text-sm font-medium
              transition-all duration-150 cursor-pointer
              ${selectedVariantLabel === service.variants.basic.label
                ? 'border-brand-navy bg-brand-cream text-brand-navy'
                : 'border-brand-creamDark bg-white text-brand-charcoal hover:border-brand-gold'
              }
            `}
          >
            {service.variants.basic.label}
          </button>
          <button
            type="button"
            onClick={() => onVariantSelect(service.variants.makeup)}
            className={`
              w-full px-3 py-2.5 sm:py-3 rounded-md border-2 text-sm font-medium
              transition-all duration-150 cursor-pointer
              ${selectedVariantLabel === service.variants.makeup.label
                ? 'border-brand-navy bg-brand-cream text-brand-navy'
                : 'border-brand-creamDark bg-white text-brand-charcoal hover:border-brand-gold'
              }
            `}
          >
            {service.variants.makeup.label}
          </button>
        </div>
      )}

      {/* Selected indicator */}
      {isSelected && !isExpanded && (
        <div className="px-3 pb-3 sm:px-4 sm:pb-4 border-t border-brand-creamDark pt-2">
          <span className="text-xs text-brand-gold font-medium">
            <i className="ri-check-fill mr-1" />
            {selectedVariantLabel}
          </span>
        </div>
      )}
    </div>
  );
}