import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('기본 rows와 label을 textarea에 연결한다', () => {
    render(<Textarea label="모집 내용" placeholder="내용을 입력하세요." />);

    const textarea = screen.getByLabelText('모집 내용');

    expect(textarea).toHaveAttribute('rows', '5');
    expect(textarea).toHaveAttribute('placeholder', '내용을 입력하세요.');
  });

  it('error가 있으면 helper text 대신 에러 메시지를 표시한다', () => {
    render(
      <Textarea
        label="모집 내용"
        helperText="500자 이내로 작성해주세요"
        error="내용을 입력해주세요"
      />,
    );

    const textarea = screen.getByLabelText('모집 내용');

    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('내용을 입력해주세요')).toHaveClass(
      'text-destructive',
    );
    expect(
      screen.queryByText('500자 이내로 작성해주세요'),
    ).not.toBeInTheDocument();
  });

  it('에러 메시지를 aria-describedby로 textarea에 연결한다', () => {
    render(
      <Textarea
        label="모집 내용"
        error="내용을 입력해주세요"
        aria-describedby="external-desc"
      />,
    );

    const textarea = screen.getByLabelText('모집 내용');
    const errorMessage = screen.getByText('내용을 입력해주세요');

    expect(errorMessage).toHaveAttribute('id');
    expect(textarea).toHaveAttribute(
      'aria-describedby',
      `external-desc ${errorMessage.id}`,
    );
  });
});
