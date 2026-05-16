'use client';

import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { BottomCTA } from '@/components/common/BottomCTA';
import { toast } from '@/components/common/Toast';
import { getOrCreateClientUuid, setClientUuid } from '@/lib/uuid';
import { mapRequirementsToCustomerCurations } from '../../_curation-map';
import { useCreateCustomer } from '../../_fetch';
import { OnboardingProgress } from '../OnboardingProgress';
import {
  DISABILITY_OPTIONS,
  ONBOARDING_PROGRESS_STEP_COUNT,
  STEPS,
  initialFormState,
} from './OnboardingFunnel.constants';
import { saveOnboardingForm } from './OnboardingFunnel.storage';
import type {
  OnboardingDisabilityRequirement,
  OnboardingMode,
} from './OnboardingFunnel.types';
import { OnboardingCompleteStep } from './OnboardingCompleteStep';
import { OnboardingDisabilityStep } from './OnboardingDisabilityStep';
import { OnboardingModeStep } from './OnboardingModeStep';
import { OnboardingProfileStep } from './OnboardingProfileStep';

const OWNER_GROUND_REGISTRATION_ROUTE = '/grounds/new';
const USER_HOME_ROUTE = '/';

export function OnboardingFunnel() {
  const router = useRouter();
  const createCustomer = useCreateCustomer();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formState, setFormState] = useState(initialFormState);

  const currentStep = STEPS[currentStepIndex];
  const currentStepNumber = Math.min(
    currentStepIndex + 1,
    ONBOARDING_PROGRESS_STEP_COUNT,
  );
  const isModeStep = currentStep === 'mode';
  const isCompleteStep = currentStep === 'complete';
  const isProfileStep = currentStep === 'profile';
  const selectedDisabilityTypes = formState.disabilityTypes ?? [];
  const canProceed =
    isCompleteStep ||
    (currentStep === 'mode' && Boolean(formState.mode)) ||
    (currentStep === 'disability' &&
      selectedDisabilityTypes.length > 0 &&
      formState.requirements.length > 0) ||
    (isProfileStep && formState.nickname.trim().length > 0);
  const isSubmittingCustomer = isCompleteStep && createCustomer.isPending;
  const canClickCTA = canProceed && !isSubmittingCustomer;

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
    if (!canClickCTA) {
      return;
    }

    if (isModeStep && formState.mode === 'owner') {
      getOrCreateClientUuid();
      router.replace(OWNER_GROUND_REGISTRATION_ROUTE);
      return;
    }

    if (isCompleteStep) {
      getOrCreateClientUuid();
      createCustomer.mutate(
        {
          nickname: formState.nickname.trim(),
          curations: mapRequirementsToCustomerCurations(formState.requirements),
        },
        {
          onSuccess: (result) => {
            setClientUuid(result.uuid);
            router.replace(USER_HOME_ROUTE);
          },
          onError: (error) => {
            toast.error(
              error instanceof Error
                ? error.message
                : '고객 정보를 생성하지 못했어요. 잠시 후 다시 시도해주세요.',
            );
          },
        },
      );
      return;
    }

    if (isProfileStep) {
      saveOnboardingForm(formState);
      setCurrentStepIndex((current) => Math.min(current + 1, STEPS.length - 1));
      return;
    }

    setCurrentStepIndex((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const progress = (
    <div className="mt-[29px]">
      <OnboardingProgress
        currentStep={currentStepNumber}
        totalSteps={ONBOARDING_PROGRESS_STEP_COUNT}
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
    complete: <OnboardingCompleteStep />,
  }[currentStep];

  const ctaLabel = isCompleteStep
    ? isSubmittingCustomer
      ? '시작 중'
      : '시작하기'
    : isProfileStep
      ? '완료'
      : '다음';

  const navigation = (
    <BottomCTA type="button" disabled={!canClickCTA} onClick={handleNext}>
      {ctaLabel}
    </BottomCTA>
  );

  const funnel = (
    <main className="relative mx-auto flex h-dvh w-full max-w-[360px] flex-col overflow-hidden bg-white px-4 pb-[99px]">
      {!isCompleteStep && progress}
      {currentStepContent}
      {navigation}
    </main>
  );

  return funnel;
}
