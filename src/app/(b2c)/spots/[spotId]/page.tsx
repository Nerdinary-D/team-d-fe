import { PageContainer } from '@/components/common/PageContainer';
import { SpotMap } from './_components/SpotMap';

type SpotDetailPageProps = {
  params: Promise<{ spotId: string }>;
};
// FIXME: MOCK
const PLACEHOLDER_COORDS = {
  latitude: 37.5666103,
  longitude: 126.9783882,
} as const;

export default async function SpotDetailPage({ params }: SpotDetailPageProps) {
  const { spotId } = await params;

  return (
    <PageContainer as="main" size="md">
      <h1 className="mb-4 text-2xl font-bold">시설 상세 (spotId: {spotId})</h1>
      <SpotMap
        latitude={PLACEHOLDER_COORDS.latitude}
        longitude={PLACEHOLDER_COORDS.longitude}
      />
    </PageContainer>
  );
}
