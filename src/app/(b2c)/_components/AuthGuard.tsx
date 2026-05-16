'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useSyncExternalStore } from 'react';
import { OWNER_UUID_CHANGE_EVENT, getOwnerUuid } from '@/lib/uuid';

const SPLASH_ROUTE = '/splash';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(OWNER_UUID_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(OWNER_UUID_CHANGE_EVENT, callback);
  };
}

function getSnapshot() {
  return getOwnerUuid();
}

function getServerSnapshot() {
  return null;
}

export type AuthGuardProps = {
  children: React.ReactNode;
};

/**
 * 클라이언트에서 localStorage 의 owner uuid 를 구독한다.
 * uuid 가 없으면 `/splash` 로 즉시 replace 한다.
 * `/splash` 자체에서는 가드를 통과시킨다 (무한 루프 방지).
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const uuid = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isSplash = pathname === SPLASH_ROUTE;
  const allowed = isSplash || Boolean(uuid);

  useEffect(() => {
    if (!allowed) {
      router.replace(SPLASH_ROUTE);
    }
  }, [allowed, router]);

  if (!allowed) return null;

  return <>{children}</>;
}
