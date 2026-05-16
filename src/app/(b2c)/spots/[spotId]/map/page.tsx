import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { spotQuery } from '../_fetch';
import { SpotMapFullView } from './_components/SpotMapFullView';

type SpotMapPageProps = {
  params: Promise<{ spotId: string }>;
};

export default async function SpotMapPage({ params }: SpotMapPageProps) {
  const { spotId } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(spotQuery(spotId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SpotMapFullView spotId={spotId} />
    </HydrationBoundary>
  );
}
