import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { api } from '@/lib/axios';
export { likeStatusQuery, useToggleLike } from '@/api/likes';
import {
  addMockPartnerPost,
  generateMockPostId,
  getMockPartnerPosts,
} from './_mock';
import type { CreatePartnerPostInput, PartnerPost, Spot } from './_schema';
import { CATEGORY_LABEL, CURATION_LABEL } from '@/api/facility-map';

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

// ──────────────────────────────────────────────
// HTTP calls
// ──────────────────────────────────────────────

// TODO: 라우트 동적화 시 spotId 사용. 일단 facility id 1 로 하드코딩.
const HARDCODED_FACILITY_ID = 1;

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
  void spotId;
  const facility = await fetchFacility(HARDCODED_FACILITY_ID);
  return facilityToSpot(facility);
}

// FIXME: 파트너 모집글 API 가 붙기 전까지 MOCK 유지
function mockDelay() {
  return new Promise<void>((resolve) => setTimeout(resolve, 200));
}

async function fetchPartnerPosts(spotId: string): Promise<PartnerPost[]> {
  await mockDelay();
  return getMockPartnerPosts(spotId);
}

async function postPartnerPost(
  input: CreatePartnerPostInput,
): Promise<PartnerPost> {
  await mockDelay();
  const created: PartnerPost = {
    id: generateMockPostId(),
    spotId: input.spotId,
    title: input.title,
    content: input.content,
    schedule: input.schedule,
    openChatUrl: input.openChatUrl,
    createdAt: new Date().toISOString(),
  };
  addMockPartnerPost(created);
  return created;
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
