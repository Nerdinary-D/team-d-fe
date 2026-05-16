import type { MatePost } from './_fetch';

// FIXME: MOCK — 백엔드 API 연결 시 제거
const POSTS_BY_CITY: Record<string, MatePost[]> = {
  서울: [
    {
      id: 'm1',
      city: '서울',
      title: '월요일 풋살 메이트 구해요',
      schedule: '매주 월요일 / 6시',
      content:
        '서울시청 풋살장에서 가볍게 뛸 분 모집합니다. 초보 환영, 매너 우선!',
      openChatUrl: 'https://open.kakao.com/o/mate1',
      createdAt: '2026-05-14T12:00:00.000Z',
    },
    {
      id: 'm2',
      city: '서울',
      title: '주말 농구 같이 하실 분',
      schedule: '매주 토요일 / 10시',
      content:
        '한강공원 농구장에서 주말마다 농구 메이트 구합니다. 실력은 중급 이상.',
      openChatUrl: 'https://open.kakao.com/o/mate2',
      createdAt: '2026-05-12T09:00:00.000Z',
    },
    {
      id: 'm3',
      city: '서울',
      title: '평일 저녁 러닝 크루',
      schedule: '매주 수/금 / 19:30',
      content:
        '여의도 한강 러닝 크루 멤버 모집합니다. 5km 페이스 자유, 부담 없이 오세요!',
      openChatUrl: 'https://open.kakao.com/o/mate3',
      createdAt: '2026-05-11T18:00:00.000Z',
    },
  ],
};

const DEFAULT_CITY = '서울';

export function getMockMatePosts(city: string): MatePost[] {
  return POSTS_BY_CITY[city] ?? POSTS_BY_CITY[DEFAULT_CITY] ?? [];
}
