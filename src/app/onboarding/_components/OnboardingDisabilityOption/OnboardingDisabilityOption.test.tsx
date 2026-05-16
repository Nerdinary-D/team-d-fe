import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  OnboardingDisabilityOption,
  OnboardingDisabilityOptionList,
} from './OnboardingDisabilityOption';

const selectedRequirements = [
  { id: 'step-free-entry', label: '단차없는 휠체어 진입', checked: true },
  {
    id: 'equipment-rental',
    label: '스포츠 휠체어 및 맞춤 장비대여',
    checked: false,
  },
  {
    id: 'accessible-changing-room',
    label: '휠체어 전용 탈의실 및 샤워실',
    checked: false,
  },
];

describe('OnboardingDisabilityOption', () => {
  it('라벨과 기본 아이콘을 렌더링한다', () => {
    render(<OnboardingDisabilityOption label="시각 장애" />);

    const option = screen.getByRole('button', { name: '시각 장애' });

    expect(option).toBeInTheDocument();
    expect(screen.getByText('🧠')).toBeInTheDocument();
  });

  it('default 상태 스타일을 렌더링한다', () => {
    render(<OnboardingDisabilityOption label="시각 장애" />);

    const option = screen.getByRole('button', { name: '시각 장애' });

    expect(option).toHaveAttribute('aria-pressed', 'false');
    expect(option).toHaveClass('h-[60px]', 'border-onboarding-card-border');
    expect(screen.getByText('시각 장애')).toHaveClass(
      'text-onboarding-card-description',
    );
  });

  it('selected 상태 스타일을 렌더링한다', () => {
    render(
      <OnboardingDisabilityOption
        label="지체 장애"
        requirements={selectedRequirements}
        selected
      />,
    );

    const group = screen.getByRole('group', { name: '지체 장애 체크리스트' });
    const option = screen.getByRole('button', { name: '지체 장애' });
    const checkedRequirement = screen.getByRole('button', {
      name: '단차없는 휠체어 진입',
    });
    const uncheckedRequirement = screen.getByRole('button', {
      name: '스포츠 휠체어 및 맞춤 장비대여',
    });

    expect(option).toHaveAttribute('aria-pressed', 'true');
    expect(group).toHaveClass('shrink-0', 'border-main', 'px-5', 'py-5');
    expect(screen.getByText('지체 장애')).toHaveClass('text-main');
    expect(screen.getByText('🧠')).toHaveClass(
      'text-onboarding-card-description',
    );
    expect(checkedRequirement).toHaveAttribute('aria-pressed', 'true');
    expect(uncheckedRequirement).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('단차없는 휠체어 진입')).toHaveClass('text-main');
    expect(screen.getByText('스포츠 휠체어 및 맞춤 장비대여')).toHaveClass(
      'text-onboarding-disabled-text',
    );
  });

  it('긴 세부 옵션은 카드 안에서 줄바꿈하고 체크박스가 첫 줄에 맞춰진다', () => {
    render(
      <OnboardingDisabilityOption
        label="발달 장애"
        requirements={[
          {
            id: 'simple-repetitive-exercise',
            label: '단순하고 직관적인 반복 동작 중심의 운동',
          },
        ]}
        selected
      />,
    );

    const requirement = screen.getByRole('button', {
      name: '단순하고 직관적인 반복 동작 중심의 운동',
    });
    const checkboxFrame = requirement.querySelector('svg')?.parentElement;
    const requirementText = screen.getByText(
      '단순하고 직관적인 반복 동작 중심의 운동',
    );

    expect(requirement).toHaveClass('min-h-[23px]', 'items-start');
    expect(checkboxFrame).toHaveClass('h-[23px]', 'items-center');
    expect(requirementText).toHaveClass('break-keep', 'leading-[23px]');
  });

  it('체크리스트를 선택하고 취소할 수 있도록 변경 핸들러를 호출한다', async () => {
    const user = userEvent.setup();
    const onRequirementCheckedChange = vi.fn();

    render(
      <OnboardingDisabilityOption
        label="지체 장애"
        onRequirementCheckedChange={onRequirementCheckedChange}
        requirements={selectedRequirements}
        selected
      />,
    );

    await user.click(
      screen.getByRole('button', { name: '스포츠 휠체어 및 맞춤 장비대여' }),
    );
    await user.click(
      screen.getByRole('button', { name: '단차없는 휠체어 진입' }),
    );

    expect(onRequirementCheckedChange).toHaveBeenNthCalledWith(
      1,
      selectedRequirements[1],
      true,
    );
    expect(onRequirementCheckedChange).toHaveBeenNthCalledWith(
      2,
      selectedRequirements[0],
      false,
    );
  });

  it('클릭하면 onClick 핸들러를 호출한다', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<OnboardingDisabilityOption label="청각 장애" onClick={onClick} />);

    await user.click(screen.getByRole('button', { name: '청각 장애' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('OnboardingDisabilityOptionList', () => {
  it('Figma 목록 간격과 너비를 렌더링한다', () => {
    render(
      <OnboardingDisabilityOptionList aria-label="장애 유형">
        <OnboardingDisabilityOption
          label="지체 장애"
          requirements={selectedRequirements}
          selected
        />
        <OnboardingDisabilityOption label="시각 장애" />
      </OnboardingDisabilityOptionList>,
    );

    const list = screen.getByLabelText('장애 유형');

    expect(list).toHaveClass('max-w-[328px]', 'gap-2.5');
  });
});
