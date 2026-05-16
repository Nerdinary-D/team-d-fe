'use client';

import { useQuery } from '@tanstack/react-query';
import { EmptyState } from '@/components/common/EmptyState';
import { PageContainer } from '@/components/common/PageContainer';
import { SkeletonText } from '@/components/common/Skeleton';
import { HealthCheckPanel } from './_components/HealthCheckPanel';
import { MatchCard } from './_components/MatchCard';
import { matchesQuery } from './_fetch';

export default function MatchesPage() {
  const { data, isLoading, isError } = useQuery(matchesQuery());

  const header = <h1 className="mb-6 text-2xl font-bold">경기 목록</h1>;

  const body = (() => {
    if (isLoading) {
      return <SkeletonText lines={5} />;
    }

    if (isError) {
      return (
        <EmptyState
          title="불러오기 실패"
          description="경기 정보를 가져오지 못했습니다. 잠시 후 다시 시도해주세요."
        />
      );
    }

    if (!data || data.length === 0) {
      return (
        <EmptyState
          title="등록된 경기가 없습니다"
          description="새 경기가 등록되면 여기에 표시됩니다."
        />
      );
    }

    return (
      <div className="grid gap-3">
        {data.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    );
  })();

  return (
    <PageContainer as="main" size="md">
      {header}
      <HealthCheckPanel />
      {body}
    </PageContainer>
  );
}
