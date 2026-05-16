'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BottomCTA } from '@/components/common/BottomCTA';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/common/EmptyState';
import { SkeletonText } from '@/components/common/Skeleton';
import { getOwnerUuid } from '@/lib/uuid';
import {
  likeStatusQuery,
  partnerPostsQuery,
  spotQuery,
  useToggleLike,
} from '../_fetch';
import { InfraChipList } from './InfraChipList';
import { PartnerPostFormDialog } from './PartnerPostFormDialog';
import { PartnerSection } from './PartnerSection';
import { SpotHero } from './SpotHero';
import { SpotInfoHeader } from './SpotInfoHeader';
import { SpotMap } from './SpotMap';

export type SpotDetailViewProps = {
  spotId: string;
};

export function SpotDetailView({ spotId }: SpotDetailViewProps) {
  const router = useRouter();
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [uuid] = useState(() => getOwnerUuid() ?? '');
  const spot = useQuery(spotQuery(spotId));
  const posts = useQuery(partnerPostsQuery(spotId));

  const facilityId = Number(spot.data?.id) || 0;
  const likeStatus = useQuery(likeStatusQuery(uuid, facilityId));
  const toggleLike = useToggleLike(uuid, facilityId);

  const handleOpenCreate = () => setCreateOpen(true);
  const handleOpenFullMap = () => router.push(`/spots/${spotId}/map`);
  const handleToggleLike = () => {
    if (!uuid || facilityId <= 0 || toggleLike.isPending) return;
    toggleLike.mutate(likeStatus.data?.isLiked ?? false);
  };

  if (spot.isLoading || posts.isLoading) {
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
  const postList = posts.data ?? [];

  const createCta = (
    <BottomCTA
      onClick={handleOpenCreate}
      className={cn(
        'transition-opacity duration-200',
        isCreateOpen && 'pointer-events-none opacity-0',
      )}
    >
      <Image src="/icons/plus.svg" alt="" width={24} height={24} aria-hidden />
      <span className="text-subtitle2">모집글 등록하기</span>
    </BottomCTA>
  );

  const header = (
    <header className="sticky top-0 z-10 flex flex-col gap-[20px] bg-white">
      <SpotHero
        imageUrl={s.imageUrl}
        alt={s.name}
        isLiked={likeStatus.data?.isLiked ?? false}
        onToggleLike={handleToggleLike}
      />
      <SpotInfoHeader name={s.name} sport={s.sport} address={s.address} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-full h-3 bg-gradient-to-b from-white to-transparent"
      />
    </header>
  );

  return (
    <>
      <main className="flex flex-col">
        {header}
        <div className="flex flex-col gap-[20px] pt-[20px]">
          <InfraChipList infraList={s.infraList} />
          <div className="px-4">
            <SpotMap
              latitude={s.latitude}
              longitude={s.longitude}
              onClick={handleOpenFullMap}
            />
          </div>
          <PartnerSection posts={postList} />
        </div>
      </main>
      {createCta}
      <PartnerPostFormDialog
        spotId={spotId}
        open={isCreateOpen}
        onOpenChange={setCreateOpen}
      />
    </>
  );
}
