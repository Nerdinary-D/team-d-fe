import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  AppToastViewport,
  hideToastPopup,
  showToastPopup,
  ToastPopup,
} from './Toast';

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

  it('showToastPopup은 Figma 위치에 고정된 앱 토스트를 띄운다', () => {
    render(<AppToastViewport />);

    let toastId = '';
    act(() => {
      toastId = showToastPopup('찜한 그라운드에 추가했어요.');
    });

    expect(toastId).toBe('찜한 그라운드에 추가했어요.');
    const toastPopup = screen.getByRole('status');
    expect(toastPopup).toHaveTextContent('찜한 그라운드에 추가했어요.');
    expect(toastPopup).toHaveClass(
      'fixed',
      'bottom-[113px]',
      'left-1/2',
      '-translate-x-1/2',
    );
  });

  it('hideToastPopup은 표시 중인 앱 토스트를 닫는다', () => {
    render(<AppToastViewport />);

    act(() => {
      showToastPopup('지역 설정이 완료되었어요!');
    });
    expect(screen.getByRole('status')).toBeInTheDocument();

    act(() => {
      hideToastPopup();
    });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
