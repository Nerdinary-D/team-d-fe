import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LocationSelector } from './LocationSelector';

const showToastPopup = vi.hoisted(() => vi.fn());
const hideToastPopup = vi.hoisted(() => vi.fn());

vi.mock('@/components/common/Toast', () => ({
  hideToastPopup,
  showToastPopup,
}));

describe('LocationSelector', () => {
  it('선택된 지역명을 Figma 스타일 버튼으로 렌더링한다', () => {
    render(<LocationSelector location="서울" />);

    const button = screen.getByRole('button', { name: '지역 선택: 서울' });

    expect(button).toHaveTextContent('서울');
    expect(button).toHaveClass('h-6', 'gap-1.5', 'p-0', 'text-subtitle1');
    expect(
      button.querySelector('img[src="/icons/home/location.svg"]'),
    ).toBeInTheDocument();
    expect(
      button.querySelector('img[src="/icons/home/expand-more.svg"]'),
    ).toBeInTheDocument();
  });

  it('트리거를 누르면 지역 설정 바텀 시트를 열고 지역을 선택한다', async () => {
    const user = userEvent.setup();
    showToastPopup.mockClear();
    hideToastPopup.mockClear();
    render(<LocationSelector location="서울" />);

    await user.click(screen.getByRole('button', { name: '지역 선택: 서울' }));

    const dialog = await screen.findByRole('dialog', { name: '지역 설정' });
    expect(dialog).toHaveClass('bottom-0', 'h-[413px]', 'rounded-t-[10px]');
    expect(screen.getByRole('button', { name: '서울' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: '대전' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(hideToastPopup).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: '대전' }));

    expect(
      screen.getByRole('button', { name: '지역 선택: 대전' }),
    ).toBeInTheDocument();
    expect(showToastPopup).not.toHaveBeenCalled();

    await waitFor(() =>
      expect(showToastPopup).toHaveBeenCalledWith('지역 설정이 완료되었어요!'),
    );
  });

  it('지역 변경 직후 바텀 시트를 다시 열면 예약된 토스트를 취소한다', async () => {
    const user = userEvent.setup();
    showToastPopup.mockClear();
    hideToastPopup.mockClear();
    render(<LocationSelector location="서울" />);

    await user.click(screen.getByRole('button', { name: '지역 선택: 서울' }));
    await user.click(screen.getByRole('button', { name: '대전' }));
    await user.click(screen.getByRole('button', { name: '지역 선택: 대전' }));

    expect(hideToastPopup).toHaveBeenCalledTimes(2);
    await new Promise((resolve) => setTimeout(resolve, 380));
    expect(showToastPopup).not.toHaveBeenCalled();
  });
});
