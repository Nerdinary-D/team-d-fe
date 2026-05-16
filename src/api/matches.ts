import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/axios";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type MatchStatus = "scheduled" | "live" | "finished";

export type Match = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  status: MatchStatus;
  scheduledAt: string;
};

export type CreateMatchPayload = Omit<Match, "id" | "status">;

// ──────────────────────────────────────────────
// Query keys
// ──────────────────────────────────────────────

export const matchKeys = {
  all: ["matches"] as const,
  list: () => [...matchKeys.all, "list"] as const,
  detail: (id: string) => [...matchKeys.all, "detail", id] as const,
};

// ──────────────────────────────────────────────
// HTTP calls (axios)
// ──────────────────────────────────────────────

async function fetchMatches() {
  const { data } = await api.get<Match[]>("/matches");
  return data;
}

async function fetchMatch(id: string) {
  const { data } = await api.get<Match>(`/matches/${id}`);
  return data;
}

async function createMatch(payload: CreateMatchPayload) {
  const { data } = await api.post<Match>("/matches", payload);
  return data;
}

// ──────────────────────────────────────────────
// React Query hooks
// ──────────────────────────────────────────────

export function useMatches() {
  return useQuery({
    queryKey: matchKeys.list(),
    queryFn: fetchMatches,
  });
}

export function useMatch(id: string) {
  return useQuery({
    queryKey: matchKeys.detail(id),
    queryFn: () => fetchMatch(id),
    enabled: Boolean(id),
  });
}

export function useCreateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matchKeys.list() });
    },
  });
}
