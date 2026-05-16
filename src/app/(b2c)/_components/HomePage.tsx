'use client';

import { PageContainer } from '@/components/common/PageContainer';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EmptyState } from '@/components/common/EmptyState';
import { LocationSelector } from '@/components/common/LocationSelector';
import { SkeletonText } from '@/components/common/Skeleton';
import { useToggleLike } from '@/api/likes';
import { getOwnerUuid } from '@/lib/uuid';
import { recommendedFacilitiesQuery } from '../_fetch';
import { FacilityCard } from './FacilityCard';
import type { FacilityRegion, RecommendedFacility } from '../_fetch';

type HomeFacility = RecommendedFacility;

const defaultFacilities = [
  {
    id: 'recommended-1',
    name: '시설 명',
    sportName: '종목명',
    imageSrc: '/images/home/facility-placeholder.svg',
    imageAlt: '시설 이미지',
    badges: ['wheelchairRamp', 'accessibleParking'],
    isFavorite: false,
  },
  {
    id: 'recommended-2',
    name: '시설 명',
    sportName: '종목명',
    imageSrc: '/images/home/facility-placeholder.svg',
    imageAlt: '시설 이미지',
    badges: ['wheelchairRamp'],
    isFavorite: false,
  },
  {
    id: 'recommended-3',
    name: '시설 명',
    sportName: '종목명',
    imageSrc: '/images/home/facility-placeholder.svg',
    imageAlt: '시설 이미지',
    badges: ['accessibleParking'],
    isFavorite: false,
  },
] satisfies HomeFacility[];

const LOCATION_REGION: Record<string, FacilityRegion> = {
  서울: 'SEOUL',
  경기: 'GYEONGGI',
  인천: 'INCHEON',
  부산: 'BUSAN',
  대구: 'DAEGU',
  대전: 'DAEJEON',
  광주: 'GWANGJU',
  울산: 'ULSAN',
  세종: 'SEJONG',
  강원: 'GANGWON',
};

type HomeFacilityCardProps = {
  facility: HomeFacility;
  uuid: string;
  favoriteOverride?: boolean;
  onFavoriteChange: (facilityId: string, nextFavorite: boolean) => void;
};

function HomeFacilityCard({
  facility,
  uuid,
  favoriteOverride,
  onFavoriteChange,
}: HomeFacilityCardProps) {
  const facilityId = Number(facility.id) || 0;
  const toggleLike = useToggleLike(uuid, facilityId);
  const isFavorite = favoriteOverride ?? facility.isFavorite;

  const handleFavoriteChange = (nextFavorite: boolean) => {
    if (!uuid || facilityId <= 0 || toggleLike.isPending) {
      onFavoriteChange(facility.id, nextFavorite);
      return;
    }

    onFavoriteChange(facility.id, nextFavorite);
    toggleLike.mutate(isFavorite, {
      onError: () => onFavoriteChange(facility.id, isFavorite),
    });
  };

  return (
    <FacilityCard
      name={facility.name}
      sportName={facility.sportName}
      imageSrc={facility.imageSrc}
      imageAlt={facility.imageAlt}
      badges={facility.badges}
      isFavorite={isFavorite}
      onFavoriteChange={handleFavoriteChange}
    />
  );
}

export type HomePageProps = {
  userName?: string;
  groundOwnerName?: string;
  location?: string;
  facilities?: HomeFacility[];
};

export function HomePage({
  userName = '000',
  groundOwnerName = '00',
  location = '서울',
  facilities,
}: HomePageProps) {
  const [uuid] = useState(() => getOwnerUuid() ?? '');
  const [selectedLocation, setSelectedLocation] = useState(location);
  const selectedRegion = LOCATION_REGION[selectedLocation];
  const recommendedFacilities = useQuery(
    recommendedFacilitiesQuery(uuid, {
      page: 0,
      size: 10,
      region: selectedRegion,
    }),
  );
  const [favoriteByFacilityId, setFavoriteByFacilityId] = useState<
    Record<string, boolean>
  >({});

  const isUsingPropFacilities = facilities !== undefined;
  const sourceFacilities =
    facilities ??
    recommendedFacilities.data?.content ??
    (uuid ? [] : defaultFacilities);

  const updateFacilityFavorite = (
    facilityId: string,
    nextFavorite: boolean,
  ) => {
    setFavoriteByFacilityId((currentFavorites) => ({
      ...currentFavorites,
      [facilityId]: nextFavorite,
    }));
  };

  const welcome = (
    <header className="flex shrink-0 flex-col gap-[5px]">
      <h1 className="text-header2 text-gray-900">{userName}님, 환영해요 😀</h1>
      <p className="text-header2 text-gray-900">
        <span>{groundOwnerName}님을 위한 </span>
        <span className="text-main">안심 그라운드</span>
      </p>
    </header>
  );

  const locationSelector = (
    <div className="mt-[17px] flex h-6 shrink-0">
      <LocationSelector
        location={selectedLocation}
        onLocationChange={setSelectedLocation}
      />
    </div>
  );

  const facilityItems = (() => {
    if (!isUsingPropFacilities && recommendedFacilities.isLoading) {
      return (
        <div className="pt-2">
          <SkeletonText lines={6} />
        </div>
      );
    }

    if (!isUsingPropFacilities && recommendedFacilities.isError) {
      return (
        <EmptyState
          title="추천 시설을 불러오지 못했어요"
          description="잠시 후 다시 시도해주세요."
        />
      );
    }

    if (sourceFacilities.length === 0) {
      return (
        <EmptyState
          title="추천 시설이 아직 없어요"
          description="큐레이션 조건에 맞는 시설이 등록되면 여기에 표시됩니다."
        />
      );
    }

    return sourceFacilities.map((facility) => (
      <HomeFacilityCard
        key={facility.id}
        facility={facility}
        uuid={uuid}
        favoriteOverride={favoriteByFacilityId[facility.id]}
        onFavoriteChange={updateFacilityFavorite}
      />
    ));
  })();

  const facilityList = (
    <section
      aria-label="추천 시설"
      className="scrollbar-hidden mt-[17px] flex flex-1 flex-col gap-4 overflow-y-auto pb-4"
    >
      {facilityItems}
    </section>
  );

  return (
    <PageContainer
      as="main"
      className="relative flex h-[calc(100dvh-90px)] !min-h-0 max-w-[360px] flex-col overflow-hidden bg-white !px-4 !pt-6 !pb-0"
    >
      {welcome}
      {locationSelector}
      {facilityList}
    </PageContainer>
  );
}
