'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { cn } from '@/lib/utils';
import { healthQuery } from '../_fetch';

export function HealthCheckPanel() {
  const { data, isFetching, isError, error, refetch, dataUpdatedAt } =
    useQuery(healthQuery());

  const statusBadge = (() => {
    if (isFetching) {
      return <span className="text-xs text-muted-foreground">요청 중…</span>;
    }
    if (isError) {
      return <span className="text-xs font-medium text-red-500">FAIL</span>;
    }
    if (data) {
      return <span className="text-xs font-medium text-emerald-600">OK</span>;
    }
    return null;
  })();

  const body = (() => {
    if (isError) {
      return (
        <p className="text-sm text-red-500">
          {error instanceof Error ? error.message : '알 수 없는 오류'}
        </p>
      );
    }

    if (!data) {
      return (
        <p className="text-sm text-muted-foreground">아직 호출하지 않음</p>
      );
    }

    return (
      <div className="space-y-1 text-sm">
        <p>
          <span className="text-muted-foreground">message: </span>
          <code className="rounded bg-muted px-1.5 py-0.5">{data.message}</code>
        </p>
        <p className="text-xs text-muted-foreground">
          baseURL: {data.baseURL || '(unset)'}
        </p>
        {dataUpdatedAt > 0 ? (
          <p className="text-xs text-muted-foreground">
            마지막 응답: {new Date(dataUpdatedAt).toLocaleTimeString('ko-KR')}
          </p>
        ) : null}
      </div>
    );
  })();

  return (
    <Card size="sm" className={cn('mb-4')}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm">
          <span>GET /health</span>
          {statusBadge}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {body}
        <Button
          size="sm"
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          다시 호출
        </Button>
      </CardContent>
    </Card>
  );
}
