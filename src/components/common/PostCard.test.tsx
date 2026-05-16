import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostCard, type PostCardProps } from './PostCard';

const push = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

const props: PostCardProps = {
  title: '함께 풋살하실 분 구합니다',
  schedule: '매주 월요일 / 6시',
  content: '초보 환영, 매주 1회 풋살 모임입니다.',
  openChatUrl: 'https://open.kakao.com/o/example1',
  createdAt: '2026-05-12T12:00:00.000Z',
};

describe('PostCard', () => {
  it('제목/일정/내용을 모두 렌더링한다', () => {
    render(<PostCard {...props} />);
    expect(screen.getByText(props.title)).toBeInTheDocument();
    expect(screen.getByText(props.schedule)).toBeInTheDocument();
    expect(screen.getByText(props.content)).toBeInTheDocument();
  });

  it('createdAt을 YYYY.MM.DD 형식으로 표시한다', () => {
    render(<PostCard {...props} />);
    expect(screen.getByText('2026.05.12')).toBeInTheDocument();
  });

  it('오픈채팅 링크가 새 탭으로 열린다', () => {
    render(<PostCard {...props} />);
    const link = screen.getByRole('link', { name: /오픈채팅으로 연락하기/ });
    expect(link).toHaveAttribute('href', props.openChatUrl);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('href가 주어지면 카드 본문 클릭으로 해당 경로로 이동한다', async () => {
    const user = userEvent.setup();
    push.mockClear();
    render(<PostCard {...props} href="/spots/42" />);

    await user.click(screen.getByText(props.title));

    expect(push).toHaveBeenCalledWith('/spots/42');
  });

  it('href가 있어도 오픈채팅 버튼 클릭은 라우팅을 발생시키지 않는다', async () => {
    const user = userEvent.setup();
    push.mockClear();
    render(<PostCard {...props} href="/spots/42" />);

    const chatAnchor = screen
      .getAllByRole('link')
      .find((el) => el.getAttribute('href') === props.openChatUrl);
    expect(chatAnchor).toBeDefined();
    await user.click(chatAnchor!);

    expect(push).not.toHaveBeenCalled();
  });

  it('href가 없으면 카드에 link role을 부여하지 않는다', () => {
    render(<PostCard {...props} />);
    const cardLink = screen.queryByRole('link', { name: props.title });
    expect(cardLink).toBeNull();
  });
});
