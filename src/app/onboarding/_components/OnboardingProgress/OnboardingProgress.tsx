import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef } from 'react';

export type OnboardingProgressProps = ComponentPropsWithoutRef<'div'> & {
  currentStep?: number;
  totalSteps?: number;
};

export function OnboardingProgress({
  currentStep = 1,
  totalSteps = 3,
  className,
  ...props
}: OnboardingProgressProps) {
  const segmentCount = Math.max(totalSteps, 1);
  const safeCurrentStep = Math.min(Math.max(currentStep, 1), segmentCount);

  const segments = Array.from({ length: segmentCount }, (_, index) => {
    const isActive = index < safeCurrentStep;

    return (
      <div
        key={index}
        aria-hidden
        className={cn(
          'h-1 min-w-0 flex-1 rounded-[40px]',
          isActive ? 'bg-main' : 'bg-onboarding-progress-inactive',
        )}
      />
    );
  });

  const progressBar = (
    <div
      aria-hidden
      data-node-id="5320:63"
      className="flex w-full items-center gap-2.5"
    >
      {segments}
    </div>
  );

  const stepLabel = (
    <p
      data-node-id="5320:62"
      className={cn(
        'text-subtitle1 whitespace-nowrap',
        safeCurrentStep === segmentCount
          ? 'text-main'
          : 'text-onboarding-progress-total',
      )}
    >
      <span className="text-main">{safeCurrentStep}</span>
      <span>/{segmentCount}</span>
    </p>
  );

  return (
    <div
      aria-label={`${safeCurrentStep}/${segmentCount} 단계`}
      className={cn('flex w-full max-w-[328px] flex-col gap-2', className)}
      {...props}
    >
      {progressBar}
      <div className="flex justify-end">{stepLabel}</div>
    </div>
  );
}
