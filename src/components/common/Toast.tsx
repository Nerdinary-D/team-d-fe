'use client';

import { Toaster as Sonner, toast, type ToasterProps } from 'sonner';
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useEffect,
  useState,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
  type SVGProps,
} from 'react';

export { toast };

const APP_TOAST_DURATION = 2000;
const APP_TOAST_EVENT = 'app-toast:show';
const APP_TOAST_HIDE_EVENT = 'app-toast:hide';

export function showToastPopup(message: string) {
  window.dispatchEvent(new CustomEvent(APP_TOAST_EVENT, { detail: message }));
  return message;
}

export function hideToastPopup() {
  window.dispatchEvent(new Event(APP_TOAST_HIDE_EVENT));
}

export function AppToastViewport() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setMessage(customEvent.detail);
    };
    const handleHideToast = () => setMessage(null);

    window.addEventListener(APP_TOAST_EVENT, handleToast);
    window.addEventListener(APP_TOAST_HIDE_EVENT, handleHideToast);
    return () => {
      window.removeEventListener(APP_TOAST_EVENT, handleToast);
      window.removeEventListener(APP_TOAST_HIDE_EVENT, handleHideToast);
    };
  }, []);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timeoutId = window.setTimeout(
      () => setMessage(null),
      APP_TOAST_DURATION,
    );
    return () => window.clearTimeout(timeoutId);
  }, [message]);

  if (!message) {
    return null;
  }

  return (
    <ToastPopup className="fixed bottom-[113px] left-1/2 z-[100] -translate-x-1/2">
      {message}
    </ToastPopup>
  );
}

function ToastPopupCheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2.5" fill="currentColor" />
      <path
        d="m8.25 12 2.35 2.35 5.15-5.1"
        stroke="var(--color-main)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type ToastPopupProps = ComponentProps<'div'> & {
  icon?: ReactNode;
};

export function ToastPopup({
  icon,
  role = 'status',
  className,
  children,
  ...props
}: ToastPopupProps) {
  const defaultIcon = (
    <ToastPopupCheckIcon
      data-testid="toast-popup-check-icon"
      className="size-6 text-white"
    />
  );
  const iconSlot = (
    <span className="flex size-6 shrink-0 items-center justify-center">
      {icon ?? defaultIcon}
    </span>
  );
  const message = (
    <span className="min-w-0 text-sm leading-[1.4] font-semibold break-words text-white">
      {children}
    </span>
  );

  return (
    <div
      role={role}
      className={cn(
        'flex min-h-[60px] w-[328px] items-center gap-2.5 rounded-[10px] bg-main px-5 py-[18px]',
        className,
      )}
      {...props}
    >
      {iconSlot}
      {message}
    </div>
  );
}

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'cn-toast',
        },
      }}
      {...props}
    />
  );
}
