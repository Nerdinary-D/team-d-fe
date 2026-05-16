'use client';

import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { BottomCTA } from '@/components/common/BottomCTA';
import { OnboardingProgress } from '../OnboardingProgress';
import {
  DISABILITY_OPTIONS,
  STEPS,
  initialFormState,
} from './OnboardingFunnel.constants';
import { saveOnboardingForm } from './OnboardingFunnel.storage';
import type {
  OnboardingDisabilityRequirement,
  OnboardingMode,
} from './OnboardingFunnel.types';
import { OnboardingDisabilityStep } from './OnboardingDisabilityStep';
import { OnboardingModeStep } from './OnboardingModeStep';
import { OnboardingProfileStep } from './OnboardingProfileStep';

export function OnboardingFunnel() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formState, setFormState] = useState(initialFormState);

  const currentStep = STEPS[currentStepIndex];
  const currentStepNumber = currentStepIndex + 1;
  const isLastStep = currentStepIndex === STEPS.length - 1;
  const selectedDisabilityTypes = formState.disabilityTypes ?? [];
  const canProceed =
    (currentStep === 'mode' && Boolean(formState.mode)) ||
    (currentStep === 'disability' &&
      selectedDisabilityTypes.length > 0 &&
      formState.requirements.length > 0) ||
    (currentStep === 'profile' && formState.nickname.trim().length > 0);

  const handleModeSelect = (mode: OnboardingMode) => {
    setFormState((current) => ({ ...current, mode }));
  };

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

  const handleNicknameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nickname = event.currentTarget.value;

    setFormState((current) => ({
      ...current,
      nickname,
    }));
  };

  const handleNext = () => {
    if (!canProceed) {
      return;
    }

    if (isLastStep) {
      saveOnboardingForm(formState);
      router.replace('/matches');
      return;
    }

    setCurrentStepIndex((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const progress = (
    <div className="mt-[29px]">
      <OnboardingProgress
        currentStep={currentStepNumber}
        totalSteps={STEPS.length}
      />
    </div>
  );

  const currentStepContent = {
    mode: (
      <OnboardingModeStep
        selectedMode={formState.mode}
        onModeSelect={handleModeSelect}
      />
    ),
    disability: (
      <OnboardingDisabilityStep
        selectedDisabilityTypes={selectedDisabilityTypes}
        selectedRequirements={formState.requirements}
        onDisabilitySelect={handleDisabilitySelect}
        onRequirementCheckedChange={handleRequirementCheckedChange}
      />
    ),
    profile: (
      <OnboardingProfileStep
        nickname={formState.nickname}
        onNicknameChange={handleNicknameChange}
      />
    ),
  }[currentStep];

  const ctaLabel = isLastStep ? '완료' : '다음';

  const navigation = (
    <BottomCTA type="button" disabled={!canProceed} onClick={handleNext}>
      {ctaLabel}
    </BottomCTA>
  );

  const funnel = (
    <main className="mx-auto flex h-dvh w-full max-w-[360px] flex-col overflow-hidden bg-white px-4 pb-[99px]">
      {progress}
      {currentStepContent}
      {navigation}
    </main>
  );

  return funnel;
}
