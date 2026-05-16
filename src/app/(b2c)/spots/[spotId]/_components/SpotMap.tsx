"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type NaverLatLng = object;
type NaverMap = object;
type NaverMarker = { setMap: (map: NaverMap | null) => void };

type NaverMapsSdk = {
  Map: new (
    container: HTMLElement,
    options: { center: NaverLatLng; zoom?: number },
  ) => NaverMap;
  LatLng: new (lat: number, lng: number) => NaverLatLng;
  Marker: new (options: { position: NaverLatLng }) => NaverMarker;
};

declare global {
  interface Window {
    naver?: { maps: NaverMapsSdk };
  }
}

let sdkPromise: Promise<NaverMapsSdk> | null = null;

function loadNaverMapSdk(clientId: string): Promise<NaverMapsSdk> {
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Naver Map SDK는 브라우저에서만 로드할 수 있습니다."));
      return;
    }

    const ready = () => {
      const maps = window.naver?.maps;
      if (!maps) {
        sdkPromise = null;
        reject(new Error("Naver Map SDK는 로드됐지만 window.naver.maps 가 없습니다."));
        return;
      }
      resolve(maps);
    };

    if (window.naver?.maps) {
      ready();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-naver-map-sdk='true']",
    );
    if (existing) {
      existing.addEventListener("load", ready, { once: true });
      existing.addEventListener(
        "error",
        () => {
          sdkPromise = null;
          reject(new Error("Naver Map SDK 로드 실패"));
        },
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(
      clientId,
    )}`;
    script.async = true;
    script.dataset.naverMapSdk = "true";
    script.addEventListener("load", ready, { once: true });
    script.addEventListener(
      "error",
      () => {
        sdkPromise = null;
        reject(new Error("Naver Map SDK 로드 실패"));
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
  zoom?: number;
  className?: string;
};

export function SpotMap({
  latitude,
  longitude,
  zoom = 16,
  className,
}: SpotMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;

    let cancelled = false;

    loadNaverMapSdk(clientId)
      .then((maps) => {
        if (cancelled || !containerRef.current) return;
        const center = new maps.LatLng(latitude, longitude);
        const map = new maps.Map(containerRef.current, { center, zoom });
        const marker = new maps.Marker({ position: center });
        marker.setMap(map);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "지도를 불러오지 못했습니다.");
      });

    return () => {
      cancelled = true;
    };
  }, [clientId, latitude, longitude, zoom]);

  const fallbackClassName = cn(
    "flex h-72 items-center justify-center rounded-md border border-dashed px-4 text-center text-sm text-muted-foreground",
    className,
  );

  if (!clientId) {
    return (
      <div className={fallbackClassName}>
        NEXT_PUBLIC_NAVER_MAP_CLIENT_ID 가 설정되지 않았습니다.
      </div>
    );
  }

  if (error) {
    return <div className={fallbackClassName}>{error}</div>;
  }

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="시설 위치 지도"
      className={cn("h-72 w-full rounded-md border bg-muted", className)}
    />
  );
}
