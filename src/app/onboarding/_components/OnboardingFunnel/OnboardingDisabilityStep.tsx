import {
  OnboardingDisabilityOption,
  OnboardingDisabilityOptionList,
  type OnboardingDisabilityRequirement,
} from '../OnboardingDisabilityOption';
import { DISABILITY_OPTIONS } from './OnboardingFunnel.constants';
import { OnboardingHeading } from './OnboardingHeading';

type OnboardingDisabilityStepProps = {
  onDisabilitySelect: (disabilityType: string) => void;
  onRequirementCheckedChange: (
    requirement: OnboardingDisabilityRequirement,
    checked: boolean,
  ) => void;
  selectedDisabilityTypes: string[];
  selectedRequirements: string[];
};

export function OnboardingDisabilityStep({
  onDisabilitySelect,
  onRequirementCheckedChange,
  selectedDisabilityTypes,
  selectedRequirements,
}: OnboardingDisabilityStepProps) {
  const disabilityOptions = DISABILITY_OPTIONS.map((option) => {
    const selected = selectedDisabilityTypes.includes(option.id);
    const requirements = option.requirements.map((requirement) => ({
      ...requirement,
      checked: selectedRequirements.includes(requirement.id),
    }));

    return (
      <OnboardingDisabilityOption
        key={option.id}
        label={option.label}
        icon={option.icon}
        selected={selected}
        requirements={requirements}
        onClick={() => onDisabilitySelect(option.id)}
        onRequirementCheckedChange={onRequirementCheckedChange}
      />
    );
  });

  const step = (
    <section
      className="mt-[22px] flex min-h-0 w-full flex-1 flex-col"
      aria-labelledby="disability-step-title"
    >
      <OnboardingHeading
        id="disability-step-title"
        topLine="어떤 운동환경이"
        bottomLine="필요하신가요?"
      />
      <OnboardingDisabilityOptionList
        aria-label="필요 환경"
        className="scrollbar-none mt-[20px] min-h-0 flex-1 overflow-y-auto pb-6"
      >
        {disabilityOptions}
      </OnboardingDisabilityOptionList>
    </section>
  );

  return step;
}
