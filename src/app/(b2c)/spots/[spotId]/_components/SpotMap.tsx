'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type KakaoLatLng = object;
type KakaoMap = {
  setZoomable: (zoomable: boolean) => void;
  setDraggable: (draggable: boolean) => void;
};
type KakaoMarker = { setMap: (map: KakaoMap | null) => void };

type KakaoMapsSdk = {
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  Map: new (
    container: HTMLElement,
    options: { center: KakaoLatLng; level?: number },
  ) => KakaoMap;
  Marker: new (options: { position: KakaoLatLng }) => KakaoMarker;
  load: (callback: () => void) => void;
};

declare global {
  interface Window {
    kakao?: { maps: KakaoMapsSdk };
  }
}

let sdkPromise: Promise<KakaoMapsSdk> | null = null;

function loadKakaoMapSdk(appKey: string): Promise<KakaoMapsSdk> {
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Kakao Map SDK는 브라우저에서만 로드할 수 있습니다.'));
      return;
    }

    const ready = () => {
      const maps = window.kakao?.maps;
      if (!maps) {
        sdkPromise = null;
        reject(
          new Error(
            'Kakao Map SDK는 로드됐지만 window.kakao.maps 가 없습니다.',
          ),
        );
        return;
      }
      maps.load(() => resolve(maps));
    };

    if (window.kakao?.maps) {
      ready();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-kakao-map-sdk='true']",
    );
    if (existing) {
      existing.addEventListener('load', ready, { once: true });
      existing.addEventListener(
        'error',
        () => {
          sdkPromise = null;
          reject(new Error('Kakao Map SDK 로드 실패'));
        },
        { once: true },
      );
      return;
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(
      appKey,
    )}&autoload=false`;
    script.async = true;
    script.dataset.kakaoMapSdk = 'true';
    script.addEventListener('load', ready, { once: true });
    script.addEventListener(
      'error',
      () => {
        sdkPromise = null;
        reject(new Error('Kakao Map SDK 로드 실패'));
      },
      { once: true },
    );
    document.head.appendChild(script);
  });

  return sdkPromise;
}

export type SpotMapProps = {
  latitude: number;
  longitude: number;
  level?: number;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
};

export function SpotMap({
  latitude,
  longitude,
  level = 2,
  interactive = false,
  onClick,
  className,
}: SpotMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

  useEffect(() => {
    if (!appKey) return;

    let cancelled = false;

    loadKakaoMapSdk(appKey)
      .then((maps) => {
        if (cancelled || !containerRef.current) return;
        const center = new maps.LatLng(latitude, longitude);
        const map = new maps.Map(containerRef.current, { center, level });
        if (!interactive) {
          map.setZoomable(false);
          map.setDraggable(false);
        }
        const marker = new maps.Marker({ position: center });
        marker.setMap(map);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(
          e instanceof Error ? e.message : '지도를 불러오지 못했습니다.',
        );
      });

    return () => {
      cancelled = true;
    };
  }, [appKey, latitude, longitude, level, interactive]);

  const fallbackClassName = cn(
    'flex h-72 items-center justify-center rounded-md border border-dashed px-4 text-center text-sm text-muted-foreground',
    className,
  );

  if (!appKey) {
    return (
      <div className={fallbackClassName}>
        NEXT_PUBLIC_KAKAO_MAP_KEY 가 설정되지 않았습니다.
      </div>
    );
  }

  if (error) {
    return <div className={fallbackClassName}>{error}</div>;
  }

  return (
    <div
      ref={containerRef}
      role={onClick ? 'button' : 'img'}
      aria-label="시설 위치 지도"
      onClick={onClick}
      className={cn(
        'h-72 w-full rounded-md border bg-muted',
        onClick && 'cursor-pointer',
        className,
      )}
    />
  );
}
