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

export type HealthCheck = {
  message: string;
  baseURL: string;
};

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

async function fetchHealth(): Promise<HealthCheck> {
  const response = await api.get<string>('/health', {
    responseType: 'text',
    transformResponse: (raw) => raw,
  });
  return {
    message:
      typeof response.data === 'string' ? response.data : String(response.data),
    baseURL: String(response.config.baseURL ?? ''),
  };
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

export const healthQuery = () =>
  queryOptions({
    queryKey: ['health'] as const,
    queryFn: fetchHealth,
    staleTime: 0,
    retry: false,
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
