'use client';

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from '@/components/common/BottomSheet';
import { hideToastPopup, showToastPopup } from '@/components/common/Toast';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import type { ComponentProps } from 'react';
import { useEffect, useRef, useState } from 'react';

const LOCATION_TOAST_DELAY_MS = 320;

const locationOptions = [
  '서울',
  '대전',
  '경기',
  '대구',
  '인천',
  '광주',
  '부산',
  '울산',
  '강원',
  '세종',
] as const;

export type LocationSelectorProps = Omit<
  ComponentProps<'button'>,
  'children'
> & {
  location: string;
};

export function LocationSelector({
  location,
  className,
  ...props
}: LocationSelectorProps) {
  const [selectedLocation, setSelectedLocation] = useState(location);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const locationToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const clearLocationToastTimeout = () => {
    if (locationToastTimeoutRef.current) {
      clearTimeout(locationToastTimeoutRef.current);
      locationToastTimeoutRef.current = null;
    }
  };

  useEffect(() => clearLocationToastTimeout, []);

  const openLocationSheet = () => {
    clearLocationToastTimeout();
    hideToastPopup();
    setIsSheetOpen(true);
  };

  const handleSheetOpenChange = (open: boolean) => {
    if (open) {
      clearLocationToastTimeout();
      hideToastPopup();
    }
    setIsSheetOpen(open);
  };

  const locationIcon = (
    <span className="relative size-6 shrink-0" aria-hidden>
      <Image
        src="/icons/home/location.svg"
        alt=""
        width={14}
        height={20}
        className="absolute inset-[8.33%_20.83%] h-5 w-3.5"
      />
    </span>
  );

  const label = (
    <span className="text-gray-900 whitespace-nowrap">{selectedLocation}</span>
  );

  const expandIcon = (
    <Image
      src="/icons/home/expand-more.svg"
      alt=""
      width={24}
      height={24}
      aria-hidden
      className="size-6 shrink-0"
    />
  );

  const trigger = (
    <button
      type="button"
      aria-label={`지역 선택: ${selectedLocation}`}
      onClick={openLocationSheet}
      className={cn(
        'text-subtitle1 inline-flex h-6 shrink-0 items-center justify-center gap-1.5 rounded-none border-0 bg-transparent p-0 outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
        className,
      )}
      {...props}
    >
      <span className="flex items-start gap-1">
        {locationIcon}
        {label}
      </span>
      {expandIcon}
    </button>
  );

  const closeButton = (
    <BottomSheetClose
      render={
        <button
          type="button"
          aria-label="지역 설정 닫기"
          className="relative size-6 shrink-0"
        />
      }
    >
      <Image
        src="/icons/home/cancel.svg"
        alt=""
        width={12}
        height={12}
        aria-hidden
        className="absolute inset-[28.15%] size-[11.986px]"
      />
    </BottomSheetClose>
  );

  const locationItems = locationOptions.map((option) => {
    const isSelected = option === selectedLocation;

    return (
      <BottomSheetClose
        key={option}
        render={
          <button
            type="button"
            aria-pressed={isSelected}
            onClick={() => {
              setSelectedLocation(option);
              setIsSheetOpen(false);
              if (!isSelected) {
                clearLocationToastTimeout();
                locationToastTimeoutRef.current = setTimeout(() => {
                  showToastPopup('지역 설정이 완료되었어요!');
                  locationToastTimeoutRef.current = null;
                }, LOCATION_TOAST_DELAY_MS);
              }
            }}
            className={cn(
              'text-subtitle1 flex h-[52px] items-center rounded-[10px] px-2.5 py-[15px]',
              isSelected && 'bg-main',
            )}
          />
        }
      >
        <span className={isSelected ? 'text-white' : 'text-gray-500'}>
          {option}
        </span>
      </BottomSheetClose>
    );
  });

  const sheetHeader = (
    <BottomSheetHeader className="w-full pr-0">
      <BottomSheetTitle className="text-gray-900">지역 설정</BottomSheetTitle>
      {closeButton}
    </BottomSheetHeader>
  );

  const sheetContent = (
    <BottomSheetContent
      aria-describedby={undefined}
      showCloseButton={false}
      className="left-1/2 h-[413px] w-full max-w-[360px] -translate-x-1/2 items-start gap-7 bg-white px-4 py-[23px] pr-[15px]"
    >
      {sheetHeader}
      <div className="grid w-full grid-cols-2 gap-x-[17px]">
        {locationItems}
      </div>
    </BottomSheetContent>
  );

  return (
    <BottomSheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
      {trigger}
      {sheetContent}
    </BottomSheet>
  );
}
