import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const toastCustom = vi.hoisted(() => vi.fn());
const toastDismiss = vi.hoisted(() => vi.fn());

vi.mock('sonner', () => ({
  Toaster: () => null,
  toast: Object.assign(vi.fn(), {
    custom: toastCustom,
    dismiss: toastDismiss,
  }),
}));

import { hideToastPopup, showToastPopup, ToastPopup } from './Toast';

describe('ToastPopup', () => {
  it('Figma 토스트 팝업 형태로 상태 메시지를 렌더링한다', () => {
    render(<ToastPopup>텍스트</ToastPopup>);

    const toast = screen.getByRole('status');
    expect(toast).toHaveTextContent('텍스트');
    expect(toast).toHaveClass(
      'min-h-[60px]',
      'max-w-[328px]',
      'rounded-[10px]',
      'bg-main',
    );
  });

  it('작은 모바일 화면에서 토스트 폭이 뷰포트 안으로 줄어든다', () => {
    render(<ToastPopup>텍스트</ToastPopup>);

    const toast = screen.getByRole('status');
    expect(toast).toHaveClass('w-[calc(100vw-32px)]', 'max-w-[328px]');
    expect(toast).not.toHaveClass('w-[328px]');
  });

  it('기본 체크 아이콘은 장식 요소로 렌더링한다', () => {
    render(<ToastPopup>저장되었습니다</ToastPopup>);

    expect(screen.getByTestId('toast-popup-check-icon')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('접근성 role과 커스텀 아이콘을 바꿀 수 있다', () => {
    render(
      <ToastPopup role="alert" icon={<span data-testid="custom-icon">!</span>}>
        실패했습니다
      </ToastPopup>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('실패했습니다');
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});

describe('showToastPopup / hideToastPopup', () => {
  beforeEach(() => {
    toastCustom.mockClear();
    toastDismiss.mockClear();
  });

  it('showToastPopup은 sonner toast.custom으로 Figma 토스트를 띄운다', () => {
    showToastPopup('찜한 그라운드에 추가했어요.');

    expect(toastCustom).toHaveBeenCalledTimes(1);
    const [renderFn, options] = toastCustom.mock.calls[0];
    expect(options).toEqual({ duration: 2000 });

    render(renderFn());
    const toastPopup = screen.getByRole('status');
    expect(toastPopup).toHaveTextContent('찜한 그라운드에 추가했어요.');
    expect(toastPopup).toHaveClass('bg-main', 'rounded-[10px]');
  });

  it('hideToastPopup은 sonner toast.dismiss를 호출한다', () => {
    hideToastPopup();

    expect(toastDismiss).toHaveBeenCalledTimes(1);
  });
});
