'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/common/Dialog';
import { LikeButton } from '@/components/common/LikeButton';
import { showToastPopup } from '@/components/common/Toast';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { FacilityBadge, type FacilityBadgeVariant } from './FacilityBadge';
import type { ComponentProps } from 'react';

const VISIBLE_BADGE_COUNT = 4;

export type FacilityCardProps = Omit<ComponentProps<'article'>, 'children'> & {
  name: string;
  sportName: string;
  imageSrc: string;
  imageAlt: string;
  badges: FacilityBadgeVariant[];
  isFavorite: boolean;
  onFavoriteChange?: (nextFavorite: boolean) => void;
};

export function FacilityCard({
  name,
  sportName,
  imageSrc,
  imageAlt,
  badges,
  isFavorite,
  onFavoriteChange,
  className,
  ...props
}: FacilityCardProps) {
  const visibleBadges = badges.slice(0, VISIBLE_BADGE_COUNT);
  const hiddenCount = Math.max(badges.length - VISIBLE_BADGE_COUNT, 0);
  const hasHiddenBadges = hiddenCount > 0;
  const handleToggleFavorite = () => {
    const nextFavorite = !isFavorite;
    onFavoriteChange?.(nextFavorite);
    if (nextFavorite) {
      showToastPopup('찜한 그라운드에 추가했어요.');
    }
  };

  const image = (
    <div className="relative h-[122px] w-full overflow-hidden rounded-t-[10px] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={328}
        height={122}
        unoptimized
        className="size-full object-cover"
      />
      <LikeButton
        isLiked={isFavorite}
        onToggleLike={handleToggleFavorite}
        className="absolute top-4 right-4"
      />
    </div>
  );

  const title = (
    <div className="flex flex-col gap-[7px]">
      <h3 className="text-subtitle1 text-gray-900">{name}</h3>
      <p className="text-subtitle2 text-gray-600">{sportName}</p>
    </div>
  );

  const visibleBadgeItems = visibleBadges.map((badge) => (
    <FacilityBadge key={badge} variant={badge} spacing="wide" />
  ));

  const allBadgeItems = badges.map((badge) => (
    <FacilityBadge key={badge} variant={badge} spacing="wide" />
  ));

  const moreButton = hasHiddenBadges ? (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            className="inline-flex h-[27px] shrink-0 items-center justify-center rounded-[20px] bg-facility-badge px-2.5 py-[5px] text-[12px] leading-[1.4] font-medium whitespace-nowrap text-main-dark"
          />
        }
      >
        +{hiddenCount} 더보기
      </DialogTrigger>
      <DialogContent
        className="top-auto bottom-0 left-1/2 max-w-[360px] translate-y-0 gap-5 rounded-t-[24px] rounded-b-none px-4 pt-5 pb-8 sm:max-w-[360px]"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle className="text-subtitle1">편의 시설</DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap gap-2">{allBadgeItems}</div>
      </DialogContent>
    </Dialog>
  ) : null;

  const badgeList = (
    <div className="flex flex-wrap gap-2">
      {visibleBadgeItems}
      {moreButton}
    </div>
  );

  const content = (
    <div className="flex flex-col gap-2.5 rounded-b-[10px] bg-white px-4 pt-2.5 pb-[9px] shadow-[0_2px_2px_rgba(0,0,0,0.1)]">
      {title}
      {badgeList}
    </div>
  );

  return (
    <article
      data-slot="facility-card"
      className={cn('flex w-[328px] flex-col rounded-[10px]', className)}
      {...props}
    >
      {image}
      {content}
    </article>
  );
}
