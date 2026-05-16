import type { Match } from "@/app/(b2c)/matches/_fetch";

export const scheduledMatch: Match = {
  id: "match-scheduled",
  homeTeam: "FC 서울",
  awayTeam: "수원 삼성",
  status: "scheduled",
  scheduledAt: "2026-05-16T19:00:00+09:00",
};

export const liveMatch: Match = {
  id: "match-live",
  homeTeam: "부산 아이파크",
  awayTeam: "제주 유나이티드",
  status: "live",
  scheduledAt: "2026-05-16T20:00:00+09:00",
};

export const finishedMatch: Match = {
  id: "match-finished",
  homeTeam: "대구 FC",
  awayTeam: "인천 유나이티드",
  status: "finished",
  scheduledAt: "2026-05-15T18:30:00+09:00",
};

export const matchList = [scheduledMatch, liveMatch, finishedMatch];
