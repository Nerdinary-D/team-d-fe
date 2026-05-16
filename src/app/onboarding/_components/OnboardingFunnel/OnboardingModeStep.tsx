import { MODE_OPTIONS } from './OnboardingFunnel.constants';
import type { OnboardingMode } from './OnboardingFunnel.types';
import { OnboardingHeading } from './OnboardingHeading';
import { OnboardingModeCard } from '../OnboardingModeCard';

type OnboardingModeStepProps = {
  onModeSelect: (mode: OnboardingMode) => void;
  selectedMode?: OnboardingMode;
};

export function OnboardingModeStep({
  onModeSelect,
  selectedMode,
}: OnboardingModeStepProps) {
  const modeCards = MODE_OPTIONS.map((option) => (
    <OnboardingModeCard
      key={option.id}
      aria-label={option.title}
      title={option.title}
      description={option.description}
      selected={selectedMode === option.id}
      onClick={() => onModeSelect(option.id)}
    />
  ));

  const step = (
    <section
      className="mt-[22px] flex w-full flex-col"
      aria-labelledby="mode-step-title"
    >
      <OnboardingHeading
        id="mode-step-title"
        topLine="어떤 모드로"
        bottomLine="올그라운드를 이용할까요?"
      />
      <div className="mt-[20px] flex w-full flex-col gap-6">{modeCards}</div>
    </section>
  );

  return step;
}
