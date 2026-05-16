'use client';

import { FacilityCard } from '@/app/(b2c)/_components/FacilityCard';
import { LocationSelector } from '@/components/common/LocationSelector';
import { PageContainer } from '@/components/common/PageContainer';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { FacilityBadgeVariant } from '@/app/(b2c)/_components/FacilityBadge';
import { MyFilterChangeView } from './MyFilterChangeView';

type FavoriteFacility = {
  id: string;
  name: string;
  sportName: string;
  imageSrc: string;
  imageAlt: string;
  badges: FacilityBadgeVariant[];
  isFavorite: boolean;
};

const defaultFavoriteFacilities = [
  {
    id: 'favorite-1',
    name: '시설 명',
    sportName: '종목명',
    imageSrc: '/images/home/facility-placeholder.svg',
    imageAlt: '찜한 시설 이미지',
    badges: [
      'courtAccess',
      'brailleGuide',
      'writtenCommunication',
      'visualGuide',
    ],
    isFavorite: true,
  },
  {
    id: 'favorite-2',
    name: '시설 명',
    sportName: '종목명',
    imageSrc: '/images/home/facility-placeholder.svg',
    imageAlt: '찜한 시설 이미지',
    badges: [
      'courtAccess',
      'brailleGuide',
      'writtenCommunication',
      'visualGuide',
    ],
    isFavorite: true,
  },
  {
    id: 'favorite-3',
    name: '시설 명',
    sportName: '종목명',
    imageSrc: '/images/home/facility-placeholder.svg',
    imageAlt: '찜한 시설 이미지',
    badges: [
      'courtAccess',
      'brailleGuide',
      'writtenCommunication',
      'visualGuide',
    ],
    isFavorite: true,
  },
] satisfies FavoriteFacility[];

export type MyPageViewProps = {
  userName?: string;
  location?: string;
  disabilityLabel?: string;
  favoriteFacilities?: FavoriteFacility[];
};

export function MyPageView({
  userName = '너디너리',
  location = '서울',
  disabilityLabel = '발달장애',
  favoriteFacilities = defaultFavoriteFacilities,
}: MyPageViewProps) {
  const [isFilterChangeOpen, setIsFilterChangeOpen] = useState(false);
  const [facilityItemsState, setFacilityItemsState] = useState<
    FavoriteFacility[]
  >(() => favoriteFacilities.map((facility) => ({ ...facility })));

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
    <header className="flex flex-col gap-[23px]">
      <h1 className="text-header2 text-gray-900">마이페이지</h1>
      <p className="text-header1 text-black">{userName} 님</p>
    </header>
  );

  const locationSetting = (
    <LocationSelector
      location={location}
      triggerLabel="기본 지역 설정"
      className="mt-[22px]"
    />
  );

  const curationStatus = (
    <section className="mt-[27px] flex h-[78px] items-center justify-between rounded-[5px] border border-main bg-facility-badge px-4">
      <p className="text-subtitle2 text-main">
        <span className="block">현재 [{disabilityLabel}]</span>
        <span className="block">맞춤 큐레이션 중이에요!</span>
      </p>
      <button
        type="button"
        onClick={() => setIsFilterChangeOpen(true)}
        className="text-subtitle2 rounded-[5px] bg-white px-2.5 py-2.5 text-main outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        필터변경
      </button>
    </section>
  );

  const divider = <div className="-mx-4 mt-[21px] h-3.5 bg-gray-100" />;

  const favoriteItems = facilityItemsState.map((facility) => (
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

  const favoritesSection = (
    <section aria-labelledby="favorite-ground-title" className="pt-[21px]">
      <h2 id="favorite-ground-title" className="text-header2 text-gray-900">
        내가 찜한 그라운드
      </h2>
      <div
        aria-label="찜한 그라운드 목록"
        className="mt-[14px] flex flex-col gap-[13px] pb-[30px]"
      >
        {favoriteItems}
      </div>
    </section>
  );

  const content = (
    <>
      {header}
      {locationSetting}
      {curationStatus}
      {divider}
      {favoritesSection}
    </>
  );

  return (
    <>
      <PageContainer
        as="main"
        className={cn(
          'min-h-[calc(100dvh-90px)] max-w-[360px] bg-white',
          '!px-4 !pt-6 !pb-0',
        )}
      >
        {content}
      </PageContainer>
      {isFilterChangeOpen ? <MyFilterChangeView /> : null}
    </>
  );
}
