import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef } from 'react';

export type OnboardingModeCardProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'children'
> & {
  title: string;
  description: string;
  selected?: boolean;
};

function CheckIcon({ selected }: { selected: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn(
        'size-6 shrink-0',
        selected ? 'text-main' : 'text-onboarding-card-border',
      )}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" />
      <path
        d="M8 12.25L10.6 14.85L16.2 9.25"
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function OnboardingModeCard({
  title,
  description,
  selected = false,
  className,
  type = 'button',
  ...props
}: OnboardingModeCardProps) {
  const icon = <CheckIcon selected={selected} />;

  const titleText = (
    <span className="flex min-h-6 items-center text-header2 text-black">
      {title}
    </span>
  );

  const header = (
    <div className="flex min-h-6 items-center gap-2.5">
      {icon}
      {titleText}
    </div>
  );

  const descriptionText = (
    <p className="mt-3 ml-0.5 w-full max-w-[289px] text-left text-body2 text-onboarding-card-description">
      {description}
    </p>
  );

  return (
    <button
      type={type}
      aria-pressed={selected}
      data-selected={selected}
      className={cn(
        'h-[112px] w-full max-w-[328px] rounded-[10px] border bg-white px-[17px] pt-[15px] pb-5 text-left outline-none transition-colors focus-visible:ring-3 focus-visible:ring-main/30',
        selected ? 'border-main' : 'border-onboarding-card-border',
        className,
      )}
      {...props}
    >
      {header}
      {descriptionText}
    </button>
  );
}
