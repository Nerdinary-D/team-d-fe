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
  const iconSrc = isLiked
    ? '/icons/heart-select.svg'
    : '/icons/heart-none-select.svg';
  const buttonLabel = isLiked ? '찜 해제' : '찜하기';
  const icon = <Image src={iconSrc} alt="" width={24} height={24} />;

  return (
    <Button
      variant="icon"
      size="icon"
      onClick={onToggleLike}
      aria-label={buttonLabel}
      aria-pressed={isLiked}
      className={className}
    >
      {icon}
    </Button>
  );
}
