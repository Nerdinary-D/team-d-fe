'use client';

import Image from 'next/image';
import { BackButton } from '@/components/common/BackButton';
import { LikeButton } from '@/components/common/LikeButton';
import { cn } from '@/lib/utils';

export type SpotHeroProps = {
  imageUrl: string;
  alt: string;
  dotsCount?: number;
  activeIndex?: number;
  isLiked?: boolean;
  onToggleLike?: () => void;
  className?: string;
};

export function SpotHero({
  imageUrl,
  alt,
  dotsCount = 1,
  activeIndex = 0,
  isLiked = false,
  onToggleLike,
  className,
}: SpotHeroProps) {
  const dots =
    dotsCount > 1
      ? Array.from({ length: dotsCount }, (_, i) => (
          <span
            key={i}
            aria-hidden
            className={cn(
              'h-2 w-2 rounded-full',
              i === activeIndex ? 'bg-main' : 'bg-white/60',
            )}
          />
        ))
      : null;

  return (
    <div className={cn('relative h-[260px] w-full overflow-hidden', className)}>
      <Image
        src={imageUrl}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover"
        priority
        unoptimized
      />
      <BackButton className="absolute top-7 left-4" />
      <LikeButton
        isLiked={isLiked}
        onToggleLike={onToggleLike}
        className="absolute top-7 right-4"
      />
      {dots ? (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-[10px]">
          {dots}
        </div>
      ) : null}
    </div>
  );
}
