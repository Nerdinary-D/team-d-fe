import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OnboardingFunnel } from './OnboardingFunnel';

const replace = vi.fn();
let storedItems: Record<string, string>;

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace,
  }),
}));

describe('OnboardingFunnel', () => {
  beforeEach(() => {
    storedItems = {};
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: vi.fn((key: string) => storedItems[key] ?? null),
        setItem: vi.fn((key: string, value: string) => {
          storedItems[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete storedItems[key];
        }),
        clear: vi.fn(() => {
          storedItems = {};
        }),
      },
    });
    replace.mockClear();
  });

  it('첫 단계에서 스테이터스 바 없이 선택되지 않은 모드 선택 퍼널을 렌더링한다', () => {
    render(<OnboardingFunnel />);

    expect(screen.getByLabelText('1/3 단계')).toBeInTheDocument();
    expect(screen.queryByText('9:41')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /어떤 모드로/ }));
    expect(screen.getByText('올그라운드를 이용할까요?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '사장님 모드' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: '사용자 모드' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
    expect(
      screen.queryByRole('button', { name: '이전' }),
    ).not.toBeInTheDocument();
  });

  it('2단계는 처음에 장애 유형과 세부 옵션이 모두 선택되지 않는다', async () => {
    const user = userEvent.setup();
    render(<OnboardingFunnel />);

    await user.click(screen.getByRole('button', { name: /사용자 모드/ }));
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(screen.getByLabelText('2/3 단계')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /어떤 운동환경이/ }));
    expect(screen.getByText('필요하신가요?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '지체 장애' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: '시각 장애' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: '청각 장애' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: '발달 장애' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(
      screen.queryByRole('group', { name: '지체 장애 체크리스트' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '온보딩 문구' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
    expect(
      screen.queryByRole('button', { name: '이전' }),
    ).not.toBeInTheDocument();
  });

  it('장애 유형과 세부사항을 하나 이상 선택해야 다음으로 넘어간다', async () => {
    const user = userEvent.setup();
    render(<OnboardingFunnel />);

    await user.click(screen.getByRole('button', { name: /사용자 모드/ }));
    await user.click(screen.getByRole('button', { name: '다음' }));
    await user.click(screen.getByRole('button', { name: '지체 장애' }));

    expect(screen.getByRole('group', { name: '지체 장애 체크리스트' }));
    expect(screen.getByRole('button', { name: '온보딩 문구' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(
      screen.getByRole('button', { name: '단차 없는 휠체어 진입' }),
    ).toHaveAttribute('aria-pressed', 'false');

    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();

    await user.click(
      screen.getByRole('button', { name: '단차 없는 휠체어 진입' }),
    );

    expect(screen.getByRole('button', { name: '다음' })).toBeEnabled();
  });

  it('장애 유형은 여러 개 선택할 수 있지만 세부사항이 없으면 다음으로 넘어가지 않는다', async () => {
    const user = userEvent.setup();
    render(<OnboardingFunnel />);

    await user.click(screen.getByRole('button', { name: '사용자 모드' }));
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: '지체 장애' }));
    await user.click(screen.getByRole('button', { name: '시각 장애' }));
    await user.click(screen.getByRole('button', { name: '청각 장애' }));

    expect(screen.getByRole('button', { name: '지체 장애' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: '시각 장애' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: '청각 장애' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('group', { name: '지체 장애 체크리스트' }));
    expect(
      screen.getByRole('button', { name: '시각장애인 안내견 동반 입장 가능' }),
    ).toHaveAttribute('aria-pressed', 'false');
    expect(
      screen.getByRole('button', { name: '필담 보드 또는 소통용 태블릿 기기' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();

    await user.click(
      screen.getByRole('button', { name: '필담 보드 또는 소통용 태블릿 기기' }),
    );

    expect(screen.getByRole('button', { name: '다음' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: '지체 장애' }));
    await user.click(screen.getByRole('button', { name: '시각 장애' }));
    await user.click(screen.getByRole('button', { name: '청각 장애' }));

    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
  });

  it('2단계는 제목과 CTA를 고정하고 선택 목록만 스크롤한다', async () => {
    const user = userEvent.setup();
    render(<OnboardingFunnel />);

    await user.click(screen.getByRole('button', { name: '사용자 모드' }));
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(screen.getByRole('main')).toHaveClass('h-dvh', 'overflow-hidden');
    expect(screen.getByLabelText('필요 환경')).toHaveClass(
      'overflow-y-auto',
      'flex-1',
      'scrollbar-none',
    );
    expect(screen.getByRole('heading', { name: /어떤 운동환경이/ }));
    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
  });

  it('장애 유형별 세부 옵션을 보여준다', async () => {
    const user = userEvent.setup();
    render(<OnboardingFunnel />);

    await user.click(screen.getByRole('button', { name: '사용자 모드' }));
    await user.click(screen.getByRole('button', { name: '다음' }));
    await user.click(screen.getByRole('button', { name: '청각 장애' }));

    expect(
      screen.getByRole('button', {
        name: '그림, 텍스트 중심 시각화 운동 매뉴얼',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: '비상 안내용 경광등 및 불빛 시각 알람',
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '발달 장애' }));

    expect(
      screen.getByRole('button', {
        name: '단순하고 직관적인 반복 동작 중심의 운동',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '저자극 공간' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '타인과 분리된 독립 공간' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: '장애인 스포츠 지도자 자격증 보유 강사 상주',
      }),
    ).toBeInTheDocument();
  });

  it('3단계에서 Figma 입력 전/후 상태에 맞춰 CTA 라벨과 활성 상태를 바꾼다', async () => {
    const user = userEvent.setup();
    render(<OnboardingFunnel />);

    await user.click(screen.getByRole('button', { name: '사용자 모드' }));
    await user.click(screen.getByRole('button', { name: '다음' }));
    await user.click(screen.getByRole('button', { name: '지체 장애' }));
    await user.click(
      screen.getByRole('button', { name: '단차 없는 휠체어 진입' }),
    );
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(screen.getByLabelText('3/3 단계')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /마지막으로,/ }));
    expect(screen.getByText('닉네임을 알려주세요!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '완료' })).toBeDisabled();

    await user.type(
      screen.getByPlaceholderText('닉네임을 입력하세요.'),
      '너디너리',
    );

    expect(screen.getByRole('button', { name: '완료' })).toBeEnabled();
  });

  it('완료하면 온보딩 입력값을 저장하고 홈으로 이동한다', async () => {
    const user = userEvent.setup();
    render(<OnboardingFunnel />);

    await user.click(screen.getByRole('button', { name: '사용자 모드' }));
    await user.click(screen.getByRole('button', { name: '다음' }));
    await user.click(screen.getByRole('button', { name: '지체 장애' }));
    await user.click(
      screen.getByRole('button', { name: '단차 없는 휠체어 진입' }),
    );
    await user.click(screen.getByRole('button', { name: '다음' }));
    await user.type(
      screen.getByPlaceholderText('닉네임을 입력하세요.'),
      '너디너리',
    );
    await user.click(screen.getByRole('button', { name: '완료' }));

    const savedOnboarding = window.localStorage.getItem('allground:onboarding');
    expect(savedOnboarding).not.toBeNull();
    expect(JSON.parse(savedOnboarding ?? '{}')).toMatchObject({
      mode: 'user',
      disabilityTypes: ['physical'],
      requirements: ['step-free-entry'],
      nickname: '너디너리',
      completedAt: expect.any(String),
    });
    expect(replace).toHaveBeenCalledWith('/');
  });

  it('저장소 기록이 실패해도 완료 후 홈으로 이동한다', async () => {
    window.localStorage.setItem = vi.fn(() => {
      throw new Error('storage unavailable');
    });

    const user = userEvent.setup();
    render(<OnboardingFunnel />);

    await user.click(screen.getByRole('button', { name: '사용자 모드' }));
    await user.click(screen.getByRole('button', { name: '다음' }));
    await user.click(screen.getByRole('button', { name: '지체 장애' }));
    await user.click(
      screen.getByRole('button', { name: '단차 없는 휠체어 진입' }),
    );
    await user.click(screen.getByRole('button', { name: '다음' }));
    await user.type(
      screen.getByPlaceholderText('닉네임을 입력하세요.'),
      '너디너리',
    );
    await user.click(screen.getByRole('button', { name: '완료' }));

    expect(replace).toHaveBeenCalledWith('/');
  });
});
