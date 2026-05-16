import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

export type SkeletonProps = ComponentProps<'div'>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

export type SkeletonTextProps = {
  lines?: number;
  className?: string;
};

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  const rows = Array.from({ length: lines }, (_, i) => {
    const isLast = i === lines - 1;
    return <Skeleton key={i} className={cn('h-4 w-full', isLast && 'w-3/5')} />;
  });

  return <div className={cn('flex flex-col gap-2', className)}>{rows}</div>;
}
