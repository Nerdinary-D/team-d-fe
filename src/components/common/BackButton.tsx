'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';

export type BackButtonProps = {
  className?: string;
};

export function BackButton({ className }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="icon"
      size="icon"
      onClick={() => router.back()}
      aria-label="뒤로 가기"
      className={className}
    >
      <Image src="/icons/back.svg" alt="" width={16} height={14} />
    </Button>
  );
}
