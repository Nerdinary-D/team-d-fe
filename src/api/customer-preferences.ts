export const CUSTOMER_REGIONS = [
  'SEOUL',
  'DAEJEON',
  'GYEONGGI',
  'DAEGU',
  'INCHEON',
  'GWANGJU',
  'BUSAN',
  'ULSAN',
  'GANGWON',
  'SEJONG',
] as const;

export type CustomerRegion = (typeof CUSTOMER_REGIONS)[number];

export const LOCATION_LABEL_TO_REGION: Record<string, CustomerRegion> = {
  서울: 'SEOUL',
  대전: 'DAEJEON',
  경기: 'GYEONGGI',
  대구: 'DAEGU',
  인천: 'INCHEON',
  광주: 'GWANGJU',
  부산: 'BUSAN',
  울산: 'ULSAN',
  강원: 'GANGWON',
  세종: 'SEJONG',
};

export const REGION_TO_LOCATION_LABEL: Record<CustomerRegion, string> = {
  SEOUL: '서울',
  DAEJEON: '대전',
  GYEONGGI: '경기',
  DAEGU: '대구',
  INCHEON: '인천',
  GWANGJU: '광주',
  BUSAN: '부산',
  ULSAN: '울산',
  GANGWON: '강원',
  SEJONG: '세종',
};

export const CURATIONS = [
  'NO_STEP_COURT_ENTRY',
  'SPORTS_WHEELCHAIR_RENTAL',
  'ACCESSIBLE_SHOWER_ROOM',
  'GUIDE_DOG_ALLOWED',
  'BRAILLE_INFRASTRUCTURE',
  'VERBAL_GUIDANCE',
  'WRITTEN_COMMUNICATION',
  'VISUAL_MANUAL',
  'VISUAL_ALARM',
  'SIMPLE_SPORTS_RULE',
  'LOW_STIMULUS_ENVIRONMENT',
  'PRIVATE_SPACE',
  'CERTIFIED_INSTRUCTOR',
] as const;

export type Curation = (typeof CURATIONS)[number];

const CURATION_TO_DISABILITY_LABEL: Record<Curation, string> = {
  NO_STEP_COURT_ENTRY: '지체 장애',
  SPORTS_WHEELCHAIR_RENTAL: '지체 장애',
  ACCESSIBLE_SHOWER_ROOM: '지체 장애',
  GUIDE_DOG_ALLOWED: '시각 장애',
  BRAILLE_INFRASTRUCTURE: '시각 장애',
  VERBAL_GUIDANCE: '시각 장애',
  WRITTEN_COMMUNICATION: '청각 장애',
  VISUAL_MANUAL: '청각 장애',
  VISUAL_ALARM: '청각 장애',
  SIMPLE_SPORTS_RULE: '발달 장애',
  LOW_STIMULUS_ENVIRONMENT: '발달 장애',
  PRIVATE_SPACE: '발달 장애',
  CERTIFIED_INSTRUCTOR: '발달 장애',
};

const REQUIREMENT_TO_CURATION: Record<string, Curation> = {
  'step-free-entry': 'NO_STEP_COURT_ENTRY',
  'equipment-rental': 'SPORTS_WHEELCHAIR_RENTAL',
  'accessible-changing-room': 'ACCESSIBLE_SHOWER_ROOM',
  'guide-dog-entry': 'GUIDE_DOG_ALLOWED',
  'braille-blocks-and-signage': 'BRAILLE_INFRASTRUCTURE',
  'staff-verbal-guidance': 'VERBAL_GUIDANCE',
  'writing-board-or-tablet': 'WRITTEN_COMMUNICATION',
  'visual-exercise-manual': 'VISUAL_MANUAL',
  'visual-emergency-alert': 'VISUAL_ALARM',
  'simple-repetitive-exercise': 'SIMPLE_SPORTS_RULE',
  'low-stimulation-space': 'LOW_STIMULUS_ENVIRONMENT',
  'private-separated-space': 'PRIVATE_SPACE',
  'certified-adapted-sports-instructor': 'CERTIFIED_INSTRUCTOR',
};

export function mapRequirementsToCurations(
  requirementIds: string[],
): Curation[] {
  const seen = new Set<Curation>();
  for (const id of requirementIds) {
    const curation = REQUIREMENT_TO_CURATION[id];
    if (curation) seen.add(curation);
  }
  return Array.from(seen);
}

export function curationsToDisabilityLabel(
  curations: Curation[],
  fallback: string,
): string {
  const labels = Array.from(
    new Set(
      curations.map((curation) => CURATION_TO_DISABILITY_LABEL[curation]),
    ),
  );

  if (labels.length === 0) return fallback;
  if (labels.length === 1) return labels[0];
  return `${labels[0]} 외 ${labels.length - 1}개`;
}
