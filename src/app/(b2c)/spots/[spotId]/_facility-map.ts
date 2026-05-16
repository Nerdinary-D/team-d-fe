// FIXME: 백엔드 enum 전체 카테고리 확정되면 갱신
export const CATEGORY_LABEL: Record<string, string> = {
  BADMINTON: '배드민턴',
};

// 백엔드 Curation enum → 사용자 노출용 한글 라벨
// 출처: 백엔드 enum description ("#태그" 부분에 해당)
export const CURATION_LABEL: Record<string, string> = {
  NO_STEP_COURT_ENTRY: '단차 없는 코트 진입',
  SPORTS_WHEELCHAIR_RENTAL: '스포츠 휠체어 대여',
  ACCESSIBLE_SHOWER_ROOM: '휠체어 전용 샤워실',
  GUIDE_DOG_ALLOWED: '안내견 동반 환영',
  BRAILLE_INFRASTRUCTURE: '점자 안내 인프라',
  VERBAL_GUIDANCE: '전담 구두 안내',
  WRITTEN_COMMUNICATION: '필담 안내 가이드',
  VISUAL_MANUAL: '시각 중심 매뉴얼',
  VISUAL_ALARM: '비상시 시각 알람',
  SIMPLE_SPORTS_RULE: '단순 직관 스포츠룰',
  LOW_STIMULUS_ENVIRONMENT: '저자극 차분한 환경',
  PRIVATE_SPACE: '프라이빗 독립 공간',
  CERTIFIED_INSTRUCTOR: '장애인 전문 지도사',
};
