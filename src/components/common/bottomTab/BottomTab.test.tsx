import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BottomTab, isBottomTabItemActive } from './BottomTab';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('BottomTab', () => {
  it('현재 경로에 맞는 탭을 활성 상태로 표시한다', () => {
    render(<BottomTab activePathname="/matches" />);

    expect(screen.getByRole('link', { name: '메이트' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: '홈' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('360px보다 넓은 휴대폰에서도 네비게이션 폭을 화면에 맞춘다', () => {
    render(<BottomTab />);

    const nav = screen.getByRole('navigation', { name: '메인 네비게이션' });
    const links = screen.getAllByRole('link');

    expect(nav).toHaveClass('grid', 'grid-cols-3', 'w-full', 'max-w-none');
    expect(nav).not.toHaveClass('max-w-[360px]');
    expect(nav).not.toHaveClass('gap-[68px]');

    for (const link of links) {
      expect(link).toHaveClass('w-full', 'min-w-0', 'max-w-[72px]');
      expect(link).not.toHaveClass('w-[50px]');
    }
  });
});

describe('isBottomTabItemActive', () => {
  it('하위 경로에서도 부모 탭을 활성 상태로 판단한다', () => {
    expect(isBottomTabItemActive('/matches/123', '/matches')).toBe(true);
    expect(isBottomTabItemActive('/my/settings', '/my')).toBe(true);
    expect(isBottomTabItemActive('/matches', '/')).toBe(false);
  });
});
