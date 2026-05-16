import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

const sizeMap = {
  sm: { dot: 'size-1.5', gap: 'gap-1' },
  md: { dot: 'size-2', gap: 'gap-1.5' },
  lg: { dot: 'size-3', gap: 'gap-2' },
} as const;

export type LoadingDotsProps = ComponentProps<'div'> & {
  size?: keyof typeof sizeMap;
  dotClassName?: string;
};

export function LoadingDots({
  size = 'md',
  className,
  dotClassName,
  ...props
}: LoadingDotsProps) {
  const { dot, gap } = sizeMap[size];
  const baseDot = cn('rounded-full bg-main animate-bounce', dot, dotClassName);

  return (
    <div
      role="status"
      aria-label="Loading"
      data-slot="loading-dots"
      className={cn('inline-flex items-center', gap, className)}
      {...props}
    >
      <span className={baseDot} style={{ animationDelay: '0ms' }} />
      <span className={baseDot} style={{ animationDelay: '150ms' }} />
      <span className={baseDot} style={{ animationDelay: '300ms' }} />
      <span className="sr-only">Loading</span>
    </div>
  );
}
