import type { OnboardingDisabilityRequirement } from '../OnboardingDisabilityOption';

export type OnboardingMode = 'owner' | 'user';
export type OnboardingStep = 'mode' | 'disability' | 'profile';

export type DisabilityOption = {
  id: string;
  label: string;
  icon: string;
  requirements: OnboardingDisabilityRequirement[];
};

export type OnboardingFormState = {
  disabilityTypes: string[];
  mode?: OnboardingMode;
  nickname: string;
  requirements: string[];
};
