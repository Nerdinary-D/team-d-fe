import { queryOptions, useMutation } from '@tanstack/react-query';
import type { FacilityBadgeVariant } from '@/app/(b2c)/_components/FacilityBadge';
import type { Curation, CustomerRegion } from '@/api/customer-preferences';
import { CATEGORY_LABEL, CURATION_BADGE_VARIANT } from '@/api/facility-map';
import { api } from '@/lib/axios';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type LikedFacility = {
  id: string;
  name: string;
  sportName: string;
  imageSrc: string;
  imageAlt: string;
  badges: FacilityBadgeVariant[];
  isFavorite: boolean;
};

export type LikesMeItem = {
  uuid: string;
  image: string;
  name: string;
  category: string;
  hashTags: string[];
  isLiked: boolean;
};

export type LikesMePageResult = {
  content: LikesMeItem[];
  currentPage: number;
  size: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
};

export type LikesMePage = Omit<LikesMePageResult, 'content'> & {
  content: LikedFacility[];
};

export type LikesMeQueryParams = {
  page?: number;
  size?: number;
  sort?: string[];
};

export type UpdateCustomerRegionPayload = {
  region: CustomerRegion;
};

export type UpdateCustomerRegionResult = {
  region: CustomerRegion;
};

export type UpdateCustomerCurationsPayload = {
  curations: Curation[];
};

export type UpdateCustomerCurationsResult = {
  curations: Curation[];
};

// ──────────────────────────────────────────────
// HTTP calls
// ──────────────────────────────────────────────

async function fetchLikesMe(
  uuid: string,
  params: LikesMeQueryParams,
): Promise<LikesMePageResult> {
  const { data } = await api.get<LikesMePageResult>('/api/v1/likes/me', {
    params: {
      uuid,
      page: params.page ?? 0,
      size: params.size ?? 10,
      sort: params.sort ?? ['createdAt,DESC'],
    },
  });
  return data;
}

async function patchCustomerRegion(
  uuid: string,
  payload: UpdateCustomerRegionPayload,
): Promise<UpdateCustomerRegionResult> {
  const { data } = await api.patch<UpdateCustomerRegionResult>(
    `/api/v1/customers/${uuid}/region`,
    payload,
    { skipOwnerUuidInjection: true },
  );
  return data;
}

async function patchCustomerCurations(
  uuid: string,
  payload: UpdateCustomerCurationsPayload,
): Promise<UpdateCustomerCurationsResult> {
  const { data } = await api.patch<UpdateCustomerCurationsResult>(
    `/api/v1/customers/${uuid}/curations`,
    payload,
    { skipOwnerUuidInjection: true },
  );
  return data;
}

export function likesMeItemToFavoriteFacility(
  item: LikesMeItem,
): LikedFacility {
  const badges = item.hashTags
    .map((hashTag) => CURATION_BADGE_VARIANT[hashTag])
    .filter((badge): badge is FacilityBadgeVariant => Boolean(badge));

  return {
    id: item.uuid,
    name: item.name,
    sportName: CATEGORY_LABEL[item.category] ?? item.category,
    imageSrc: item.image || '/images/home/facility-placeholder.svg',
    imageAlt: `${item.name} 이미지`,
    badges,
    isFavorite: item.isLiked,
  };
}

function likesMePageToLikedFacilities(page: LikesMePageResult): LikesMePage {
  return {
    ...page,
    content: page.content.map(likesMeItemToFavoriteFacility),
  };
}

// ──────────────────────────────────────────────
// queryOptions
// ──────────────────────────────────────────────

export const likesMeQuery = (uuid: string, params: LikesMeQueryParams = {}) =>
  queryOptions({
    queryKey: ['likes', 'me', uuid, params] as const,
    queryFn: () => fetchLikesMe(uuid, params),
    enabled: Boolean(uuid),
    select: likesMePageToLikedFacilities,
  });

// ──────────────────────────────────────────────
// Mutation hooks
// ──────────────────────────────────────────────

export function useUpdateCustomerRegion(uuid: string) {
  return useMutation({
    mutationFn: (payload: UpdateCustomerRegionPayload) =>
      patchCustomerRegion(uuid, payload),
  });
}

export function useUpdateCustomerCurations(uuid: string) {
  return useMutation({
    mutationFn: (payload: UpdateCustomerCurationsPayload) =>
      patchCustomerCurations(uuid, payload),
  });
}
