import { SpotDetailView } from './_components/SpotDetailView';

type SpotDetailPageProps = {
  params: Promise<{ spotId: string }>;
};

export default async function SpotDetailPage({ params }: SpotDetailPageProps) {
  const { spotId } = await params;
  return <SpotDetailView spotId={spotId} />;
}
