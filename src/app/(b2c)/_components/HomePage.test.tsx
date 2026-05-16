import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { HomePage } from './HomePage';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('HomePage', () => {
  it('Figma 홈 화면의 환영 문구와 위치 선택 영역을 렌더링한다', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', { name: '000님, 환영해요 😀' }),
    ).toBeInTheDocument();
    expect(screen.getByText('00님을 위한')).toBeInTheDocument();
    expect(screen.getByText('안심 그라운드')).toHaveClass('text-main');
    expect(
      screen.getByRole('button', { name: '지역 선택: 서울' }),
    ).toBeInTheDocument();
  });

  it('시설 카드 3개와 기본 뱃지 구성을 보여준다', () => {
    render(<HomePage />);

    expect(screen.getAllByRole('heading', { name: '시설 명' })).toHaveLength(3);
    expect(screen.getAllByText('종목명')).toHaveLength(3);
    expect(screen.getAllByText('휠체어 경사로')).toHaveLength(2);
    expect(screen.getAllByText('장애인 주차장')).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: '찜하기' })).toHaveLength(3);
  });

  it('모바일 홈 화면 폭과 상단 24px 여백을 유지한다', () => {
    render(<HomePage />);

    expect(screen.getByRole('main')).toHaveClass(
      'max-w-[360px]',
      '!pt-6',
      'bg-white',
    );
  });

  it('상단 인사와 위치 선택은 고정하고 카드 목록만 스크롤한다', () => {
    render(<HomePage />);

    expect(screen.getByRole('main')).toHaveClass(
      'h-[calc(100dvh-90px)]',
      'overflow-hidden',
      '!min-h-0',
    );
    expect(screen.getByRole('banner')).toHaveClass('shrink-0');
    expect(screen.getByLabelText('추천 시설')).toHaveClass(
      'flex-1',
      'overflow-y-auto',
      'scrollbar-hidden',
    );
  });

  it('좋아요를 누르면 해당 카드의 찜 상태를 갱신한다', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    const firstLikeButton = screen.getAllByRole('button', {
      name: '찜하기',
    })[0];
    await user.click(firstLikeButton);

    expect(screen.getByRole('button', { name: '찜 해제' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
