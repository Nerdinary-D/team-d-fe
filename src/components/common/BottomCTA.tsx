'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BottomCTAProps = {
  as?: 'button' | 'div';
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  children: ReactNode;
};

export function BottomCTA({
  as = 'button',
  onClick,
  type = 'button',
  disabled,
  className,
  children,
}: BottomCTAProps) {
  const innerClassName = cn(
    'pointer-events-auto flex h-[50px] w-full max-w-[328px] items-center justify-center gap-[5px] rounded-[40px] bg-main text-subtitle2 text-white shadow-lg',
    as === 'button' &&
      'transition-transform active:scale-[0.98] disabled:bg-input-subtle disabled:opacity-100',
    className,
  );

  const innerElement =
    as === 'button' ? (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={innerClassName}
      >
        {children}
      </button>
    ) : (
      <div className={innerClassName}>{children}</div>
    );

  const bottomCTA = (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[25px]">
      {innerElement}
    </div>
  );

  return bottomCTA;
}
