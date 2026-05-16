'use client';

import {
  DISABILITY_OPTIONS,
  initialFormState,
} from '@/app/onboarding/_components/OnboardingFunnel/OnboardingFunnel.constants';
import { OnboardingDisabilityStep } from '@/app/onboarding/_components/OnboardingFunnel/OnboardingDisabilityStep';
import type { OnboardingDisabilityRequirement } from '@/app/onboarding/_components/OnboardingFunnel/OnboardingFunnel.types';
import { BottomCTA } from '@/components/common/BottomCTA';
import { useState } from 'react';

export function MyFilterChangeView() {
  const [formState, setFormState] = useState(initialFormState);
  const selectedDisabilityTypes = formState.disabilityTypes ?? [];
  const canProceed =
    selectedDisabilityTypes.length > 0 && formState.requirements.length > 0;

  const handleDisabilitySelect = (disabilityType: string) => {
    const optionRequirementIds =
      DISABILITY_OPTIONS.find(
        (option) => option.id === disabilityType,
      )?.requirements.map((requirement) => requirement.id) ?? [];

    setFormState((current) => {
      const currentDisabilityTypes = current.disabilityTypes ?? [];
      const isSelected = currentDisabilityTypes.includes(disabilityType);
      const disabilityTypes = isSelected
        ? currentDisabilityTypes.filter((id) => id !== disabilityType)
        : [...currentDisabilityTypes, disabilityType];
      const requirements = isSelected
        ? current.requirements.filter(
            (id) => !optionRequirementIds.includes(id),
          )
        : current.requirements;

      return {
        ...current,
        disabilityTypes,
        requirements,
      };
    });
  };

  const handleRequirementCheckedChange = (
    requirement: OnboardingDisabilityRequirement,
    checked: boolean,
  ) => {
    setFormState((current) => {
      const requirements = checked
        ? [...current.requirements, requirement.id]
        : current.requirements.filter((id) => id !== requirement.id);

      return { ...current, requirements };
    });
  };

  const filterStep = (
    <OnboardingDisabilityStep
      selectedDisabilityTypes={selectedDisabilityTypes}
      selectedRequirements={formState.requirements}
      onDisabilitySelect={handleDisabilitySelect}
      onRequirementCheckedChange={handleRequirementCheckedChange}
    />
  );

  const cta = <BottomCTA disabled={!canProceed}>다음</BottomCTA>;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="my-filter-change-title"
      className="fixed inset-0 z-30 mx-auto flex w-full max-w-[360px] flex-col bg-white px-4"
    >
      <div id="my-filter-change-title" className="sr-only">
        필터 변경
      </div>
      {filterStep}
      {cta}
    </div>
  );
}
