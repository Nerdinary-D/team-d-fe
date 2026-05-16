import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const back = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ back }),
}));

import { BackButton } from './BackButton';

describe('BackButton', () => {
  it('aria-label "뒤로 가기" 버튼을 렌더링한다', () => {
    render(<BackButton />);
    expect(
      screen.getByRole('button', { name: '뒤로 가기' }),
    ).toBeInTheDocument();
  });

  it('클릭하면 router.back()이 호출된다', async () => {
    const user = userEvent.setup();
    back.mockClear();
    render(<BackButton />);

    await user.click(screen.getByRole('button', { name: '뒤로 가기' }));
    expect(back).toHaveBeenCalledTimes(1);
  });

  it('className이 버튼에 적용된다', () => {
    render(<BackButton className="absolute top-2 left-2" />);
    const button = screen.getByRole('button', { name: '뒤로 가기' });
    expect(button).toHaveClass('absolute', 'top-2', 'left-2');
  });
});
