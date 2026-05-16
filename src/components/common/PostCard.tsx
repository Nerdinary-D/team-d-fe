'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

export type PostCardProps = {
  title: string;
  createdAt: string;
  schedule: string;
  content: string;
  openChatUrl: string;
  /** 카드 본문 클릭 시 이동할 경로. 지정 시 카드 전체가 link 역할. */
  href?: string;
  className?: string;
};

function formatRegisteredDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

export function PostCard({
  title,
  createdAt,
  schedule,
  content,
  openChatUrl,
  href,
  className,
}: PostCardProps) {
  const router = useRouter();
  const isClickable = Boolean(href);
  const handleCardClick = () => {
    if (href) router.push(href);
  };
  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!href) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      router.push(href);
    }
  };
  const titleRow = (
    <div className="flex items-center justify-between gap-2">
      <h3 className="text-subtitle1 text-gray-800">{title}</h3>
      <span className="text-caption text-gray-400">
        {formatRegisteredDate(createdAt)}
      </span>
    </div>
  );

  const scheduleLine = (
    <p className="text-subtitle2 text-gray-500">{schedule}</p>
  );

  const contentLine = (
    <p className="text-subtitle2 line-clamp-3 text-gray-400">{content}</p>
  );

  const chatButton = (
    <a
      href={openChatUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => event.stopPropagation()}
      className="bg-chat-bg inline-flex h-[33px] w-[150px] items-center justify-center gap-1 rounded-[20px] px-2 py-[5px]"
    >
      <Image src="/icons/chat.svg" alt="" width={16} height={16} aria-hidden />
      <span className="text-caption text-chat-fg">오픈채팅으로 연락하기</span>
    </a>
  );

  return (
    <article
      onClick={isClickable ? handleCardClick : undefined}
      onKeyDown={isClickable ? handleCardKeyDown : undefined}
      role={isClickable ? 'link' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={cn(
        'border-gray-400 flex flex-col gap-[10px] rounded-[10px] border bg-white px-4 py-[15px]',
        isClickable && 'cursor-pointer',
        className,
      )}
    >
      <div className="flex flex-col gap-[5px]">
        {titleRow}
        {scheduleLine}
        {contentLine}
      </div>
      <div className="flex">{chatButton}</div>
    </article>
  );
}
