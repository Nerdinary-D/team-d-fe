import type { CustomerCuration } from './_fetch';

/**
 * 온보딩 requirement id ↔ 백엔드 Curation enum 매핑.
 * `physical-onboarding-copy` 같은 placeholder 는 매핑 대상에서 제외한다.
 */
const REQUIREMENT_TO_CURATION: Record<string, CustomerCuration> = {
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

export function mapRequirementsToCustomerCurations(
  requirementIds: string[],
): CustomerCuration[] {
  const seen = new Set<CustomerCuration>();
  for (const id of requirementIds) {
    const curation = REQUIREMENT_TO_CURATION[id];
    if (curation) seen.add(curation);
  }
  return Array.from(seen);
}
