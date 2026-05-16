import { queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/axios';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type MemberRole = 'ROLE_CUSTOMER' | 'ROLE_OWNER';

export type Member = {
  uuid: string;
  role: MemberRole;
  nickname: string;
};

// ──────────────────────────────────────────────
// HTTP calls
// ──────────────────────────────────────────────

async function fetchMember(uuid: string): Promise<Member> {
  const { data } = await api.get<Member>(`/api/v1/members/${uuid}`);
  return data;
}

// ──────────────────────────────────────────────
// queryOptions
// ──────────────────────────────────────────────

export const memberQuery = (uuid: string | null) =>
  queryOptions({
    queryKey: ['member', uuid] as const,
    queryFn: () => fetchMember(uuid as string),
    enabled: Boolean(uuid),
  });
