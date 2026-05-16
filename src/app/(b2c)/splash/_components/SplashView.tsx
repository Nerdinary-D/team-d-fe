'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LoadingDots } from '@/components/common/LoadingDots';
import { PageContainer } from '@/components/common/PageContainer';
import { ONBOARDING_STORAGE_KEY } from '@/app/onboarding/_components/OnboardingFunnel/OnboardingFunnel.constants';
import type { OnboardingFormState } from '@/app/onboarding/_components/OnboardingFunnel/OnboardingFunnel.types';
import { getClientUuid } from '@/lib/uuid';
import { mapRequirementsToCurations } from '../_curation-map';
import { useLoginCustomer } from '../_fetch';

const NEXT_ROUTE = '/';
const ONBOARDING_ROUTE = '/onboarding';

function readOnboardingRequirements(): string[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OnboardingFormState>;
    if (!Array.isArray(parsed?.requirements)) return null;
    return parsed.requirements.filter(
      (id): id is string => typeof id === 'string',
    );
  } catch {
    return null;
  }
}

export function SplashView() {
  const router = useRouter();
  const { mutate } = useLoginCustomer();
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;

    // 이미 가입된 사용자 — 서버에 재요청 없이 바로 홈으로
    if (getClientUuid()) {
      router.replace(NEXT_ROUTE);
      return;
    }

    const requirements = readOnboardingRequirements();
    if (requirements === null) {
      router.replace(ONBOARDING_ROUTE);
      return;
    }

    const curations = mapRequirementsToCurations(requirements);

    mutate(
      { curations },
      {
        onSuccess: () => {
          router.replace(NEXT_ROUTE);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : '시작 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.',
          );
        },
      },
    );
  }, [mutate, router]);

  return (
    <PageContainer className="flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-semibold text-gray-800">All Ground</h1>
      <LoadingDots size="lg" />
    </PageContainer>
  );
}
