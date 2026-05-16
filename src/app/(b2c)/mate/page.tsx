import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { MateView } from './_components/MateView';
import { matePostsQuery } from './_fetch';

const DEFAULT_CITY = '서울';

export default async function MatePage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(matePostsQuery(DEFAULT_CITY));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MateView />
    </HydrationBoundary>
  );
}
