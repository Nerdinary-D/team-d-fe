'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useSyncExternalStore } from 'react';
import { CLIENT_UUID_CHANGE_EVENT, getClientUuid } from '@/lib/uuid';

const SPLASH_ROUTE = '/splash';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(CLIENT_UUID_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(CLIENT_UUID_CHANGE_EVENT, callback);
  };
}

function getSnapshot() {
  return getClientUuid();
}

function getServerSnapshot() {
  return undefined;
}

export type AuthGuardProps = {
  children: React.ReactNode;
};

/**
 * 클라이언트에서 localStorage 의 client uuid 를 구독한다.
 * uuid 가 없으면 `/splash` 로 즉시 replace 한다.
 * `/splash` 자체에서는 가드를 통과시킨다 (무한 루프 방지).
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const uuid = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isSplash = pathname === SPLASH_ROUTE;
  const isHydrating = uuid === undefined;
  const allowed = isSplash || Boolean(uuid);

  useEffect(() => {
    if (isHydrating || allowed) return;
    // SSR snapshot 이 stale 일 수 있어 effect 시점에 한 번 더 검증.
    if (pathname === SPLASH_ROUTE || getClientUuid()) return;
    router.replace(SPLASH_ROUTE);
  }, [allowed, isHydrating, pathname, router]);

  if (isHydrating && !isSplash) return null;
  if (!allowed) return null;

  return <>{children}</>;
}
