'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useState } from 'react';
import { useToggleLike } from '@/api/likes';
import { EmptyState } from '@/components/common/EmptyState';
import { LocationSelector } from '@/components/common/LocationSelector';
import { SkeletonText } from '@/components/common/Skeleton';
import { getOwnerUuid } from '@/lib/uuid';
import { memberQuery, recommendedFacilitiesQuery } from '../_fetch';
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
  location?: string;
  facilities?: HomeFacility[];
};

export function HomePage({
  location = '서울',
  facilities,
}: HomePageProps) {
  const [uuid] = useState(() => getOwnerUuid() ?? '');
  const { data: member } = useQuery(memberQuery(uuid || null));
  const nickname = member?.nickname ?? '00';

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

  const header = (
    <header className="sticky top-0 z-10 flex flex-col gap-[17px] bg-white px-4 pt-6">
      <div className="flex flex-col gap-[5px]">
        <h1>
          <Image
            src="/icons/logo.svg"
            alt="안심 그라운드"
            width={157}
            height={23}
            priority
          />
        </h1>
        <p className="text-header2 text-gray-900">
          <span>{nickname}님을 위한 </span>
          <span className="text-main">안심 그라운드</span>
        </p>
      </div>
      <div className="flex h-6">
        <LocationSelector
          location={selectedLocation}
          onLocationChange={setSelectedLocation}
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-full h-3 bg-gradient-to-b from-white to-transparent"
      />
    </header>
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
      className="flex flex-col gap-4 px-4 pt-[17px] pb-[90px]"
    >
      {facilityItems}
    </section>
  );

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[360px] flex-col bg-white">
      {header}
      {facilityList}
    </main>
  );
}
