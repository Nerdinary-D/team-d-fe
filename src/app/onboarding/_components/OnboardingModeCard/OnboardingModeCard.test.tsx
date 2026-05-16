import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OnboardingModeCard } from './OnboardingModeCard';

const defaultProps = {
  title: '사용자 모드',
  description:
    '설명 텍스트설명 텍스트설명 텍스트설명 텍스트설명 텍스트설명 텍스트',
};

describe('OnboardingModeCard', () => {
  it('제목과 설명을 렌더링한다', () => {
    render(<OnboardingModeCard {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: /사용자 모드/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
  });

  it('default 상태 스타일을 렌더링한다', () => {
    render(<OnboardingModeCard {...defaultProps} />);

    const card = screen.getByRole('button', { name: /사용자 모드/ });
    expect(card).toHaveAttribute('aria-pressed', 'false');
    expect(card).toHaveClass('border-onboarding-card-border');
    expect(card.querySelector('svg')).toHaveClass(
      'text-onboarding-card-border',
    );
  });

  it('selected 상태 스타일을 렌더링한다', () => {
    render(<OnboardingModeCard {...defaultProps} selected />);

    const card = screen.getByRole('button', { name: /사용자 모드/ });
    expect(card).toHaveAttribute('aria-pressed', 'true');
    expect(card).toHaveClass('border-main');
    expect(card.querySelector('svg')).toHaveClass('text-main');
  });

  it('클릭하면 onClick 핸들러를 호출한다', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<OnboardingModeCard {...defaultProps} onClick={onClick} />);

    await user.click(screen.getByRole('button', { name: /사용자 모드/ }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
