import Image from 'next/image';
import { Button } from '@/components/common/Button';

export type LikeButtonProps = {
  isLiked: boolean;
  onToggleLike?: () => void;
  className?: string;
};

export function LikeButton({
  isLiked,
  onToggleLike,
  className,
}: LikeButtonProps) {
  return (
    <Button
      variant="icon"
      size="icon"
      onClick={onToggleLike}
      aria-label={isLiked ? '찜 해제' : '찜하기'}
      aria-pressed={isLiked}
      className={className}
    >
      <Image
        src={isLiked ? '/icons/heart-select.svg' : '/icons/heart-none-select.svg'}
        alt=""
        width={24}
        height={24}
      />
    </Button>
  );
}
