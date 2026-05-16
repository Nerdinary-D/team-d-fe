import type { PartnerPost, Spot } from "@/app/(b2c)/spots/[spotId]/_schema";

export const sampleSpot: Spot = {
  id: "1",
  name: "서울시청 풋살장",
  sport: "풋살",
  address: "서울특별시 중구 세종대로 110",
  latitude: 37.5666103,
  longitude: 126.9783882,
  imageUrl: "https://picsum.photos/seed/spot-1/720/430",
  infraList: ["휠체어 경사로", "주차 가능", "샤워 시설"],
};

export const samplePost: PartnerPost = {
  id: "p1",
  spotId: "1",
  title: "함께 풋살하실 분 구합니다",
  schedule: "매주 월요일 / 6시",
  content:
    "주 1회 풋살 함께 즐길 메이트 모집합니다. 초보 환영이에요! 가볍게 운동하고 친목 다지실 분 연락 주세요.",
  openChatUrl: "https://open.kakao.com/o/example1",
  createdAt: "2026-05-10T12:00:00.000Z",
};

export const samplePostShort: PartnerPost = {
  id: "p2",
  spotId: "1",
  title: "주말 풋살 모임",
  schedule: "매주 토요일 / 10시",
  content: "토요일 아침 풋살 메이트 구해요. 실력은 중급 정도.",
  openChatUrl: "https://open.kakao.com/o/example2",
  createdAt: "2026-05-12T09:00:00.000Z",
};
