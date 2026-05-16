import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Textfield } from './Textfield';

describe('Textfield', () => {
  it('label과 helper text를 input에 함께 렌더링한다', () => {
    render(
      <Textfield
        label="닉네임"
        helperText="10자 이내로 입력해주세요"
        placeholder="닉네임을 입력하세요."
      />,
    );

    const input = screen.getByLabelText('닉네임');

    expect(input).toHaveAttribute('placeholder', '닉네임을 입력하세요.');
    expect(screen.getByText('10자 이내로 입력해주세요')).toBeInTheDocument();
  });

  it('helper text를 aria-describedby로 input에 연결한다', () => {
    render(
      <Textfield
        label="닉네임"
        helperText="10자 이내로 입력해주세요"
        aria-describedby="external-desc"
      />,
    );

    const input = screen.getByLabelText('닉네임');
    const helperText = screen.getByText('10자 이내로 입력해주세요');

    expect(helperText).toHaveAttribute('id');
    expect(input).toHaveAttribute(
      'aria-describedby',
      `external-desc ${helperText.id}`,
    );
  });

  it('error가 있으면 invalid 상태와 에러 메시지를 표시한다', () => {
    render(<Textfield label="닉네임" error="닉네임을 입력해주세요" />);

    const input = screen.getByLabelText('닉네임');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('닉네임을 입력해주세요')).toHaveClass(
      'text-destructive',
    );
  });
});
