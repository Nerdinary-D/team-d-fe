'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { BottomCTA } from '@/components/common/BottomCTA';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { SkeletonText } from '@/components/common/Skeleton';
import { spotQuery } from '../../_fetch';
import { SpotMap } from '../../_components/SpotMap';

export type SpotMapFullViewProps = {
  spotId: string;
};

export function SpotMapFullView({ spotId }: SpotMapFullViewProps) {
  const router = useRouter();
  const spot = useQuery(spotQuery(spotId));

  if (spot.isLoading) {
    return (
      <div className="px-4 py-6">
        <SkeletonText lines={6} />
      </div>
    );
  }

  if (spot.isError || !spot.data) {
    return (
      <div className="px-4 py-6">
        <EmptyState
          title="시설 정보를 불러오지 못했어요"
          description="잠시 후 다시 시도해주세요."
        />
      </div>
    );
  }

  const s = spot.data;

  const backButton = (
    <Button
      variant="icon"
      size="icon"
      onClick={() => router.back()}
      aria-label="뒤로 가기"
      className="absolute top-7 left-4 z-10"
    >
      <Image src="/icons/back.svg" alt="" width={24} height={24} />
    </Button>
  );

  const addressBar = (
    <BottomCTA as="div" className="justify-start pl-5">
      <Image
        src="/icons/location-white.svg"
        alt=""
        width={24}
        height={24}
        aria-hidden
      />
      <span className="text-subtitle2">{s.address}</span>
    </BottomCTA>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <SpotMap
        latitude={s.latitude}
        longitude={s.longitude}
        interactive
        className="h-full w-full rounded-none border-0 bg-transparent"
      />
      {backButton}
      {addressBar}
    </div>
  );
}
