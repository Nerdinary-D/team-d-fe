import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/common/Card';
import { cn } from '@/lib/utils';
import type { Match, MatchStatus } from '../_fetch';

const statusLabel: Record<MatchStatus, string> = {
  scheduled: '예정',
  live: 'LIVE',
  finished: '종료',
};

const statusClass: Record<MatchStatus, string> = {
  scheduled: 'text-muted-foreground',
  live: 'text-red-500',
  finished: 'text-muted-foreground line-through',
};

export type MatchCardProps = {
  match: Match;
};

export function MatchCard({ match }: MatchCardProps) {
  const status = (
    <span className={cn('text-xs font-medium', statusClass[match.status])}>
      {statusLabel[match.status]}
    </span>
  );

  const teams = (
    <div className="flex items-center justify-between text-base font-semibold">
      <span>{match.homeTeam}</span>
      <span className="text-xs text-muted-foreground">vs</span>
      <span>{match.awayTeam}</span>
    </div>
  );

  const schedule = (
    <p className="text-xs text-muted-foreground">
      {new Date(match.scheduledAt).toLocaleString('ko-KR')}
    </p>
  );

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>경기</span>
          {status}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {teams}
        {schedule}
      </CardContent>
    </Card>
  );
}
