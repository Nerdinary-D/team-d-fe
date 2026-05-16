import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export const CURATIONS = [
  // 지체 장애
  'NO_STEP_COURT_ENTRY',
  'SPORTS_WHEELCHAIR_RENTAL',
  'ACCESSIBLE_SHOWER_ROOM',
  // 시각 장애
  'GUIDE_DOG_ALLOWED',
  'BRAILLE_INFRASTRUCTURE',
  'VERBAL_GUIDANCE',
  // 청각 장애
  'WRITTEN_COMMUNICATION',
  'VISUAL_MANUAL',
  'VISUAL_ALARM',
  // 발달 장애
  'SIMPLE_SPORTS_RULE',
  'LOW_STIMULUS_ENVIRONMENT',
  'PRIVATE_SPACE',
  // 공통 신뢰
  'CERTIFIED_INSTRUCTOR',
] as const;

export type Curation = (typeof CURATIONS)[number];

export type CustomerLoginPayload = {
  curations: Curation[];
};

export type CustomerLoginResult = {
  uuid: string;
  createdAt: string;
};

// ──────────────────────────────────────────────
// HTTP calls
// ──────────────────────────────────────────────

/**
 * 고객(B2C) 로그인 / 회원 생성.
 * body 의 `uuid` 는 axios 인터셉터가 localStorage 에서 가져와 자동 첨부한다.
 */
async function loginCustomer(
  payload: CustomerLoginPayload,
): Promise<CustomerLoginResult> {
  const { data } = await api.post<CustomerLoginResult>(
    '/api/v1/customers',
    payload,
  );
  return data;
}

// ──────────────────────────────────────────────
// Mutation hooks
// ──────────────────────────────────────────────

export function useLoginCustomer() {
  return useMutation({
    mutationFn: loginCustomer,
  });
}
