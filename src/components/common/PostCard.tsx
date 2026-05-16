import Image from 'next/image';
import { cn } from '@/lib/utils';

export type PostCardProps = {
  title: string;
  createdAt: string;
  schedule: string;
  content: string;
  openChatUrl: string;
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
  className,
}: PostCardProps) {
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
      className="bg-chat-bg inline-flex h-[33px] w-[150px] items-center justify-center gap-1 rounded-[20px] px-2 py-[5px]"
    >
      <Image src="/icons/chat.svg" alt="" width={16} height={16} aria-hidden />
      <span className="text-caption text-chat-fg">오픈채팅으로 연락하기</span>
    </a>
  );

  return (
    <article
      className={cn(
        'border-main flex flex-col gap-[10px] rounded-[10px] border bg-white px-4 py-[15px]',
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
