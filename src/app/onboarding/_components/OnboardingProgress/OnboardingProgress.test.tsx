import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OnboardingProgress } from './OnboardingProgress';

describe('OnboardingProgress', () => {
  it('Figma 기본 단계 라벨을 렌더링한다', () => {
    render(<OnboardingProgress />);

    expect(screen.getByLabelText('1/3 단계')).toBeInTheDocument();
    expect(screen.getByText('1')).toHaveClass('text-main');
    expect(screen.getByText('/3').closest('p')).toHaveClass(
      'text-onboarding-progress-total',
    );
  });

  it('progressbar 역할과 현재 단계 값을 제공한다', () => {
    render(<OnboardingProgress currentStep={2} totalSteps={4} />);

    const progress = screen.getByRole('progressbar', {
      name: '2/4 단계',
    });

    expect(progress).toHaveAttribute('aria-valuemin', '1');
    expect(progress).toHaveAttribute('aria-valuemax', '4');
    expect(progress).toHaveAttribute('aria-valuenow', '2');
  });

  it('기본값으로 3개 segment 중 첫 번째만 활성화한다', () => {
    render(<OnboardingProgress />);

    const segments = screen
      .getByLabelText('1/3 단계')
      .querySelectorAll('[aria-hidden="true"] > div');

    expect(segments).toHaveLength(3);
    expect(segments[0]).toHaveClass('bg-main');
    expect(segments[1]).toHaveClass('bg-onboarding-progress-inactive');
    expect(segments[2]).toHaveClass('bg-onboarding-progress-inactive');
  });

  it('현재 단계 숫자와 활성 segment 수를 일치시킨다', () => {
    render(<OnboardingProgress currentStep={2} totalSteps={4} />);

    const progress = screen.getByLabelText('2/4 단계');
    const segments = progress.querySelectorAll('[aria-hidden="true"] > div');

    expect(screen.getByText('2')).toHaveClass('text-main');
    expect(screen.getByText('/4')).toBeInTheDocument();
    expect(segments).toHaveLength(4);
    expect(segments[0]).toHaveClass('bg-main');
    expect(segments[1]).toHaveClass('bg-main');
    expect(segments[2]).toHaveClass('bg-onboarding-progress-inactive');
    expect(segments[3]).toHaveClass('bg-onboarding-progress-inactive');
  });
});
