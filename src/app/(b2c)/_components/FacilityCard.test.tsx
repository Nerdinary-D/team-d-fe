import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FacilityCard } from './FacilityCard';
import type { FacilityBadgeVariant } from './FacilityBadge';

const showToastPopup = vi.hoisted(() => vi.fn());

vi.mock('@/components/common/Toast', () => ({
  showToastPopup,
}));

const defaultBadges = [
  'wheelchairRamp',
  'accessibleParking',
] satisfies FacilityBadgeVariant[];

describe('FacilityCard', () => {
  it('시설명, 종목명, 이미지, Like 버튼을 렌더링한다', () => {
    render(
      <FacilityCard
        name="시설 명"
        sportName="종목명"
        imageSrc="/facility.png"
        imageAlt="시설 이미지"
        badges={defaultBadges}
        isFavorite={false}
      />,
    );

    expect(screen.getByText('시설 명')).toBeInTheDocument();
    expect(screen.getByText('종목명')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '시설 이미지' })).toHaveAttribute(
      'src',
      '/facility.png',
    );
    expect(screen.getByRole('button', { name: '찜하기' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('작은 모바일 화면에서 잘리지 않도록 카드 폭을 유동적으로 제한한다', () => {
    render(
      <FacilityCard
        name="시설 명"
        sportName="종목명"
        imageSrc="/facility.png"
        imageAlt="시설 이미지"
        badges={defaultBadges}
        isFavorite={false}
      />,
    );

    const card = screen
      .getByRole('heading', { name: '시설 명' })
      .closest('[data-slot="facility-card"]');

    expect(card).toHaveClass('w-full', 'max-w-[328px]');
    expect(card).not.toHaveClass('w-[328px]');
  });

  it('뱃지가 4개 이하이면 더보기 버튼을 렌더링하지 않는다', () => {
    render(
      <FacilityCard
        name="시설 명"
        sportName="종목명"
        imageSrc="/facility.png"
        imageAlt="시설 이미지"
        badges={[
          'wheelchairRamp',
          'accessibleParking',
          'courtAccess',
          'privateShower',
        ]}
        isFavorite={false}
      />,
    );

    expect(
      screen.queryByRole('button', { name: /더보기/ }),
    ).not.toBeInTheDocument();
  });

  it('뱃지가 5개 이상이면 4개만 노출하고 더보기 버튼을 렌더링한다', () => {
    render(
      <FacilityCard
        name="시설 명"
        sportName="종목명"
        imageSrc="/facility.png"
        imageAlt="시설 이미지"
        badges={[
          'wheelchairRamp',
          'accessibleParking',
          'courtAccess',
          'privateShower',
          'guideDogWelcome',
        ]}
        isFavorite={false}
      />,
    );

    expect(screen.getByText('휠체어 경사로')).toBeInTheDocument();
    expect(screen.getByText('장애인 주차장')).toBeInTheDocument();
    expect(screen.getByText('코트진입 가능')).toBeInTheDocument();
    expect(screen.getByText('전용 샤워실')).toBeInTheDocument();
    expect(screen.queryByText('안내견 환영')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '+1 더보기' }),
    ).toBeInTheDocument();
  });

  it('더보기를 누르면 bottom sheet에서 전체 뱃지를 보여준다', async () => {
    const user = userEvent.setup();
    render(
      <FacilityCard
        name="시설 명"
        sportName="종목명"
        imageSrc="/facility.png"
        imageAlt="시설 이미지"
        badges={[
          'wheelchairRamp',
          'accessibleParking',
          'courtAccess',
          'privateShower',
          'guideDogWelcome',
        ]}
        isFavorite={false}
      />,
    );

    await user.click(screen.getByRole('button', { name: '+1 더보기' }));

    const dialog = screen.getByRole('dialog', { name: '편의 시설' });
    expect(within(dialog).getByText('편의 시설')).toBeInTheDocument();
    expect(within(dialog).getByText('안내견 환영')).toBeInTheDocument();
  });

  it('찜 버튼을 누르면 변경 요청을 전달한다', async () => {
    const user = userEvent.setup();
    const onFavoriteChange = vi.fn();
    showToastPopup.mockClear();
    render(
      <FacilityCard
        name="시설 명"
        sportName="종목명"
        imageSrc="/facility.png"
        imageAlt="시설 이미지"
        badges={defaultBadges}
        isFavorite={false}
        onFavoriteChange={onFavoriteChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: '찜하기' }));

    expect(onFavoriteChange).toHaveBeenCalledWith(true);
    expect(showToastPopup).toHaveBeenCalledWith('찜한 그라운드에 추가했어요.');
  });

  it('이미 찜한 시설을 해제할 때는 토스트를 띄우지 않는다', async () => {
    const user = userEvent.setup();
    const onFavoriteChange = vi.fn();
    showToastPopup.mockClear();
    render(
      <FacilityCard
        name="시설 명"
        sportName="종목명"
        imageSrc="/facility.png"
        imageAlt="시설 이미지"
        badges={defaultBadges}
        isFavorite
        onFavoriteChange={onFavoriteChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: '찜 해제' }));

    expect(onFavoriteChange).toHaveBeenCalledWith(false);
    expect(showToastPopup).not.toHaveBeenCalled();
  });
});
