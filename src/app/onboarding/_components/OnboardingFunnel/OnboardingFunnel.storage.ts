import { ONBOARDING_STORAGE_KEY } from './OnboardingFunnel.constants';
import type { OnboardingFormState } from './OnboardingFunnel.types';

export function saveOnboardingForm(formState: OnboardingFormState) {
  window.localStorage.setItem(
    ONBOARDING_STORAGE_KEY,
    JSON.stringify({
      ...formState,
      nickname: formState.nickname.trim(),
      completedAt: new Date().toISOString(),
    }),
  );
}
