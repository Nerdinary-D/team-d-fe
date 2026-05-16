import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Curation, CustomerRegion } from '@/api/customer-preferences';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MyPageView } from './MyPageView';

const apiGet = vi.hoisted(() => vi.fn());
const apiPatch = vi.hoisted(() => vi.fn());

vi.mock('@/lib/axios', () => ({
  api: { get: apiGet, patch: apiPatch },
}));

const ownerUuid = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
const customerProfileUrl = `/api/v1/customers/${ownerUuid}`;
let storedItems: Record<string, string>;
let likesMeResponse: ReturnType<typeof createLikesMeResponse>;
let likesMeError: Error | null;
let customerProfileResponse: ReturnType<typeof createCustomerProfileResponse>;

function createLikesMeResponse(content = [createLikedFacilityResponse()]) {
  return {
    data: {
      content,
      currentPage: 0,
      size: 10,
      totalElements: content.length,
      totalPages: content.length > 0 ? 1 : 0,
      isFirst: true,
      isLast: true,
    },
  };
}

function createLikedFacilityResponse() {
  return {
    uuid: 'facility-uuid-1',
    image: '/facility.png',
    name: '서울 배드민턴장',
    category: 'BADMINTON',
    hashTags: [
      'NO_STEP_COURT_ENTRY',
      'BRAILLE_INFRASTRUCTURE',
      'WRITTEN_COMMUNICATION',
      'VISUAL_MANUAL',
    ],
    isLiked: true,
  };
}

function createCustomerProfileResponse(
  overrides: {
    curations?: Curation[];
    region?: CustomerRegion;
  } = {},
) {
  return {
    data: {
      uuid: ownerUuid,
      curations: overrides.curations ?? [],
      region: overrides.region ?? 'SEOUL',
      createdAt: '2026-05-16T21:33:40.612Z',
    },
  };
}

function getCustomerProfileCallCount() {
  return apiGet.mock.calls.filter(([url]) => url === customerProfileUrl).length;
}

function renderMyPageView() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MyPageView />
    </QueryClientProvider>,
  );
}

