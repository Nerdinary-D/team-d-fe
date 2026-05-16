import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef } from 'react';
import type { OnboardingDisabilityRequirement } from '../OnboardingFunnel/OnboardingFunnel.types';

export type OnboardingDisabilityOptionProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'children'
> & {
  label: string;
  icon?: string;
  onRequirementCheckedChange?: (
    requirement: OnboardingDisabilityRequirement,
    checked: boolean,
  ) => void;
  requirements?: OnboardingDisabilityRequirement[];
  selected?: boolean;
};

function CheckboxIcon({ checked = false }: { checked?: boolean }) {
  const checkboxIcon = (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className={cn(
        'size-4 shrink-0',
        checked ? 'text-main' : 'text-onboarding-card-border',
      )}
    >
      <path
        d="M12.5 1.5H3.5C2.96974 1.50058 2.46137 1.71148 2.08643 2.08643C1.71148 2.46137 1.50058 2.96974 1.5 3.5V12.5C1.50058 13.0303 1.71148 13.5386 2.08643 13.9136C2.46137 14.2885 2.96974 14.4994 3.5 14.5H12.5C13.0303 14.4994 13.5386 14.2885 13.9136 13.9136C14.2885 13.5386 14.4994 13.0303 14.5 12.5V3.5C14.4994 2.96974 14.2885 2.46137 13.9136 2.08643C13.5386 1.71148 13.0303 1.50058 12.5 1.5ZM11.3828 5.82156L7.18281 10.8216C7.13674 10.8764 7.07941 10.9208 7.01471 10.9516C6.95001 10.9823 6.87945 10.9989 6.80781 11H6.79938C6.72929 11 6.66 10.9852 6.59599 10.9567C6.53198 10.9282 6.47468 10.8865 6.42781 10.8344L4.62781 8.83438C4.5821 8.78589 4.54654 8.72876 4.52322 8.66633C4.4999 8.60391 4.4893 8.53745 4.49203 8.47087C4.49477 8.40429 4.51078 8.33892 4.53914 8.27862C4.56749 8.21831 4.60761 8.16429 4.65715 8.11971C4.70668 8.07514 4.76462 8.04091 4.82757 8.01905C4.89052 7.99719 4.95721 7.98813 5.02371 7.9924C5.09021 7.99668 5.15518 8.01421 5.21481 8.04396C5.27444 8.0737 5.32752 8.11507 5.37094 8.16562L6.78625 9.73812L10.6172 5.17844C10.7031 5.07909 10.8247 5.01754 10.9556 5.00711C11.0866 4.99668 11.2164 5.03819 11.317 5.12268C11.4175 5.20716 11.4808 5.32784 11.4931 5.45862C11.5055 5.5894 11.4658 5.71977 11.3828 5.82156Z"
        fill="currentColor"
      />
    </svg>
  );

  return checkboxIcon;
}

export function OnboardingDisabilityOption({
  label,
  icon = '🧠',
  onRequirementCheckedChange,
  requirements = [],
  selected = false,
  className,
  disabled,
  type = 'button',
  ...props
}: OnboardingDisabilityOptionProps) {
  const hasRequirements = selected && requirements.length > 0;

  const iconText = (
    <span
      aria-hidden
      className="shrink-0 text-subtitle1 text-onboarding-card-description"
    >
      {icon}
    </span>
  );

  const labelText = (
    <span
      className={cn(
        'shrink-0 text-subtitle1',
        selected ? 'text-main' : 'text-onboarding-card-description',
      )}
    >
      {label}
    </span>
  );

  const header = (
    <span className="flex min-h-[22px] min-w-0 items-center gap-[13px] whitespace-nowrap">
      {iconText}
      {labelText}
    </span>
  );

  const requirementItems = requirements.map((requirement) => {
    const checked = Boolean(requirement.checked);
    const checkbox = (
      <span className="flex h-[23px] shrink-0 items-center">
        <CheckboxIcon checked={requirement.checked} />
      </span>
    );

    const requirementText = (
      <span
        className={cn(
          'min-w-0 flex-1 break-keep text-subtitle1 leading-[23px]',
          checked ? 'text-main' : 'text-onboarding-disabled-text',
        )}
      >
        {requirement.label}
      </span>
    );

    return (
      <button
        key={requirement.id}
        type="button"
        aria-pressed={checked}
        disabled={disabled}
        className="flex min-h-[23px] w-full min-w-0 items-start gap-2.5 rounded-sm text-left outline-none focus-visible:ring-3 focus-visible:ring-main/30 disabled:pointer-events-none disabled:opacity-50"
        onClick={() => onRequirementCheckedChange?.(requirement, !checked)}
      >
        {checkbox}
        {requirementText}
      </button>
    );
  });

  const requirementsList = hasRequirements ? (
    <div className="flex w-full min-w-0 flex-col gap-[19px] px-2.5">
      {requirementItems}
    </div>
  ) : null;

  const nodeId = (() => {
    if (hasRequirements) {
      return '5324:128';
    }

    return selected ? '5324:103' : '5324:107';
  })();

  const cardClassName = cn(
    'flex w-full max-w-[328px] shrink-0 rounded-[10px] border bg-white text-left outline-none transition-colors focus-visible:ring-3 focus-visible:ring-main/30',
    hasRequirements
      ? 'h-auto flex-col items-start gap-[19px] px-5 py-5'
      : 'h-[60px] items-center px-[22px]',
    selected ? 'border-main' : 'border-onboarding-card-border',
    className,
  );

  const headerButton = (
    <button
      type={type}
      aria-pressed={selected}
      disabled={disabled}
      className={cn(
        hasRequirements
          ? 'rounded-sm text-left outline-none focus-visible:ring-3 focus-visible:ring-main/30 disabled:pointer-events-none disabled:opacity-50'
          : cardClassName,
      )}
      {...props}
    >
      {header}
    </button>
  );

  if (hasRequirements) {
    const selectedOption = (
      <div
        role="group"
        aria-label={`${label} 체크리스트`}
        data-selected={selected}
        data-node-id={nodeId}
        className={cardClassName}
      >
        {headerButton}
        {requirementsList}
      </div>
    );

    return selectedOption;
  }

  const optionButton = (
    <button
      type={type}
      aria-pressed={selected}
      disabled={disabled}
      data-selected={selected}
      data-node-id={nodeId}
      className={cardClassName}
      {...props}
    >
      {header}
    </button>
  );

  return optionButton;
}

export type OnboardingDisabilityOptionListProps =
  ComponentPropsWithoutRef<'div'>;

export function OnboardingDisabilityOptionList({
  className,
  ...props
}: OnboardingDisabilityOptionListProps) {
  const optionList = (
    <div
      data-node-id="5324:102"
      className={cn('flex w-full max-w-[328px] flex-col gap-2.5', className)}
      {...props}
    />
  );

  return optionList;
}
