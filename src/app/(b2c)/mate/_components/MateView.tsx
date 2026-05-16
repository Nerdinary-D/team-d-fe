'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useState } from 'react';
import { EmptyState } from '@/components/common/EmptyState';
import { PostCard } from '@/components/common/PostCard';
import { SelectToggle } from '@/components/common/SelectToggle';
import { SkeletonText } from '@/components/common/Skeleton';
import { matePostsQuery } from '../_fetch';

export function MateView() {
  const [city, setCity] = useState('서울');
  const { data, isLoading, isError } = useQuery(matePostsQuery(city));

  const locationIcon = (
    <Image
      src="/icons/location.svg"
      alt=""
      width={24}
      height={24}
      aria-hidden
    />
  );

  const header = (
    <header className="sticky top-0 z-10 flex flex-col gap-2 bg-white px-4 pt-6">
      <h1 className="text-header2 text-black">지금 모집 중인 그라운드 🔥</h1>
      <SelectToggle
        label={city}
        icon={locationIcon}
        onClick={() => {
          setCity((prev) => (prev === '서울' ? '부산' : '서울'));
        }}
        aria-label="지역 선택"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-full h-3 bg-gradient-to-b from-white to-transparent"
      />
    </header>
  );

  const list = (() => {
    if (isLoading) {
      return (
        <div className="px-4 pt-6">
          <SkeletonText lines={5} />
        </div>
      );
    }

    if (isError) {
      return (
        <EmptyState
          title="불러오기 실패"
          description="메이트 모집글을 가져오지 못했습니다. 잠시 후 다시 시도해주세요."
        />
      );
    }

    if (!data || data.length === 0) {
      return (
        <EmptyState
          title="아직 모집 중인 메이트가 없어요"
          description="새로운 모집글이 등록되면 여기에 표시됩니다."
        />
      );
    }

    return (
      <div className="flex flex-col gap-[14px] px-4 pt-6">
        {data.map((post) => (
          <PostCard
            key={post.id}
            title={post.title}
            createdAt={post.createdAt}
            schedule={post.schedule}
            content={post.content}
            openChatUrl={post.openChatUrl}
          />
        ))}
      </div>
    );
  })();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[360px] flex-col bg-white pb-6">
      {header}
      {list}
    </main>
  );
}
