'use client';

import { forwardRef, useId, type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export type TextfieldProps = Omit<ComponentProps<'input'>, 'size'> & {
  label?: string;
  error?: string;
  helperText?: string;
};

export const Textfield = forwardRef<HTMLInputElement, TextfieldProps>(
  function Textfield(
    {
      label,
      error,
      helperText,
      className,
      id,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) {
    const reactId = useId();
    const inputId = id ?? reactId;
    const message = error ?? helperText;
    const messageId = message ? `${inputId}-message` : undefined;
    const describedBy =
      [ariaDescribedBy, messageId].filter(Boolean).join(' ') || undefined;

    const labelElement = label ? (
      <label htmlFor={inputId} className="text-body2 text-gray-500">
        {label}
      </label>
    ) : null;

    const inputElement = (
      <input
        ref={ref}
        id={inputId}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className={cn(
          'w-full rounded-[10px] border border-gray-400 bg-transparent px-4 py-[15px] text-subtitle2 outline-none transition-colors placeholder:text-gray-400 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
          className,
        )}
        {...props}
      />
    );

    const messageElement = message ? (
      <p
        id={messageId}
        className={cn(
          'text-caption',
          error ? 'text-destructive' : 'text-gray-500',
        )}
      >
        {message}
      </p>
    ) : null;

    const textfield = (
      <div className="flex flex-col gap-1.5">
        {labelElement}
        {inputElement}
        {messageElement}
      </div>
    );

    return textfield;
  },
);
