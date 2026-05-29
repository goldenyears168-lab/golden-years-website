import { useBooking } from '../context/useBooking';
import type { ServiceDetailData } from '../data/service-details';

export function ServiceDetailPanel({ data }: { data: ServiceDetailData }) {
  const { state, dispatch } = useBooking();
  const serviceTitle = state.externalService?.title ?? '';
  const variantLabel = state.selectedVariant?.label ?? '';

  return (
    <div id="service-detail-panel" className="mt-6 md:mt-8 rounded-xl border border-brand-navy/8 overflow-hidden bg-white">
      {/* Header */}
      <div className="px-4 md:px-6 py-4 md:py-5 bg-brand-cream/60 border-b border-brand-navy/8">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-xs md:text-sm font-medium text-brand-navy">
            {serviceTitle}
          </span>
          <span className="text-xs text-brand-textMuted">·</span>
          <span className="text-xs md:text-sm font-medium text-brand-gold">
            {variantLabel}
          </span>
        </div>
        <h3 className="font-serif text-xl md:text-2xl font-bold text-brand-navy leading-snug">
          {serviceTitle}｜{variantLabel}
        </h3>
        {data.notice && (
          <p className="mt-2 text-xs md:text-sm text-brand-gold font-medium">
            {data.notice}
          </p>
        )}
      </div>

      {/* Content sections */}
      <div className="px-4 md:px-6 py-4 md:py-5 space-y-5">
        {data.sections.map((section) => (
          <div key={section.title}>
            <h4 className="text-sm md:text-base font-semibold text-brand-navy mb-2">
              {section.title}
            </h4>
            <div className="text-sm text-brand-charcoal leading-relaxed whitespace-pre-line bg-brand-cream/30 rounded-lg p-3 md:p-4">
              {section.content}
            </div>
          </div>
        ))}
      </div>

      {/* Footer action */}
      <div className="px-4 md:px-6 py-4 md:py-5 bg-brand-cream/40 border-t border-brand-navy/8 flex justify-center">
        <button
          type="button"
          onClick={() => dispatch({ type: 'GO_TO_STEP', step: 2 })}
          data-testid="confirm-service"
          className="inline-flex items-center gap-2 px-12 py-2.5 md:px-16 md:py-3 bg-brand-navy text-white text-sm font-medium rounded-lg hover:bg-brand-navy/90 transition-colors cursor-pointer whitespace-nowrap"
        >
          確認並繼續
          <i className="ri-arrow-right-line" />
        </button>
      </div>
    </div>
  );
}