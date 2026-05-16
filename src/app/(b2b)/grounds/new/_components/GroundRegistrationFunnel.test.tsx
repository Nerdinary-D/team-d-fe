import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GroundRegistrationFunnel } from './GroundRegistrationFunnel';

describe('GroundRegistrationFunnel', () => {
  const openAddressSearch = async (
    user: ReturnType<typeof userEvent.setup>,
  ) => {
    await user.click(
      screen.getByPlaceholderText('예: 서울시 은평구 연서로 36'),
    );
    expect(
      screen.getByRole('dialog', { name: '주소 검색' }),
    ).toBeInTheDocument();

    expect(await screen.findByTitle('우편번호 검색 프레임')).toHaveAttribute(
      'src',
      expect.stringContaining('https://postcode.map.kakao.com/search'),
    );
  };

  const selectAddress = async (user: ReturnType<typeof userEvent.setup>) => {
    await openAddressSearch(user);

    fireEvent(
      window,
      new MessageEvent('message', {
        origin: 'https://postcode.map.kakao.com',
        data: 'action=done|address=%EC%84%9C%EC%9A%B8%EC%8B%9C%20%EC%9D%80%ED%8F%89%EA%B5%AC%20%EC%97%B0%EC%84%9C%EB%A1%9C%2036|sido=%EC%84%9C%EC%9A%B8|sigungu=%EC%9D%80%ED%8F%89%EA%B5%AC',
      }),
    );
  };

  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => 'blob:ground-preview');
    URL.revokeObjectURL = vi.fn();
    document
      .querySelectorAll(
        'script[data-daum-postcode-sdk="true"], script[data-kakao-postcode-sdk="true"]',
      )
      .forEach((script) => script.remove());
    Reflect.deleteProperty(window, 'kakao');
    Reflect.deleteProperty(window, 'daum');
  });

  it('기본 정보가 모두 채워지기 전에는 다음 버튼이 비활성화된다', () => {
    render(<GroundRegistrationFunnel />);

    expect(screen.getByLabelText('1/3 단계')).toBeInTheDocument();
    expect(screen.queryByText('9:41')).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '그라운드 등록하기' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('시설 대표 이미지')).toHaveAttribute(
      'accept',
      'image/*',
    );
    expect(screen.getByPlaceholderText('예: 은평 롤링탁구장'));
    expect(screen.getByPlaceholderText('예: 서울시 은평구 연서로 36'));
    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
  });

  it('이미지와 필수 기본 정보를 입력하면 환경 소개 단계로 이동한다', async () => {
    const user = userEvent.setup();
    render(<GroundRegistrationFunnel />);

    await user.upload(
      screen.getByLabelText('시설 대표 이미지'),
      new File(['image'], 'ground.png', { type: 'image/png' }),
    );
    await user.type(
      screen.getByPlaceholderText('예: 은평 롤링탁구장'),
      '은평 롤링탁구장',
    );
    await selectAddress(user);
    expect(screen.getByDisplayValue('서울시 은평구 연서로 36'));
    expect(screen.getByRole('button', { name: '서울 은평구' }));
    await user.click(screen.getByRole('button', { name: '종목 선택' }));
    await user.click(screen.getByRole('option', { name: '탁구' }));

    expect(screen.getByRole('button', { name: '다음' })).toBeEnabled();
    expect(screen.getByAltText('업로드한 시설 대표 이미지')).toHaveAttribute(
      'src',
      'blob:ground-preview',
    );

    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(screen.getByLabelText('2/3 단계')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: '시설이 가지고 있는 환경을 소개해주세요!',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('지체장애를 위한 환경이에요.')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: '단차없는 휠체어 진입' }),
    ).toBeChecked();
    expect(
      screen.getByRole('checkbox', {
        name: '스포츠 휠체어 및 맞춤 장비대여',
      }),
    ).toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: '점자블록, 점자 안내판 설치' }),
    ).not.toBeChecked();
  });

  it('주소 검색을 닫으면 우편번호 iframe을 즉시 제거한다', async () => {
    const user = userEvent.setup();
    render(<GroundRegistrationFunnel />);

    await openAddressSearch(user);
    expect(
      await screen.findByTitle('우편번호 검색 프레임'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByTitle('우편번호 검색 프레임')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('dialog', { name: '주소 검색' }),
    ).not.toBeInTheDocument();
  });

  it('환경 소개 2단계에서 다음을 누르면 3단계 항목을 보여준다', async () => {
    const user = userEvent.setup();
    render(<GroundRegistrationFunnel />);

    await user.upload(
      screen.getByLabelText('시설 대표 이미지'),
      new File(['image'], 'ground.png', { type: 'image/png' }),
    );
    await user.type(
      screen.getByPlaceholderText('예: 은평 롤링탁구장'),
      '은평 롤링탁구장',
    );
    await selectAddress(user);
    await user.click(screen.getByRole('button', { name: '종목 선택' }));
    await user.click(screen.getByRole('option', { name: '탁구' }));
    await user.click(screen.getByRole('button', { name: '다음' }));
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(screen.getByLabelText('3/3 단계')).toBeInTheDocument();
    expect(screen.getByText('청각장애를 위한 환경이에요.')).toBeInTheDocument();
    expect(screen.getByText('발달장애를 위한 환경이에요.')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: '비상시 시각 알람 제공' }),
    ).toBeChecked();
    expect(
      screen.getByRole('checkbox', {
        name: '감각적 자극이 적은 차분한 환경',
      }),
    ).not.toBeChecked();
  });
});
