import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FacilityBadge, facilityBadgeVariants } from './FacilityBadge';

describe('FacilityBadge', () => {
  it('variant에 맞는 라벨을 렌더링한다', () => {
    render(<FacilityBadge variant="courtAccess" />);

    expect(screen.getByText('코트진입 가능')).toBeInTheDocument();
  });

  it('모든 Figma variant 라벨을 제공한다', () => {
    const labels = facilityBadgeVariants.map((variant) => variant.label);

    expect(labels).toEqual([
      '코트진입 가능',
      '휠체어 대여',
      '휠체어 경사로',
      '장애인 주차장',
      '전용 샤워실',
      '안내견 환영',
      '점자 안내',
      '전담 직원 안내',
      '필담 가능',
      '시각화 안내서',
      '비상 시각알람',
      '단순한 룰',
      '조용한 환경',
      '독립 공간',
      '전문 지도사',
    ]);
  });

  it('Figma pill 스타일과 숨김 아이콘을 렌더링한다', () => {
    render(<FacilityBadge variant="visualGuide" />);
    const badge = screen.getByText('시각화 안내서').closest('[data-slot]');

    expect(badge).toHaveClass(
      'h-[27px]',
      'rounded-[20px]',
      'bg-facility-badge',
      'text-main-dark',
      'text-[12px]',
      'font-medium',
    );
    expect(badge?.querySelector('svg[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('카드용 wide spacing을 지원한다', () => {
    render(<FacilityBadge variant="wheelchairRamp" spacing="wide" />);

    const badge = screen.getByText('휠체어 경사로').closest('[data-slot]');
    expect(badge).toHaveClass('gap-[13px]');
  });
});
