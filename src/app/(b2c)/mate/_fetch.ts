import { queryOptions } from '@tanstack/react-query';
import { getMockMatePosts } from './_mock';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type MatePost = {
  id: string;
  city: string;
  title: string;
  schedule: string;
  content: string;
  openChatUrl: string;
  createdAt: string;
};

// ──────────────────────────────────────────────
// HTTP calls — FIXME: MOCK, axios로 교체
// ──────────────────────────────────────────────

function mockDelay() {
  return new Promise<void>((resolve) => setTimeout(resolve, 200));
}

async function fetchMatePosts(city: string): Promise<MatePost[]> {
  await mockDelay();
  return getMockMatePosts(city);
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
