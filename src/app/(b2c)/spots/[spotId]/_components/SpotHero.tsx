"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export type SpotHeroProps = {
  imageUrl: string;
  alt: string;
  dotsCount?: number;
  activeIndex?: number;
  onBack?: () => void;
  className?: string;
};

export function SpotHero({
  imageUrl,
  alt,
  dotsCount = 3,
  activeIndex = 0,
  onBack,
  className,
}: SpotHeroProps) {
  const dots = Array.from({ length: dotsCount }, (_, i) => (
    <span
      key={i}
      aria-hidden
      className={cn(
        "h-2 w-2 rounded-full",
        i === activeIndex ? "bg-main" : "bg-white/60",
      )}
    />
  ));

  const backButton = onBack ? (
    <button
      type="button"
      onClick={onBack}
      aria-label="뒤로 가기"
      className="absolute left-4 top-[73px] flex h-8 w-8 items-center justify-center rounded-full bg-black/30"
    >
      <Image src="/icons/back.svg" alt="" width={24} height={24} />
    </button>
  ) : null;

  return (
    <div className={cn("relative h-[260px] w-full overflow-hidden", className)}>
      <Image
        src={imageUrl}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover"
        priority
        unoptimized
      />
      {backButton}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-[10px]">
        {dots}
      </div>
    </div>
  );
}
