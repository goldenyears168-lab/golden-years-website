import { useBooking } from '../context/useBooking';

export function ProgressBar({ labels }: { labels: string[] }) {
  const { state, dispatch } = useBooking();

  const handleStepClick = (targetStep: number) => {
    if (!state.visitedSteps.has(targetStep)) return;
    dispatch({ type: 'GO_TO_STEP', step: targetStep });
  };

  return (
    <div className="flex items-center justify-center gap-1 md:gap-3 mb-8 md:mb-10">
      {labels.map((label, index) => {
        const step = index + 1;
        const isCompleted = step < state.step;
        const isCurrent = step === state.step;
        const isClickable =
          state.visitedSteps.has(step) &&
          (step !== 4 || state.selectedSlot != null);

        return (
          <div key={step} className="flex items-center gap-1 md:gap-3">
            <button
              type="button"
              onClick={() => isClickable && handleStepClick(step)}
              disabled={!isClickable}
              data-testid={`step-${step}`}
              className={`
                flex flex-col items-center gap-1
                bg-transparent border-none p-0
                group
                ${isClickable ? 'cursor-pointer' : 'cursor-default'}
              `}
            >
              <div
                className={`
                  w-8 h-8 md:w-10 md:h-10 rounded-full
                  flex items-center justify-center
                  text-sm md:text-base font-bold
                  transition-all duration-300
                  ${isCompleted
                    ? 'bg-brand-gold text-brand-navy shadow-sm group-hover:shadow-md group-hover:scale-110'
                    : isCurrent
                      ? 'bg-brand-navy text-white ring-4 ring-brand-navy/20'
                      : 'bg-brand-creamDark text-brand-textMuted border-2 border-brand-creamDark'
                  }
                `}
              >
                {isCompleted ? (
                  <i className="ri-check-line" />
                ) : (
                  step
                )}
              </div>
              <span
                className={`
                  text-[0.7rem] md:text-sm font-medium whitespace-nowrap
                  transition-colors duration-300
                  ${isCompleted || isCurrent ? 'text-brand-navy' : 'text-brand-textMuted'}
                  ${isClickable ? 'group-hover:text-brand-navy' : ''}
                `}
              >
                {label}
              </span>
            </button>

            {index < labels.length - 1 && (
              <div
                className={`
                  w-6 md:w-10 h-0.5 rounded-full
                  transition-all duration-300 flex-shrink-0
                  ${isCompleted ? 'bg-brand-gold' : 'bg-brand-creamDark'}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}