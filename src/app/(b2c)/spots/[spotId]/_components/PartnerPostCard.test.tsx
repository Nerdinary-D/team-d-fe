import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { PartnerPost } from '../_schema';
import { PartnerPostCard } from './PartnerPostCard';

const post: PartnerPost = {
  id: 'p1',
  spotId: '1',
  title: '함께 풋살하실 분 구합니다',
  schedule: '매주 월요일 / 6시',
  content: '초보 환영, 매주 1회 풋살 모임입니다.',
  openChatUrl: 'https://open.kakao.com/o/example1',
  createdAt: '2026-05-12T12:00:00.000Z',
};

describe('PartnerPostCard', () => {
  it('제목/일정/내용을 모두 렌더링한다', () => {
    render(<PartnerPostCard post={post} />);
    expect(screen.getByText(post.title)).toBeInTheDocument();
    expect(screen.getByText(post.schedule)).toBeInTheDocument();
    expect(screen.getByText(post.content)).toBeInTheDocument();
  });

  it('createdAt을 YYYY.MM.DD 형식으로 표시한다', () => {
    render(<PartnerPostCard post={post} />);
    expect(screen.getByText('2026.05.12')).toBeInTheDocument();
  });

  it('오픈채팅 링크가 새 탭으로 열린다', () => {
    render(<PartnerPostCard post={post} />);
    const link = screen.getByRole('link', { name: /오픈채팅으로 연락하기/ });
    expect(link).toHaveAttribute('href', post.openChatUrl);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });
});
