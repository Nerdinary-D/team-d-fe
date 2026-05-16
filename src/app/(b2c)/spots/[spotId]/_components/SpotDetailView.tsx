'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BottomCTA } from '@/components/common/BottomCTA';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/common/EmptyState';
import { SkeletonText } from '@/components/common/Skeleton';
import { partnerPostsQuery, spotQuery } from '../_fetch';
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
  const spot = useQuery(spotQuery(spotId));
  const posts = useQuery(partnerPostsQuery(spotId));

  const handleOpenCreate = () => setCreateOpen(true);
  const handleOpenFullMap = () => router.push(`/spots/${spotId}/map`);

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

  return (
    <>
      <main className="flex flex-col gap-[20px]">
        <SpotHero imageUrl={s.imageUrl} alt={s.name} />
        <SpotInfoHeader name={s.name} sport={s.sport} address={s.address} />
        <InfraChipList infraList={s.infraList} />
        <div className="px-4">
          <SpotMap
            latitude={s.latitude}
            longitude={s.longitude}
            onClick={handleOpenFullMap}
          />
        </div>
        <PartnerSection posts={postList} />
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
