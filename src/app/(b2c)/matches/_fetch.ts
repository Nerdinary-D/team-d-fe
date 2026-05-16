import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { api } from '@/lib/axios';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type MatchStatus = 'scheduled' | 'live' | 'finished';

export type Match = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  status: MatchStatus;
  scheduledAt: string;
};

export type CreateMatchPayload = Omit<Match, 'id' | 'status'>;

// ──────────────────────────────────────────────
// HTTP calls (axios) — not exported
// ──────────────────────────────────────────────

async function fetchMatches() {
  const { data } = await api.get<Match[]>('/matches');
  return data;
}

async function fetchMatch(id: string) {
  const { data } = await api.get<Match>(`/matches/${id}`);
  return data;
}

async function createMatch(payload: CreateMatchPayload) {
  const { data } = await api.post<Match>('/matches', payload);
  return data;
}

// ──────────────────────────────────────────────
// queryOptions
// ──────────────────────────────────────────────

export const matchesQuery = () =>
  queryOptions({
    queryKey: ['matches', 'list'] as const,
    queryFn: fetchMatches,
  });

export const matchQuery = (id: string) =>
  queryOptions({
    queryKey: ['matches', 'detail', id] as const,
    queryFn: () => fetchMatch(id),
    enabled: Boolean(id),
  });

// ──────────────────────────────────────────────
// Mutation hooks
// ──────────────────────────────────────────────

export function useCreateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matchesQuery().queryKey });
    },
  });
}
