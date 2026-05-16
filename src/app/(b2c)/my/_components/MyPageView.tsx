'use client';

import { FacilityCard } from '@/app/(b2c)/_components/FacilityCard';
import { DISABILITY_OPTIONS } from '@/app/onboarding/_components/OnboardingFunnel/OnboardingFunnel.constants';
import {
  LOCATION_LABEL_TO_REGION,
  REGION_TO_LOCATION_LABEL,
} from '@/api/customer-preferences';
import { EmptyState } from '@/components/common/EmptyState';
import { LocationSelector } from '@/components/common/LocationSelector';
import { PageContainer } from '@/components/common/PageContainer';
import { SkeletonText } from '@/components/common/Skeleton';
import { toast } from '@/components/common/Toast';
import { cn } from '@/lib/utils';
import { getOwnerUuid } from '@/lib/uuid';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { likesMeQuery, useUpdateCustomerRegion } from '../_fetch';
import { MyFilterChangeView } from './MyFilterChangeView';

export type MyPageViewProps = {
  userName?: string;
  location?: string;
  disabilityLabel?: string;
};

export function MyPageView({
  userName = '너디너리',
  location = '서울',
  disabilityLabel = '발달장애',
}: MyPageViewProps) {
  const [isFilterChangeOpen, setIsFilterChangeOpen] = useState(false);
  const [uuid] = useState(() => getOwnerUuid() ?? '');
  const [removedFacilityIds, setRemovedFacilityIds] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState(location);
  const [currentDisabilityLabel, setCurrentDisabilityLabel] =
    useState(disabilityLabel);
  const updateRegion = useUpdateCustomerRegion(uuid);
  const likedFacilities = useQuery(
    likesMeQuery(uuid, {
      page: 0,
      size: 10,
      sort: ['createdAt,DESC'],
    }),
  );

  const facilityItemsState = (likedFacilities.data?.content ?? []).filter(
    (facility) => !removedFacilityIds.includes(facility.id),
  );

  // TODO: 백엔드가 찜 해제 요청에 content.uuid 사용 가능 여부를 확정하면 mutation으로 교체.
  const updateFacilityFavorite = (
    facilityId: string,
    nextFavorite: boolean,
  ) => {
    if (!nextFavorite) {
      setRemovedFacilityIds((currentIds) => [...currentIds, facilityId]);
    }
  };

  const formatDisabilityLabel = (selectedTypes: string[]) => {
    const labels = selectedTypes
      .map(
        (type) =>
          DISABILITY_OPTIONS.find((option) => option.id === type)?.label,
      )
      .filter((label): label is string => Boolean(label));

    if (labels.length === 0) return currentDisabilityLabel;
    if (labels.length === 1) return labels[0];
    return `${labels[0]} 외 ${labels.length - 1}개`;
  };

  const handleLocationChange = (nextLocation: string) => {
    const region = LOCATION_LABEL_TO_REGION[nextLocation];
    if (!uuid || !region || updateRegion.isPending) return;

    const previousLocation = currentLocation;
    setCurrentLocation(nextLocation);
    updateRegion.mutate(
      { region },
      {
        onSuccess: (result) => {
          setCurrentLocation(REGION_TO_LOCATION_LABEL[result.region]);
          toast.success('지역 설정이 완료되었어요!');
        },
        onError: (error) => {
          setCurrentLocation(previousLocation);
          toast.error(
            error instanceof Error
              ? error.message
              : '지역 설정에 실패했어요. 잠시 후 다시 시도해주세요.',
          );
        },
      },
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
      key={currentLocation}
      location={currentLocation}
      triggerLabel="기본 지역 설정"
      showSuccessToast={false}
      onLocationChange={handleLocationChange}
      disabled={updateRegion.isPending}
      className="mt-[22px]"
    />
  );

  const curationStatus = (
    <section className="mt-[27px] flex h-[78px] items-center justify-between rounded-[5px] border border-main bg-facility-badge px-4">
      <p className="text-subtitle2 text-main">
        <span className="block">현재 [{currentDisabilityLabel}]</span>
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

  const favoritesContent = (() => {
    if (!uuid) {
      return (
        <EmptyState
          title="찜한 그라운드가 없어요"
          description="관심 있는 그라운드를 찜해보세요."
          className="mt-[14px]"
        />
      );
    }

    if (likedFacilities.isLoading) {
      return <SkeletonText lines={6} className="mt-[14px]" />;
    }

    if (likedFacilities.isError) {
      return (
        <EmptyState
          title="찜한 그라운드를 불러오지 못했어요"
          description="잠시 후 다시 시도해주세요."
          className="mt-[14px]"
        />
      );
    }

    if (favoriteItems.length === 0) {
      return (
        <EmptyState
          title="찜한 그라운드가 없어요"
          description="관심 있는 그라운드를 찜해보세요."
          className="mt-[14px]"
        />
      );
    }

    return (
      <div
        aria-label="찜한 그라운드 목록"
        className="mt-[14px] flex flex-col gap-[13px] pb-[30px]"
      >
        {favoriteItems}
      </div>
    );
  })();

  const favoritesSection = (
    <section aria-labelledby="favorite-ground-title" className="pt-[21px]">
      <h2 id="favorite-ground-title" className="text-header2 text-gray-900">
        내가 찜한 그라운드
      </h2>
      {favoritesContent}
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
      {isFilterChangeOpen ? (
        <MyFilterChangeView
          uuid={uuid}
          onClose={() => setIsFilterChangeOpen(false)}
          onSaved={(selectedTypes) =>
            setCurrentDisabilityLabel(formatDisabilityLabel(selectedTypes))
          }
        />
      ) : null}
    </>
  );
}
