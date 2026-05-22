type Props = {
  currentStep: number;
  labels: string[];
  onStepClick?: (step: number) => void;
  visitedSteps?: Set<number>;
};

export function ProgressBar({ currentStep, labels, onStepClick, visitedSteps }: Props) {
  return (
    <div className="flex items-center justify-center gap-1 md:gap-3 mb-8 md:mb-10">
      {labels.map((label, index) => {
        const step = index + 1;
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;
        const isClickable = onStepClick !== undefined && (visitedSteps?.has(step) ?? step === 1);

        return (
          <div key={step} className="flex items-center gap-1 md:gap-3">
            <button
              type="button"
              onClick={() => isClickable && onStepClick?.(step)}
              disabled={!isClickable}
              className={`
                flex flex-col items-center gap-1
                bg-transparent border-none p-0
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
                    ? 'bg-brand-gold text-brand-navy'
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
                  ${isCompleted || isCurrent ? 'text-brand-navy' : 'text-brand-textMuted'}
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