describe('MyPageView', () => {
  beforeEach(() => {
    storedItems = {};
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: vi.fn((key: string) => storedItems[key] ?? null),
        setItem: vi.fn((key: string, value: string) => {
          storedItems[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete storedItems[key];
        }),
        clear: vi.fn(() => {
          storedItems = {};
        }),
      },
    });
    apiGet.mockReset();
    likesMeResponse = createLikesMeResponse();
    likesMeError = null;
    customerProfileResponse = createCustomerProfileResponse();
    apiGet.mockImplementation((url: string) => {
      if (url === customerProfileUrl) {
        return Promise.resolve(customerProfileResponse);
      }

      if (url === '/api/v1/likes/me') {
        if (likesMeError) return Promise.reject(likesMeError);
        return Promise.resolve(likesMeResponse);
      }

      return Promise.reject(new Error(`Unhandled GET ${url}`));
    });
    apiPatch.mockReset();
    apiPatch.mockImplementation(
      (
        url: string,
        payload: { curations?: Curation[]; region?: CustomerRegion },
      ) => {
        if (url === `${customerProfileUrl}/region` && payload.region) {
          customerProfileResponse = createCustomerProfileResponse({
            ...customerProfileResponse.data,
            region: payload.region,
          });
        }

        if (url === `${customerProfileUrl}/curations` && payload.curations) {
          customerProfileResponse = createCustomerProfileResponse({
            ...customerProfileResponse.data,
            curations: payload.curations,
          });
        }

        return Promise.resolve({
          data: { uuid: ownerUuid, updatedAt: '2026-05-16T21:28:35.380865' },
        });
      },
    );
    window.localStorage.setItem('owner-uuid', ownerUuid);
  });

  it('Figma 마이페이지의 상단 정보와 큐레이션 상태를 렌더링한다', () => {
    renderMyPageView();

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

  it('likes/me 응답으로 찜한 그라운드 목록을 렌더링한다', async () => {
    renderMyPageView();

    expect(screen.getByRole('heading', { name: '내가 찜한 그라운드' }));
    expect(await screen.findByText('서울 배드민턴장')).toBeInTheDocument();
    expect(screen.getByText('배드민턴')).toBeInTheDocument();
    expect(screen.getByText('코트진입 가능')).toBeInTheDocument();
    expect(screen.getByText('점자 안내')).toBeInTheDocument();
    expect(screen.getByText('필담 가능')).toBeInTheDocument();
    expect(screen.getByText('시각화 안내서')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '찜 해제' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(apiGet).toHaveBeenCalledWith('/api/v1/likes/me', {
      params: {
        uuid: ownerUuid,
        page: 0,
        size: 10,
        sort: ['createdAt,DESC'],
      },
    });
  });

  it('좋아요를 해제하면 해당 카드를 찜한 목록에서 숨긴다', async () => {
    const user = userEvent.setup();
    renderMyPageView();

    const firstLikeButton = await screen.findByRole('button', {
      name: '찜 해제',
    });
    await user.click(firstLikeButton);

    expect(screen.queryByText('서울 배드민턴장')).not.toBeInTheDocument();
    expect(screen.getByText('찜한 그라운드가 없어요')).toBeInTheDocument();
  });

  it('찜한 그라운드가 없으면 빈 상태를 보여준다', async () => {
    likesMeResponse = createLikesMeResponse([]);

    renderMyPageView();

    expect(
      await screen.findByText('찜한 그라운드가 없어요'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('관심 있는 그라운드를 찜해보세요.'),
    ).toBeInTheDocument();
  });

  it('likes/me 요청이 실패하면 에러 상태를 보여준다', async () => {
    likesMeError = new Error('network error');

    renderMyPageView();

    expect(
      await screen.findByText('찜한 그라운드를 불러오지 못했어요'),
    ).toBeInTheDocument();
    expect(screen.getByText('잠시 후 다시 시도해주세요.')).toBeInTheDocument();
  });

  it('모바일 마이페이지 폭과 배경을 유지한다', () => {
    renderMyPageView();

    expect(screen.getByRole('main')).toHaveClass(
      'max-w-[360px]',
      '!pt-6',
      'bg-white',
    );
  });

  it('마지막 찜 카드가 하단 탭에 가려지지 않도록 리스트 끝 여백을 둔다', async () => {
    renderMyPageView();

    expect(await screen.findByLabelText('찜한 그라운드 목록')).toHaveClass(
      'pb-[30px]',
    );
  });

  it('기본 지역 설정을 누르면 홈과 같은 지역 설정 바텀 시트를 연다', async () => {
    const user = userEvent.setup();
    renderMyPageView();

    await user.click(
      screen.getByRole('button', { name: '기본 지역 설정: 서울' }),
    );

    expect(
      await screen.findByRole('dialog', { name: '지역 설정' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '대전' })).toBeInTheDocument();
  });

  it('기본 지역을 변경하면 고객 활동 지역 PATCH를 호출한다', async () => {
    const user = userEvent.setup();
    renderMyPageView();

    await user.click(
      screen.getByRole('button', { name: '기본 지역 설정: 서울' }),
    );
    await user.click(await screen.findByRole('button', { name: '부산' }));

    await waitFor(() => {
      expect(apiPatch).toHaveBeenCalledWith(
        `/api/v1/customers/${ownerUuid}/region`,
        { region: 'BUSAN' },
        { skipOwnerUuidInjection: true },
      );
    });
    expect(
      await screen.findByRole('button', { name: '기본 지역 설정: 부산' }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(getCustomerProfileCallCount()).toBeGreaterThanOrEqual(2);
    });
  });

  it('필터변경을 누르면 프로그레스바 없이 필터 변경 화면을 띄운다', async () => {
    const user = userEvent.setup();
    renderMyPageView();

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
    renderMyPageView();

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

  it('필터 변경 다음 버튼을 누르면 고객 큐레이션 PATCH를 호출하고 닫는다', async () => {
    const user = userEvent.setup();
    renderMyPageView();

    await user.click(screen.getByRole('button', { name: '필터변경' }));
    await user.click(screen.getByRole('button', { name: '시각 장애' }));
    await user.click(
      screen.getByRole('button', {
        name: '시각장애인 안내견 동반 입장 가능',
      }),
    );
    await user.click(screen.getByRole('button', { name: '다음' }));

    await waitFor(() => {
      expect(apiPatch).toHaveBeenCalledWith(
        `/api/v1/customers/${ownerUuid}/curations`,
        { curations: ['GUIDE_DOG_ALLOWED'] },
        { skipOwnerUuidInjection: true },
      );
    });
    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: '필터 변경' }),
      ).not.toBeInTheDocument();
    });
    expect(await screen.findByText('현재 [시각 장애]')).toBeInTheDocument();
    await waitFor(() => {
      expect(getCustomerProfileCallCount()).toBeGreaterThanOrEqual(2);
    });
  });
});
