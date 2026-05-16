import { PostCard } from '@/components/common/PostCard';
import { cn } from '@/lib/utils';
import type { PartnerPost } from '../_schema';

export type PartnerSectionProps = {
  posts: PartnerPost[];
  className?: string;
};

export function PartnerSection({ posts, className }: PartnerSectionProps) {
  const heading = (
    <h2 className="text-subtitle1 text-foreground">👥 지금 모집중인 메이트</h2>
  );

  const body =
    posts.length === 0 ? (
      <p className="text-subtitle2 text-gray-500">
        모집중인 메이트가 없어요. 첫 글을 등록해보세요!
      </p>
    ) : (
      <div className="flex flex-col gap-[14px]">
        {posts.map((post) => (
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

  return (
    <section className={cn('flex flex-col gap-[14px] px-4', className)}>
      {heading}
      {body}
    </section>
  );
}
