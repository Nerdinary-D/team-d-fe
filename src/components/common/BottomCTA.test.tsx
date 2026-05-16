import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BottomCTA } from './BottomCTA';

describe('BottomCTA', () => {
  it('기본은 button으로 렌더링되며 클릭 시 onClick이 호출된다', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<BottomCTA onClick={onClick}>등록하기</BottomCTA>);

    const button = screen.getByRole('button', { name: '등록하기' });
    expect(button.tagName).toBe('BUTTON');

    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('as="div"면 button이 아니라 div로 렌더링되어 클릭이 발생하지 않는다', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <BottomCTA as="div" onClick={onClick}>
        주소 표시
      </BottomCTA>,
    );

    expect(
      screen.queryByRole('button', { name: '주소 표시' }),
    ).not.toBeInTheDocument();

    const text = screen.getByText('주소 표시');
    await user.click(text);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('disabled면 button이 비활성화된다', () => {
    render(<BottomCTA disabled>등록하기</BottomCTA>);
    expect(screen.getByRole('button', { name: '등록하기' })).toBeDisabled();
  });

  it('type="submit"이면 form submit 동작이 가능하다', () => {
    render(<BottomCTA type="submit">제출</BottomCTA>);
    expect(screen.getByRole('button', { name: '제출' })).toHaveAttribute(
      'type',
      'submit',
    );
  });
});
