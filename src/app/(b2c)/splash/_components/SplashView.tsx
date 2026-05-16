'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PageContainer } from '@/components/common/PageContainer';
import { ONBOARDING_STORAGE_KEY } from '@/app/onboarding/_components/OnboardingFunnel/OnboardingFunnel.constants';
import type { OnboardingFormState } from '@/app/onboarding/_components/OnboardingFunnel/OnboardingFunnel.types';
import { getClientUuid } from '@/lib/uuid';
import { mapRequirementsToCurations } from '../_curation-map';
import { useLoginCustomer } from '../_fetch';

const NEXT_ROUTE = '/';
const ONBOARDING_ROUTE = '/onboarding';

type OnboardingSignupPayload = {
  nickname: string;
  requirements: string[];
};

function readOnboardingPayload(): OnboardingSignupPayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OnboardingFormState>;
    if (!Array.isArray(parsed?.requirements)) return null;
    if (typeof parsed.nickname !== 'string' || parsed.nickname.length === 0) {
      return null;
    }
    return {
      nickname: parsed.nickname,
      requirements: parsed.requirements.filter(
        (id): id is string => typeof id === 'string',
      ),
    };
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

    const payload = readOnboardingPayload();
    if (payload === null) {
      router.replace(ONBOARDING_ROUTE);
      return;
    }

    const curations = mapRequirementsToCurations(payload.requirements);

    mutate(
      { nickname: payload.nickname, curations },
      {
        onSuccess: () => {
          window.location.assign(NEXT_ROUTE);
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

  const logoMark = (
    <Image
      alt=""
      aria-label="ALL GROUND"
      className="absolute left-[26px] top-[152px] h-[104.001px] w-[246.307px]"
      draggable={false}
      height={104}
      role="img"
      src="/images/splash/logo.svg"
      width={247}
    />
  );
  const tagline = (
    <p className="absolute left-[30px] top-[278px] whitespace-nowrap text-header2 text-white">
      장애인 생활체육 안심 네트워크 플랫폼
    </p>
  );
  const splashScreen = (
    <div className="relative mx-auto h-full min-h-[740px] w-full max-w-[360px] overflow-hidden">
      <h1 className="sr-only">ALL GROUND</h1>
      {logoMark}
      {tagline}
    </div>
  );

  return (
    <PageContainer
      as="main"
      className="fixed inset-0 z-50 min-h-svh max-w-none overflow-hidden bg-[linear-gradient(-26.746deg,#0ebd7a_5.155%,#e0eba7_140.8%)] !px-0 !py-0"
    >
      {splashScreen}
    </PageContainer>
  );
}
