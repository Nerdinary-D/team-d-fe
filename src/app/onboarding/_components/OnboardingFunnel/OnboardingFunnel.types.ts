export type OnboardingMode = 'owner' | 'user';
export type OnboardingStep = 'mode' | 'disability' | 'profile';

export type OnboardingDisabilityRequirement = {
  id: string;
  label: string;
  checked?: boolean;
};

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
