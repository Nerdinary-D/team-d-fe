import { queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/axios';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type MatePost = {
  id: string;
  facilityId: number;
  city: string;
  title: string;
  schedule: string;
  content: string;
  openChatUrl: string;
  createdAt: string;
};

type MatePostResponse = {
  facilityId: number;
  title: string;
  meetingTime: string;
  content: string;
  openchatLink: string;
  createdAt: string;
  region: string;
};

type MatePagedResponse = {
  content: MatePostResponse[];
  currentPage: number;
  size: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
};

// 도시명 ↔ 백엔드 Region enum 매핑
const REGION_BY_CITY: Record<string, string> = {
  서울: 'SEOUL',
  부산: 'BUSAN',
};

// ──────────────────────────────────────────────
// HTTP calls
// ──────────────────────────────────────────────

function toMatePost(post: MatePostResponse): MatePost {
  return {
    // GET 응답에 per-post id 가 없어 facilityId+createdAt 합성 키 사용
    id: `${post.facilityId}-${post.createdAt}`,
    facilityId: post.facilityId,
    city: post.region,
    title: post.title,
    schedule: post.meetingTime,
    content: post.content,
    openChatUrl: post.openchatLink,
    createdAt: post.createdAt,
  };
}

async function fetchMatePosts(city: string): Promise<MatePost[]> {
  const { data } = await api.get<MatePagedResponse>('/api/v1/mates', {
    params: {
      page: 0,
      size: 10,
      sort: 'createdAt,DESC',
    },
  });

  const targetRegion = REGION_BY_CITY[city];
  const posts = data.content.map(toMatePost);

  // 백엔드가 region 별 필터를 지원하기 전까지 클라이언트에서 필터.
  if (!targetRegion) return posts;
  return posts.filter((post) => post.city === targetRegion);
}

// ──────────────────────────────────────────────
// queryOptions
// ──────────────────────────────────────────────

export const matePostsQuery = (city: string) =>
  queryOptions({
    queryKey: ['mate', 'posts', city] as const,
    queryFn: () => fetchMatePosts(city),
    enabled: Boolean(city),
  });
