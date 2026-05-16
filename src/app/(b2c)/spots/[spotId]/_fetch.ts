import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { CreatePartnerPostInput, PartnerPost, Spot } from './_schema';
import { CATEGORY_LABEL, CURATION_LABEL } from './_facility-map';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type { Spot, PartnerPost, CreatePartnerPostInput };

type FacilityAddress = {
  sido: string;
  sigungu: string;
  roadAddress: string;
  detailAddress: string;
  latitude: string;
  longitude: string;
};

type Facility = {
  id: number;
  name: string;
  category: string;
  image: string;
  region: string;
  curations: string[];
  address: FacilityAddress;
};

type LikeStatus = {
  uuid: string;
  isLiked: boolean;
};

type MatePostResponse = {
  facilityId: number;
  title: string;
  meetingTime: string;
  content: string;
  openchatLink: string;
  createdAt: string;
};

type MatePagedResponse = {
  content: MatePostResponse[];
  currentPage: number;
  size: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
};

type CreateMateResponse = {
  uuid: string;
  mateId: number;
  createdAt: string;
};

// ──────────────────────────────────────────────
// HTTP calls
// ──────────────────────────────────────────────

async function fetchFacility(facilityId: number): Promise<Facility> {
  const { data } = await api.get<Facility>(`/api/v1/facilities/${facilityId}`);
  return data;
}

function facilityToSpot(facility: Facility): Spot {
  const { address } = facility;
  const composedAddress = [
    address.sido,
    address.sigungu,
    address.roadAddress,
    address.detailAddress,
  ]
    .filter(Boolean)
    .join(' ');

  return {
    id: String(facility.id),
    name: facility.name,
    sport: CATEGORY_LABEL[facility.category] ?? facility.category,
    address: composedAddress,
    latitude: Number(address.latitude) || 0,
    longitude: Number(address.longitude) || 0,
    imageUrl: facility.image,
    infraList: facility.curations.map(
      (curation) => CURATION_LABEL[curation] ?? curation,
    ),
  };
}

async function fetchSpot(spotId: string): Promise<Spot> {
  const facility = await fetchFacility(Number(spotId));
  return facilityToSpot(facility);
}

function matePostToPartnerPost(post: MatePostResponse): PartnerPost {
  return {
    // GET 응답에 per-post id 가 없어 facilityId+createdAt 합성 키 사용
    id: `${post.facilityId}-${post.createdAt}`,
    spotId: String(post.facilityId),
    title: post.title,
    content: post.content,
    schedule: post.meetingTime,
    openChatUrl: post.openchatLink,
    createdAt: post.createdAt,
  };
}

async function fetchPartnerPosts(spotId: string): Promise<PartnerPost[]> {
  const { data } = await api.get<MatePagedResponse>('/api/v1/mates', {
    params: {
      facilityId: Number(spotId),
      page: 0,
      size: 10,
      sort: 'createdAt,DESC',
    },
  });
  return data.content.map(matePostToPartnerPost);
}

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

async function postPartnerPost(
  input: CreatePartnerPostInput,
): Promise<PartnerPost> {
  // uuid 는 axios 인터셉터가 body 에 자동 주입.
  const { data } = await api.post<CreateMateResponse>('/api/v1/mates', {
    facilityId: Number(input.spotId),
    title: input.title,
    meetingTime: input.schedule,
    content: input.content,
    openchatLink: input.openChatUrl,
  });

  return {
    id: String(data.mateId),
    spotId: input.spotId,
    title: input.title,
    content: input.content,
    schedule: input.schedule,
    openChatUrl: input.openChatUrl,
    createdAt: data.createdAt,
  };
}

// ──────────────────────────────────────────────
// queryOptions
// ──────────────────────────────────────────────

export const spotQuery = (spotId: string) =>
  queryOptions({
    queryKey: ['spots', 'detail', spotId] as const,
    queryFn: () => fetchSpot(spotId),
    enabled: Boolean(spotId),
  });

export const partnerPostsQuery = (spotId: string) =>
  queryOptions({
    queryKey: ['spots', spotId, 'partner-posts'] as const,
    queryFn: () => fetchPartnerPosts(spotId),
    enabled: Boolean(spotId),
  });

export const likeStatusQuery = (uuid: string, facilityId: number) =>
  queryOptions({
    queryKey: ['likes', facilityId, uuid] as const,
    queryFn: () => fetchLikeStatus(uuid, facilityId),
    enabled: Boolean(uuid) && facilityId > 0,
  });

// ──────────────────────────────────────────────
// Mutation hooks
// ──────────────────────────────────────────────

export function useCreatePartnerPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postPartnerPost,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: partnerPostsQuery(variables.spotId).queryKey,
      });
    },
  });
}

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
    },
  });
}
