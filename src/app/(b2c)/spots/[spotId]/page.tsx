import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { SpotDetailView } from './_components/SpotDetailView';
import { partnerPostsQuery, spotQuery } from './_fetch';

type SpotDetailPageProps = {
  params: Promise<{ spotId: string }>;
};

export default async function SpotDetailPage({ params }: SpotDetailPageProps) {
  const { spotId } = await params;

  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery(spotQuery(spotId)),
    queryClient.prefetchQuery(partnerPostsQuery(spotId)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SpotDetailView spotId={spotId} />
    </HydrationBoundary>
  );
}
