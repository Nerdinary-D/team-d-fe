'use client';

import { PageContainer } from '@/components/common/PageContainer';
import { useState } from 'react';
import { FacilityCard } from './FacilityCard';
import { LocationSelector } from './LocationSelector';
import type { FacilityBadgeVariant } from './FacilityBadge';

type HomeFacility = {
  id: string;
  name: string;
  sportName: string;
  imageSrc: string;
  imageAlt: string;
  badges: FacilityBadgeVariant[];
  isFavorite: boolean;
};

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
  facilities = defaultFacilities,
}: HomePageProps) {
  const [facilityItemsState, setFacilityItemsState] = useState<HomeFacility[]>(
    () => facilities.map((facility) => ({ ...facility })),
  );
  const updateFacilityFavorite = (
    facilityId: string,
    nextFavorite: boolean,
  ) => {
    setFacilityItemsState((currentFacilities) =>
      currentFacilities.map((facility) =>
        facility.id === facilityId
          ? { ...facility, isFavorite: nextFavorite }
          : facility,
      ),
    );
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
      <LocationSelector location={location} />
    </div>
  );

  const facilityItems = facilityItemsState.map((facility) => (
    <FacilityCard
      key={facility.id}
      name={facility.name}
      sportName={facility.sportName}
      imageSrc={facility.imageSrc}
      imageAlt={facility.imageAlt}
      badges={facility.badges}
      isFavorite={facility.isFavorite}
      onFavoriteChange={(nextFavorite) =>
        updateFacilityFavorite(facility.id, nextFavorite)
      }
    />
  ));

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
