import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LikeButton } from './LikeButton';

describe('LikeButton', () => {
  it('isLiked=false일 때 "찜하기" 라벨과 heart-none-select 아이콘을 보여준다', () => {
    render(<LikeButton isLiked={false} />);
    const button = screen.getByRole('button', { name: '찜하기' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button.querySelector('img')?.getAttribute('src')).toContain(
      'heart-none-select',
    );
  });

  it('isLiked=true일 때 "찜 해제" 라벨과 heart-select 아이콘을 보여준다', () => {
    render(<LikeButton isLiked={true} />);
    const button = screen.getByRole('button', { name: '찜 해제' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    const src = button.querySelector('img')?.getAttribute('src') ?? '';
    expect(src).toContain('heart-select');
    expect(src).not.toContain('heart-none-select');
  });

  it('클릭하면 onToggleLike가 호출된다', async () => {
    const user = userEvent.setup();
    const onToggleLike = vi.fn();
    render(<LikeButton isLiked={false} onToggleLike={onToggleLike} />);

    await user.click(screen.getByRole('button', { name: '찜하기' }));
    expect(onToggleLike).toHaveBeenCalledTimes(1);
  });

  it('className이 버튼에 적용된다', () => {
    render(
      <LikeButton isLiked={false} className="absolute top-2 right-2" />,
    );
    const button = screen.getByRole('button', { name: '찜하기' });
    expect(button).toHaveClass('absolute', 'top-2', 'right-2');
  });
});
