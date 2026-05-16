import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MyPageView } from './MyPageView';

describe('MyPageView', () => {
  it('Figma 마이페이지의 상단 정보와 큐레이션 상태를 렌더링한다', () => {
    render(<MyPageView />);

    expect(
      screen.getByRole('heading', { name: '마이페이지' }),
    ).toBeInTheDocument();
    expect(screen.getByText('너디너리 님')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '기본 지역 설정: 서울' }),
    ).toBeInTheDocument();
    expect(screen.getByText('현재 [발달장애]')).toBeInTheDocument();
    expect(screen.getByText('맞춤 큐레이션 중이에요!')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '필터변경' }),
    ).toBeInTheDocument();
  });

  it('찜한 그라운드 카드 3개와 Figma 뱃지 구성을 보여준다', () => {
    render(<MyPageView />);

    expect(screen.getByRole('heading', { name: '내가 찜한 그라운드' }));
    expect(screen.getAllByRole('heading', { name: '시설 명' })).toHaveLength(3);
    expect(screen.getAllByText('종목명')).toHaveLength(3);
    expect(screen.getAllByText('코트진입 가능')).toHaveLength(3);
    expect(screen.getAllByText('점자 안내')).toHaveLength(3);
    expect(screen.getAllByText('필담 가능')).toHaveLength(3);
    expect(screen.getAllByText('시각화 안내서')).toHaveLength(3);
    expect(screen.getAllByRole('button', { name: '찜 해제' })).toHaveLength(3);
  });

  it('좋아요를 누르면 해당 카드의 찜 상태를 갱신한다', async () => {
    const user = userEvent.setup();
    render(<MyPageView />);

    const firstLikeButton = screen.getAllByRole('button', {
      name: '찜 해제',
    })[0];
    await user.click(firstLikeButton);

    expect(screen.getByRole('button', { name: '찜하기' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('모바일 마이페이지 폭과 배경을 유지한다', () => {
    render(<MyPageView />);

    expect(screen.getByRole('main')).toHaveClass(
      'max-w-[360px]',
      '!pt-6',
      'bg-white',
    );
  });

  it('마지막 찜 카드가 하단 탭에 가려지지 않도록 리스트 끝 여백을 둔다', () => {
    render(<MyPageView />);

    expect(screen.getByLabelText('찜한 그라운드 목록')).toHaveClass(
      'pb-[30px]',
    );
  });

  it('기본 지역 설정을 누르면 홈과 같은 지역 설정 바텀 시트를 연다', async () => {
    const user = userEvent.setup();
    render(<MyPageView />);

    await user.click(
      screen.getByRole('button', { name: '기본 지역 설정: 서울' }),
    );

    expect(
      await screen.findByRole('dialog', { name: '지역 설정' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '대전' })).toBeInTheDocument();
  });

  it('필터변경을 누르면 프로그레스바 없이 필터 변경 화면을 띄운다', async () => {
    const user = userEvent.setup();
    render(<MyPageView />);

    await user.click(screen.getByRole('button', { name: '필터변경' }));

    expect(
      screen.getByRole('dialog', { name: '필터 변경' }),
    ).toBeInTheDocument();
    expect(screen.getByText('어떤 운동환경이')).toBeInTheDocument();
    expect(screen.getByText('필요하신가요?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '지체 장애' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('필터 변경 화면에서 기존 온보딩 장애 옵션 컴포넌트를 확장 표시한다', async () => {
    const user = userEvent.setup();
    render(<MyPageView />);

    await user.click(screen.getByRole('button', { name: '필터변경' }));
    await user.click(screen.getByRole('button', { name: '지체 장애' }));

    expect(
      screen.getByRole('group', { name: '지체 장애 체크리스트' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '온보딩 문구' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );

    await user.click(screen.getByRole('button', { name: '온보딩 문구' }));

    expect(screen.getByRole('button', { name: '다음' })).toBeEnabled();
  });
});
