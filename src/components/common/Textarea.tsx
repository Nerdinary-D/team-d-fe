'use client';

import { forwardRef, useId, type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export type TextareaProps = ComponentProps<'textarea'> & {
  label?: string;
  error?: string;
  helperText?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { label, error, helperText, className, id, rows = 5, ...props },
    ref,
  ) {
    const reactId = useId();
    const inputId = id ?? reactId;
    const message = error ?? helperText;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-body2 text-gray-500">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          aria-invalid={error ? true : undefined}
          className={cn(
            'w-full min-w-0 rounded-[10px] border border-gray-400 bg-transparent px-4 py-[15px] text-subtitle2 outline-none transition-colors placeholder:text-gray-400 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
            className,
          )}
          {...props}
        />
        {message && (
          <p
            className={cn(
              'text-caption',
              error ? 'text-destructive' : 'text-gray-500',
            )}
          >
            {message}
          </p>
        )}
      </div>
    );
  },
);
