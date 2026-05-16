'use client';

import {
  DISABILITY_OPTIONS,
  initialFormState,
} from '@/app/onboarding/_components/OnboardingFunnel/OnboardingFunnel.constants';
import { OnboardingDisabilityStep } from '@/app/onboarding/_components/OnboardingFunnel/OnboardingDisabilityStep';
import type { OnboardingDisabilityRequirement } from '@/app/onboarding/_components/OnboardingFunnel/OnboardingFunnel.types';
import { mapRequirementsToCurations } from '@/api/customer-preferences';
import { BottomCTA } from '@/components/common/BottomCTA';
import { toast } from '@/components/common/Toast';
import { useState } from 'react';
import { useUpdateCustomerCurations } from '../_fetch';

export type MyFilterChangeViewProps = {
  uuid: string;
  onClose: () => void;
  onSaved?: (selectedDisabilityTypes: string[]) => void;
};

export function MyFilterChangeView({
  uuid,
  onClose,
  onSaved,
}: MyFilterChangeViewProps) {
  const [formState, setFormState] = useState(initialFormState);
  const selectedDisabilityTypes = formState.disabilityTypes ?? [];
  const updateCurations = useUpdateCustomerCurations(uuid);
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

  const handleSubmit = () => {
    if (!uuid || !canProceed || updateCurations.isPending) return;

    const curations = mapRequirementsToCurations(formState.requirements);
    updateCurations.mutate(
      { curations },
      {
        onSuccess: () => {
          toast.success('필터 설정이 완료되었어요!');
          onSaved?.(selectedDisabilityTypes);
          onClose();
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : '필터 설정에 실패했어요. 잠시 후 다시 시도해주세요.',
          );
        },
      },
    );
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

  const cta = (
    <BottomCTA
      disabled={!canProceed || updateCurations.isPending}
      onClick={handleSubmit}
    >
      {updateCurations.isPending ? '저장 중...' : '다음'}
    </BottomCTA>
  );

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
