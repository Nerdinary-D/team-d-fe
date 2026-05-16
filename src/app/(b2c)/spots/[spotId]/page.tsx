import { PageContainer } from "@/components/common/PageContainer";

type SpotDetailPageProps = {
  params: Promise<{ spotId: string }>;
};

export default async function SpotDetailPage({ params }: SpotDetailPageProps) {
  const { spotId } = await params;

  return (
    <PageContainer as="main" size="md">
      <h1 className="text-2xl font-bold">시설 상세 (spotId: {spotId})</h1>
    </PageContainer>
  );
}
