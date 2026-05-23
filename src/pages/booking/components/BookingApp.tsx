import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ProgressBar } from './ProgressBar';
import { ServiceStep } from './ServiceStep';
import { StoreStep } from './StoreStep';
import { SlotsView } from './SlotsView';
import { BookingForm } from './BookingForm';
import { ServiceDetailPanel } from './ServiceDetailPanel';
import { useSlotsFetch } from '../hooks/useSlotsFetch';
import { useFieldsFetch } from '../hooks/useFieldsFetch';
import {
  EXTERNAL_SERVICES,
  type ExternalService,
  type ServiceVariant,
} from '../config-services';
import {
  DAYS_AHEAD,
  SERVICES,
  STORES,
  STORAGE_KEY,
  type StoreKey,
} from '../config';
import {
  getDateRange,
  formatTime,
  submitBooking,
  calculateArrivalTime,
} from '../api';
import { getDetailKey, SERVICE_DETAILS } from '../data/service-details';
import type { ClientData, SelectedSlot } from '../types';

type WizardStep = 1 | 2 | 3 | 4;

const STEP_LABELS = ['選擇服務', '選擇分店', '選擇時段', '填寫資料'];

/* ================================================================ */
/*  BookingApp – 4-Step Wizard Orchestrator                          */
/* ================================================================ */
export function BookingApp() {
  const [step, setStep] = useState<WizardStep>(1);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([1]));

  const wizardRef = useRef<HTMLDivElement>(null);
  const prevStepRef = useRef<WizardStep>(1);

  /* Step 1 */
  const [externalService, setExternalService] = useState<ExternalService | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ServiceVariant | null>(null);

  /* Step 2 */
  const [storeKey, setStoreKey] = useState<StoreKey | null>(null);

  /* Step 3 */
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

  /* Step 4 */
  const [submitting, setSubmitting] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);

  const dateRange = useMemo(() => getDateRange(DAYS_AHEAD), []);

  /* Provider ID derived for slots fetch */
  const providerId = useMemo(() => {
    if (!selectedVariant || !storeKey) return null;
    const svc = SERVICES.find((s) => s.id === selectedVariant.simplybookId);
    return svc?.providers[storeKey] ?? null;
  }, [selectedVariant, storeKey]);

  /* Async data hooks */
  const slotsFetch = useSlotsFetch(
    selectedVariant?.simplybookId ?? null,
    providerId,
    dateRange.from,
    dateRange.to,
    step === 3,
  );

  const fieldsFetch = useFieldsFetch(
    selectedVariant?.simplybookId ?? null,
    step === 4,
  );

  /* Detail key for service detail panel */
  const detailKey = useMemo(() => {
    if (!externalService || !selectedVariant) return null;
    const variantType: 'basic' | 'makeup' =
      selectedVariant.simplybookId === externalService.variants.basic.simplybookId
        ? 'basic'
        : 'makeup';
    return getDetailKey(externalService.id, variantType);
  }, [externalService, selectedVariant]);

  /* ---------------------------------------------------------------- */
  /*  Side-effects                                                     */
  /* ---------------------------------------------------------------- */

  /* Track visited steps */
  useEffect(() => {
    setVisitedSteps((prev) => new Set([...Array.from(prev), step]));
  }, [step]);

  /* Scroll to wizard container on step change (skip initial mount) */
  useEffect(() => {
    if (!wizardRef.current) return;
    if (prevStepRef.current === step) return;
    prevStepRef.current = step;
    const headerOffset = 80;
    const top = wizardRef.current.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }, [step]);

  /* Auto-scroll to service detail panel when a variant is selected on step 1 */
  useEffect(() => {
    if (step !== 1 || !selectedVariant) return;
    const timer = setTimeout(() => {
      const el = document.getElementById('service-detail-panel');
      if (!el) return;
      const headerOffset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [step, selectedVariant]);

  /* ---------------------------------------------------------------- */
  /*  Handlers                                                         */
  /* ---------------------------------------------------------------- */

  const handleStepClick = useCallback(
    (targetStep: number) => {
      if (!visitedSteps.has(targetStep)) return;
      setStep(targetStep as WizardStep);
    },
    [visitedSteps],
  );

  const resetSlots = slotsFetch.reset;
  const resetFields = fieldsFetch.reset;

  const handleServiceSelect = useCallback(
    (service: ExternalService, variant: ServiceVariant) => {
      if (
        externalService?.id !== service.id ||
        selectedVariant?.simplybookId !== variant.simplybookId
      ) {
        setStoreKey(null);
        setSelectedSlot(null);
        setBookError(null);
        resetSlots();
        resetFields();
      }
      setExternalService(service);
      setSelectedVariant(variant);
    },
    [externalService, selectedVariant, resetSlots, resetFields],
  );

  const handleStoreSelect = useCallback(
    (key: StoreKey) => {
      if (storeKey !== key) {
        setSelectedSlot(null);
        setBookError(null);
        resetSlots();
      }
      setStoreKey(key);
      setStep(3);
    },
    [storeKey, resetSlots],
  );

  const handleSlotSelect = useCallback((slot: SelectedSlot) => {
    setSelectedSlot(slot);
    setStep(4);
  }, []);

  const handleFormBack = useCallback(() => {
    setStep(3);
  }, []);

  const handleFormSubmit = useCallback(
    async (client: ClientData, additional: Record<string, string>) => {
      if (!selectedVariant || !storeKey || !selectedSlot || !externalService) return;

      const storeLabel = STORES.find((s) => s.key === storeKey)?.label ?? '';

      // 自動將客人選擇的項目寫入 SimplyBook 預約備註
      const enrichedAdditional = { ...additional };
      const noteField = fieldsFetch.fields.find((f) => {
        const text = `${f.title} ${f.name}`.toLowerCase();
        return /備註|note|comment|memo|remarks|註記|說明/.test(text);
      });
      if (noteField) {
        const userNote = enrichedAdditional[noteField.name] ?? '';
        const systemNote = `預約項目：${externalService.title} · ${selectedVariant.label} / 分店：${storeLabel}`;
        enrichedAdditional[noteField.name] = userNote
          ? `${systemNote}${userNote}`
          : systemNote;
      }

      const svc = SERVICES.find((s) => s.id === selectedVariant.simplybookId);
      const resolvedProviderId = svc?.providers[storeKey];
      if (!resolvedProviderId) {
        setBookError('找不到該服務的攝影師資料，請重新選擇分店，或聯繫客服協助。');
        return;
      }

      setSubmitting(true);
      setBookError(null);

      try {
        const result = await submitBooking({
          serviceId: selectedVariant.simplybookId,
          providerId: resolvedProviderId,
          date: selectedSlot.date,
          time: selectedSlot.time,
          client,
          additional: enrichedAdditional,
        });

        const booking = result.bookings[0];
        if (!booking) throw new Error('預約系統暫時無法處理您的請求，請稍後再試，或聯繫官方 LINE。');

        // GA4 + Google Ads tracking
        if (window.gtag) {
          window.gtag('event', 'service_booking', {
            event_category: 'engagement',
            event_label: `${externalService.title} · ${selectedVariant.label}`,
            store: storeLabel,
          });
          window.gtag('event', 'conversion', {
            send_to: 'AW-16966416142',
          });
        }

        const summary = {
          booking,
          serviceLabel: `${externalService.title} · ${selectedVariant.label}`,
          storeLabel,
          client,
          additionalAnswers: fieldsFetch.fields.map((f) => ({
            title: f.title.replace(/\s+/g, ' ').trim(),
            value: additional[f.name] ?? '',
          })),
          arrivalTime: calculateArrivalTime(
            selectedSlot.time,
            `${externalService.title} · ${selectedVariant.label}`,
            additional,
          ),
        };

        // 存到 localStorage 並導向獨立感謝頁面（方便 GTM 追蹤）
        localStorage.setItem(STORAGE_KEY, JSON.stringify(summary));
        if (window.REACT_APP_NAVIGATE) {
          window.REACT_APP_NAVIGATE('/booking/thank-you');
        }

        // 同時從可用時段中移除已預約時段
        slotsFetch.setSlotsByDate((prev) => {
          const day = prev[selectedSlot.date] ?? [];
          return {
            ...prev,
            [selectedSlot.date]: day.filter((t) => t !== selectedSlot.time),
          };
        });
      } catch (e) {
        setBookError(e instanceof Error ? e.message : '預約提交失敗，請稍後再試，或聯繫官方 LINE。');
      } finally {
        setSubmitting(false);
      }
    },
    [selectedVariant, storeKey, selectedSlot, externalService, fieldsFetch.fields, slotsFetch.setSlotsByDate],
  );

  /* ---------------------------------------------------------------- */
  /*  Render – Wizard                                                  */
  /* ---------------------------------------------------------------- */
  return (
    <div ref={wizardRef}>
      {/* Progress Bar */}
      <ProgressBar
        currentStep={step}
        labels={STEP_LABELS}
        onStepClick={handleStepClick}
        visitedSteps={visitedSteps}
      />

      {/* Mini Summary */}
      {step >= 2 && externalService && selectedVariant && (
        <div className="mb-6 p-3 md:p-4 bg-brand-cream rounded-lg border border-brand-creamDark flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="text-brand-textMuted">已選：</span>
          <span className="font-medium text-brand-charcoal">
            {externalService.title}
          </span>
          <span className="text-brand-textMuted text-xs">·</span>
          <span className="text-brand-charcoal text-xs">{selectedVariant.label}</span>
          {storeKey && (
            <>
              <span className="text-brand-textMuted text-xs">·</span>
              <span className="text-brand-charcoal text-xs">
                {STORES.find((s) => s.key === storeKey)?.label}
              </span>
            </>
          )}
          {selectedSlot && (
            <>
              <span className="text-brand-textMuted text-xs">·</span>
              <span className="text-brand-charcoal text-xs">
                {selectedSlot.date} {formatTime(selectedSlot.time)}
              </span>
            </>
          )}
        </div>
      )}

      {/* Step Content */}
      <div className="relative">
        {step === 1 && (
          <div className="animate-step-enter">
            <ServiceStep
              selectedService={externalService}
              selectedVariant={selectedVariant}
              onSelect={handleServiceSelect}
            />
            {detailKey && SERVICE_DETAILS[detailKey] && (
              <ServiceDetailPanel
                data={SERVICE_DETAILS[detailKey]}
                serviceTitle={externalService!.title}
                variantLabel={selectedVariant!.label}
                onContinue={() => setStep(2)}
              />
            )}
          </div>
        )}

        {step === 2 && (
          <div className="animate-step-enter">
            <StoreStep
              selectedStore={storeKey}
              onSelect={handleStoreSelect}
              selectedService={externalService}
              selectedVariant={selectedVariant}
            />
          </div>
        )}

        {step === 3 && (
          <div className="animate-step-enter">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-brand-navy mb-1">
                選擇日期與時段
              </h2>
              <p className="text-sm text-brand-textMuted">
                {dateRange.from} ～ {dateRange.to}（近 {DAYS_AHEAD} 天）
              </p>
            </div>
            <SlotsView
              dates={dateRange.dates}
              slotsByDate={slotsFetch.slotsByDate}
              loading={slotsFetch.loading}
              error={slotsFetch.error}
              onSelectSlot={handleSlotSelect}
            />
          </div>
        )}

        {step === 4 && selectedVariant && selectedSlot && storeKey && externalService && (
          <div className="animate-step-enter">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="
                inline-flex items-center mb-4
                px-0 py-2 border-none bg-transparent
                text-brand-navy text-sm font-semibold
                cursor-pointer
                hover:text-brand-gold
                transition-colors
              "
            >
              ← 返回修改時段
            </button>
            <BookingForm
              serviceLabel={`${externalService.title} · ${selectedVariant.label}`}
              storeLabel={STORES.find((s) => s.key === storeKey)?.label ?? ''}
              slot={selectedSlot}
              fields={fieldsFetch.fields}
              fieldsLoading={fieldsFetch.loading}
              submitting={submitting}
              error={bookError ?? fieldsFetch.error}
              onBack={handleFormBack}
              backLabel="返回修改時段"
              onSubmit={handleFormSubmit}
              showSummary={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}