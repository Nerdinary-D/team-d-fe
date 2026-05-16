import { useMutation } from '@tanstack/react-query';
import type { Curation } from '@/api/customer-preferences';
import { api } from '@/lib/axios';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type CustomerLoginPayload = {
  nickname: string;
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
