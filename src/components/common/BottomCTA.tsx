'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BottomCTAProps = {
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  children: ReactNode;
};

export function BottomCTA({
  onClick,
  type = 'button',
  disabled,
  className,
  children,
}: BottomCTAProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4">
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'pointer-events-auto flex h-[50px] w-full items-center justify-center gap-[5px] rounded-[40px] bg-main text-white shadow-lg transition-transform active:scale-[0.98] disabled:opacity-50',
          className,
        )}
      >
        {children}
      </button>
    </div>
  );
}
