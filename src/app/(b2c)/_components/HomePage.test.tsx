import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HomePage } from './HomePage';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

const apiGet = vi.hoisted(() => vi.fn());

vi.mock('@/lib/axios', () => ({
  api: { get: apiGet },
}));

vi.mock('@/lib/uuid', () => ({
  getOwnerUuid: () => 'test-uuid',
}));

function renderWithClient(ui: ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
}

describe('HomePage', () => {
  beforeEach(() => {
    apiGet.mockReset();
    apiGet.mockResolvedValue({
      data: {
        uuid: 'test-uuid',
        role: 'ROLE_CUSTOMER',
        nickname: '홍길동',
      },
    });
  });

  it('로고와 닉네임 기반 헤더, 위치 선택 영역을 렌더링한다', async () => {
    renderWithClient(<HomePage />);

    expect(screen.getByAltText('안심 그라운드')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText('홍길동님을 위한')).toBeInTheDocument(),
    );
    expect(screen.getByText('안심 그라운드')).toHaveClass('text-main');
    expect(
      screen.getByRole('button', { name: '지역 선택: 서울' }),
    ).toBeInTheDocument();
  });

  it('member 응답 도착 전에는 placeholder 닉네임을 보여준다', () => {
    apiGet.mockReturnValue(new Promise(() => {}));
    renderWithClient(<HomePage />);

    expect(screen.getByText('00님을 위한')).toBeInTheDocument();
  });

  it('시설 카드 3개와 기본 뱃지 구성을 보여준다', () => {
    renderWithClient(<HomePage />);

    expect(screen.getAllByRole('heading', { name: '시설 명' })).toHaveLength(3);
    expect(screen.getAllByText('종목명')).toHaveLength(3);
    expect(screen.getAllByText('휠체어 경사로')).toHaveLength(2);
    expect(screen.getAllByText('장애인 주차장')).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: '찜하기' })).toHaveLength(3);
  });

  it('모바일 홈 화면 폭과 흰색 배경을 유지한다', () => {
    renderWithClient(<HomePage />);

    expect(screen.getByRole('main')).toHaveClass(
      'max-w-[360px]',
      'min-h-dvh',
      'bg-white',
    );
  });

  it('상단 인사와 위치 선택을 sticky 헤더로 묶고 그라데이션을 추가한다', () => {
    renderWithClient(<HomePage />);

    const banner = screen.getByRole('banner');
    expect(banner).toHaveClass('sticky', 'top-0', 'z-10', 'bg-white');
    expect(banner.querySelector('.bg-gradient-to-b')).toHaveClass(
      'pointer-events-none',
      'absolute',
      'top-full',
      'from-white',
      'to-transparent',
    );
    expect(screen.getByLabelText('추천 시설')).toHaveClass(
      'flex',
      'flex-col',
      'gap-4',
    );
  });

  it('좋아요를 누르면 해당 카드의 찜 상태를 갱신한다', async () => {
    const user = userEvent.setup();
    renderWithClient(<HomePage />);

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
