'use client';

import { ChevronDown } from 'lucide-react';
import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export type SelectToggleProps = {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
};

export function SelectToggle({
  label,
  icon,
  onClick,
  className,
  'aria-label': ariaLabel,
}: SelectToggleProps) {
  return (
    <ButtonPrimitive
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      className={cn(
        'inline-flex items-center gap-1 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/50',
        className,
      )}
    >
      {icon ? (
        <span className="inline-flex size-6 items-center justify-center">
          {icon}
        </span>
      ) : null}
      <span className="text-subtitle1 text-gray-800">{label}</span>
      <ChevronDown className="size-6 text-foreground" aria-hidden />
    </ButtonPrimitive>
  );
}
