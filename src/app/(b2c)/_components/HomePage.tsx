'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useState } from 'react';
import { LocationSelector } from '@/components/common/LocationSelector';
import { getOwnerUuid } from '@/lib/uuid';
import { memberQuery } from '../_fetch';
import { FacilityCard } from './FacilityCard';
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
  location?: string;
  facilities?: HomeFacility[];
};

export function HomePage({
  location = '서울',
  facilities = defaultFacilities,
}: HomePageProps) {
  const ownerUuid = typeof window === 'undefined' ? null : getOwnerUuid();
  const { data: member } = useQuery(memberQuery(ownerUuid));
  const nickname = member?.nickname ?? '00';

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
        <LocationSelector location={location} />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-full h-3 bg-gradient-to-b from-white to-transparent"
      />
    </header>
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
