'use client';

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { XIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Button } from '@/components/common/Button';
import { cn } from '@/lib/utils';

export function BottomSheet({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="bottom-sheet" {...props} />;
}

export function BottomSheetTrigger({
  ...props
}: DialogPrimitive.Trigger.Props) {
  return (
    <DialogPrimitive.Trigger data-slot="bottom-sheet-trigger" {...props} />
  );
}

export function BottomSheetClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="bottom-sheet-close" {...props} />;
}

export function BottomSheetOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="bottom-sheet-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-black/30 duration-150 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
        className,
      )}
      {...props}
    />
  );
}

export function BottomSheetContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & { showCloseButton?: boolean }) {
  const closeButton = showCloseButton ? (
    <DialogPrimitive.Close
      data-slot="bottom-sheet-close"
      render={
        <Button
          variant="ghost"
          className="absolute top-3 right-3"
          size="icon"
        />
      }
    >
      <XIcon />
      <span className="sr-only">닫기</span>
    </DialogPrimitive.Close>
  ) : null;

  return (
    <DialogPrimitive.Portal>
      <BottomSheetOverlay />
      <DialogPrimitive.Popup
        data-slot="bottom-sheet-content"
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] flex-col overflow-y-auto rounded-t-[10px] bg-background outline-none duration-200 data-open:animate-in data-open:slide-in-from-bottom data-closed:animate-out data-closed:slide-out-to-bottom',
          className,
        )}
        {...props}
      >
        {children}
        {closeButton}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

export function BottomSheetHeader({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      data-slot="bottom-sheet-header"
      className={cn('flex items-end justify-between gap-2 pr-10', className)}
      {...props}
    />
  );
}

export function BottomSheetTitle({
  className,
  ...props
}: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="bottom-sheet-title"
      className={cn('text-header2 text-gray-800', className)}
      {...props}
    />
  );
}

export function BottomSheetDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="bottom-sheet-description"
      className={cn('text-body2 text-gray-500', className)}
      {...props}
    />
  );
}
