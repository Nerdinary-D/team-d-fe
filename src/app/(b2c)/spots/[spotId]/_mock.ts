import type { PartnerPost, Spot } from "./_schema";

// FIXME: MOCK — 백엔드 API 연결 시 제거
const SPOTS: Record<string, Spot> = {
  "1": {
    id: "1",
    name: "서울시청 풋살장",
    sport: "풋살",
    address: "서울특별시 중구 세종대로 110",
    latitude: 37.5666103,
    longitude: 126.9783882,
    imageUrl: "https://picsum.photos/seed/spot-1/720/430",
    infraList: ["휠체어 경사로", "주차 가능", "샤워 시설"],
  },
  "2": {
    id: "2",
    name: "한강공원 농구장",
    sport: "농구",
    address: "서울특별시 영등포구 여의동로 330",
    latitude: 37.5283169,
    longitude: 126.9326747,
    imageUrl: "https://picsum.photos/seed/spot-2/720/430",
    infraList: ["야외 코트", "주차 가능"],
  },
};

const POSTS: Record<string, PartnerPost[]> = {
  "1": [
    {
      id: "p1",
      spotId: "1",
      title: "함께 풋살하실 분 구합니다",
      schedule: "매주 월요일 / 6시",
      content:
        "주 1회 풋살 함께 즐길 메이트 모집합니다. 초보 환영이에요! 가볍게 운동하고 친목 다지실 분 연락 주세요.",
      openChatUrl: "https://open.kakao.com/o/example1",
      createdAt: "2026-05-10T12:00:00.000Z",
    },
    {
      id: "p2",
      spotId: "1",
      title: "주말 풋살 모임",
      schedule: "매주 토요일 / 10시",
      content:
        "토요일 아침 풋살 메이트 구해요. 실력은 중급 정도이고 매너 좋으신 분만 참여 부탁드립니다.",
      openChatUrl: "https://open.kakao.com/o/example2",
      createdAt: "2026-05-12T09:00:00.000Z",
    },
  ],
  "2": [],
};

const DEFAULT_SPOT_ID = "1";

export function getMockSpot(spotId: string): Spot {
  const found = SPOTS[spotId];
  if (found) return found;
  return { ...SPOTS[DEFAULT_SPOT_ID], id: spotId };
}

export function getMockPartnerPosts(spotId: string): PartnerPost[] {
  return POSTS[spotId] ?? [];
}

export function addMockPartnerPost(post: PartnerPost): void {
  const list = POSTS[post.spotId] ?? [];
  POSTS[post.spotId] = [post, ...list];
}

export function generateMockPostId(): string {
  return `p${Date.now()}`;
}
