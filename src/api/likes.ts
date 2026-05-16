import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { api } from '@/lib/axios';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type LikeStatus = {
  uuid: string;
  isLiked: boolean;
};

// ──────────────────────────────────────────────
// HTTP calls
// ──────────────────────────────────────────────

async function fetchLikeStatus(
  uuid: string,
  facilityId: number,
): Promise<LikeStatus> {
  const { data } = await api.get<LikeStatus>('/api/v1/likes', {
    params: { uuid, facilityId },
  });
  return data;
}

async function postLike(facilityId: number): Promise<string> {
  // uuid 는 axios 인터셉터가 body 에 자동 주입.
  const { data } = await api.post<string>('/api/v1/likes', { facilityId });
  return data;
}

async function deleteLike(uuid: string, facilityId: number): Promise<string> {
  const { data } = await api.delete<string>('/api/v1/likes', {
    params: { uuid, facilityId },
  });
  return data;
}

// ──────────────────────────────────────────────
// queryOptions
// ──────────────────────────────────────────────

export const likeStatusQuery = (uuid: string, facilityId: number) =>
  queryOptions({
    queryKey: ['likes', facilityId, uuid] as const,
    queryFn: () => fetchLikeStatus(uuid, facilityId),
    enabled: Boolean(uuid) && facilityId > 0,
  });

// ──────────────────────────────────────────────
// Mutation hooks
// ──────────────────────────────────────────────

/**
 * 좋아요 토글.
 * `mutate(isCurrentlyLiked)` 형태로 현재 좋아요 상태를 넘기면 반대 액션을 수행한다.
 * uuid 가 비어있거나 facilityId 가 유효하지 않으면 호출부에서 미리 차단해야 한다.
 */
export function useToggleLike(uuid: string, facilityId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isCurrentlyLiked: boolean) =>
      isCurrentlyLiked ? deleteLike(uuid, facilityId) : postLike(facilityId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: likeStatusQuery(uuid, facilityId).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ['likes', 'me', uuid],
      });
    },
  });
}
