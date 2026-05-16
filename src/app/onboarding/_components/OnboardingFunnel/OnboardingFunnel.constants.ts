import type {
  DisabilityOption,
  OnboardingFormState,
  OnboardingMode,
  OnboardingStep,
} from './OnboardingFunnel.types';

export const ONBOARDING_STORAGE_KEY = 'allground:onboarding';

export const STEPS: OnboardingStep[] = ['mode', 'disability', 'profile'];

export const initialFormState: OnboardingFormState = {
  disabilityTypes: [],
  nickname: '',
  requirements: [],
};

const MODE_DESCRIPTION =
  '설명 텍스트설명 텍스트설명 텍스트설명 텍스트설명 텍스트설명 텍스트';

export const MODE_OPTIONS: Array<{
  description: string;
  id: OnboardingMode;
  title: string;
}> = [
  {
    id: 'owner',
    title: '사장님 모드',
    description: MODE_DESCRIPTION,
  },
  {
    id: 'user',
    title: '사용자 모드',
    description: MODE_DESCRIPTION,
  },
];

export const DISABILITY_OPTIONS: DisabilityOption[] = [
  {
    id: 'physical',
    label: '지체 장애',
    icon: '🧠',
    requirements: [
      { id: 'physical-onboarding-copy', label: '온보딩 문구' },
      { id: 'step-free-entry', label: '단차 없는 휠체어 진입' },
      { id: 'equipment-rental', label: '스포츠 휠체어 및 맞춤 장비대여' },
      { id: 'accessible-changing-room', label: '휠체어 전용 탈의실 및 샤워실' },
    ],
  },
  {
    id: 'visual',
    label: '시각 장애',
    icon: '🧠',
    requirements: [
      {
        id: 'guide-dog-entry',
        label: '시각장애인 안내견 동반 입장 가능',
      },
      {
        id: 'braille-blocks-and-signage',
        label: '점자 블록 및 점자 안내판 설치',
      },
      {
        id: 'staff-verbal-guidance',
        label: '직원의 전담 구두 안내',
      },
    ],
  },
  {
    id: 'hearing',
    label: '청각 장애',
    icon: '🧠',
    requirements: [
      {
        id: 'writing-board-or-tablet',
        label: '필담 보드 또는 소통용 태블릿 기기',
      },
      {
        id: 'visual-exercise-manual',
        label: '그림, 텍스트 중심 시각화 운동 매뉴얼',
      },
      {
        id: 'visual-emergency-alert',
        label: '비상 안내용 경광등 및 불빛 시각 알람',
      },
    ],
  },
  {
    id: 'developmental',
    label: '발달 장애',
    icon: '🧠',
    requirements: [
      {
        id: 'simple-repetitive-exercise',
        label: '단순하고 직관적인 반복 동작 중심의 운동',
      },
      {
        id: 'low-stimulation-space',
        label: '저자극 공간',
      },
      {
        id: 'private-separated-space',
        label: '타인과 분리된 독립 공간',
      },
      {
        id: 'certified-adapted-sports-instructor',
        label: '장애인 스포츠 지도자 자격증 보유 강사 상주',
      },
    ],
  },
];
