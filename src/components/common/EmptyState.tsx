import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const iconSlot = icon ? (
    <div className="mb-4 text-muted-foreground [&_svg]:size-10">{icon}</div>
  ) : null;

  const titleSlot = <h2 className="text-subtitle1 text-foreground">{title}</h2>;

  const descriptionSlot = description ? (
    <p className="mt-1 text-body2 text-muted-foreground">{description}</p>
  ) : null;

  const actionSlot = action ? <div className="mt-6">{action}</div> : null;

  return (
    <div
      data-slot="empty-state"
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/30 px-6 py-12 text-center',
        className,
      )}
    >
      {iconSlot}
      {titleSlot}
      {descriptionSlot}
      {actionSlot}
    </div>
  );
}
