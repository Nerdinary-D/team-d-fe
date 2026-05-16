import { queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { FacilityBadgeVariant } from './_components/FacilityBadge';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type MemberRole = 'ROLE_CUSTOMER' | 'ROLE_OWNER';

export type Member = {
  uuid: string;
  role: MemberRole;
  nickname: string;
};

export type RecommendedFacility = {
  id: string;
  name: string;
  sportName: string;
  imageSrc: string;
  imageAlt: string;
  badges: FacilityBadgeVariant[];
  isFavorite: boolean;
};

export type RecommendedFacilitiesPage = {
  content: RecommendedFacility[];
  currentPage: number;
  size: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
};

export type RecommendedFacilitiesParams = {
  page?: number;
  region?: FacilityRegion;
  size?: number;
  sort?: string[];
};

export type FacilityRegion =
  | 'SEOUL'
  | 'GYEONGGI'
  | 'INCHEON'
  | 'BUSAN'
  | 'DAEGU'
  | 'DAEJEON'
  | 'GWANGJU'
  | 'ULSAN'
  | 'SEJONG'
  | 'GANGWON';

type RecommendedFacilityResponse = {
  id: number;
  name: string;
  category: string;
  image: string;
  region: string;
  curations: string[];
  matchCount: number;
  isLiked: boolean;
};

type RecommendedFacilitiesPageResponse = Omit<
  RecommendedFacilitiesPage,
  'content'
> & {
  content: RecommendedFacilityResponse[];
};

const CATEGORY_LABEL: Record<string, string> = {
  BADMINTON: '배드민턴',
};

const CURATION_BADGE: Partial<Record<string, FacilityBadgeVariant>> = {
  NO_STEP_COURT_ENTRY: 'courtAccess',
  SPORTS_WHEELCHAIR_RENTAL: 'wheelchairRental',
  ACCESSIBLE_SHOWER_ROOM: 'privateShower',
  GUIDE_DOG_ALLOWED: 'guideDogWelcome',
  BRAILLE_INFRASTRUCTURE: 'brailleGuide',
  VERBAL_GUIDANCE: 'dedicatedStaff',
  WRITTEN_COMMUNICATION: 'writtenCommunication',
  VISUAL_MANUAL: 'visualGuide',
  VISUAL_ALARM: 'emergencyVisualAlarm',
  SIMPLE_SPORTS_RULE: 'simpleRules',
  LOW_STIMULUS_ENVIRONMENT: 'quietEnvironment',
  PRIVATE_SPACE: 'privateSpace',
  CERTIFIED_INSTRUCTOR: 'professionalInstructor',
};

// ──────────────────────────────────────────────
// HTTP calls
// ──────────────────────────────────────────────

async function fetchMember(uuid: string): Promise<Member> {
  const { data } = await api.get<Member>(`/api/v1/members/${uuid}`);
  return data;
}

function recommendedFacilityToHomeFacility(
  facility: RecommendedFacilityResponse,
): RecommendedFacility {
  return {
    id: String(facility.id),
    name: facility.name,
    sportName: CATEGORY_LABEL[facility.category] ?? facility.category,
    imageSrc: facility.image || '/images/home/facility-placeholder.svg',
    imageAlt: `${facility.name} 이미지`,
    badges: facility.curations
      .map((curation) => CURATION_BADGE[curation])
      .filter((badge): badge is FacilityBadgeVariant => Boolean(badge)),
    isFavorite: facility.isLiked,
  };
}

async function fetchRecommendedFacilities(
  uuid: string,
  params: RecommendedFacilitiesParams,
): Promise<RecommendedFacilitiesPage> {
  const { data } = await api.get<RecommendedFacilitiesPageResponse>(
    `/api/v1/facilities/recommended/${uuid}`,
    { params },
  );

  return {
    ...data,
    content: data.content.map(recommendedFacilityToHomeFacility),
  };
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

export const recommendedFacilitiesQuery = (
  uuid: string,
  params: RecommendedFacilitiesParams = { page: 0, size: 10 },
) =>
  queryOptions({
    queryKey: ['facilities', 'recommended', uuid, params] as const,
    queryFn: () => fetchRecommendedFacilities(uuid, params),
    enabled: Boolean(uuid),
  });
