import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HomePage } from './HomePage';
import type { RecommendedFacility } from '../_fetch';

const apiGet = vi.hoisted(() => vi.fn());
const apiPost = vi.hoisted(() => vi.fn());
const apiDelete = vi.hoisted(() => vi.fn());
let storedItems: Record<string, string>;

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

vi.mock('@/lib/axios', () => ({
  api: {
    get: apiGet,
    post: apiPost,
    delete: apiDelete,
  },
}));

const TEST_UUID = '11111111-1111-4111-8111-111111111111';

const DEFAULT_MEMBER = {
  uuid: TEST_UUID,
  role: 'ROLE_CUSTOMER' as const,
  nickname: '홍길동',
};

const EMPTY_FACILITY_PAGE = {
  content: [],
  currentPage: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
  isFirst: true,
  isLast: true,
};

type FacilityResponseItem = {
  id: number;
  name: string;
  category: string;
  image: string;
  region: string;
  curations: string[];
  matchCount: number;
  isLiked: boolean;
};

type FacilityPageResponse = {
  data: typeof EMPTY_FACILITY_PAGE & { content: FacilityResponseItem[] };
};

function mockApiGet({
  member = { data: DEFAULT_MEMBER },
  memberHangs = false,
  facilityResponses = [],
}: {
  member?: { data: typeof DEFAULT_MEMBER };
  memberHangs?: boolean;
  facilityResponses?: FacilityPageResponse[];
} = {}) {
  const facilityQueue = [...facilityResponses];
  apiGet.mockImplementation((url: string) => {
    if (url.startsWith('/api/v1/members/')) {
      if (memberHangs) return new Promise(() => {});
      return Promise.resolve(member);
    }
    if (url.startsWith('/api/v1/facilities/recommended/')) {
      const next = facilityQueue.shift();
      return Promise.resolve(next ?? { data: EMPTY_FACILITY_PAGE });
    }
    return Promise.reject(new Error(`Unexpected URL: ${url}`));
  });
}

const testFacilities: RecommendedFacility[] = [
  {
    id: 'recommended-1',
    name: '시설 명',
    sportName: '종목명',
    imageSrc: '/images/home/facility-placeholder.svg',
    imageAlt: '시설 이미지',
    badges: ['wheelchairRamp', 'accessibleParking'],
    isFavorite: false,
  },
  {
    id: 'recommended-2',
    name: '시설 명',
    sportName: '종목명',
    imageSrc: '/images/home/facility-placeholder.svg',
    imageAlt: '시설 이미지',
    badges: ['wheelchairRamp'],
    isFavorite: false,
  },
  {
    id: 'recommended-3',
    name: '시설 명',
    sportName: '종목명',
    imageSrc: '/images/home/facility-placeholder.svg',
    imageAlt: '시설 이미지',
    badges: ['accessibleParking'],
    isFavorite: false,
  },
];

function renderHome(
  ui: ReactNode = <HomePage facilities={[...testFacilities]} />,
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe('HomePage', () => {
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
    apiPost.mockReset();
    apiDelete.mockReset();
    mockApiGet();
  });

  it('로고와 닉네임 기반 헤더, 위치 선택 영역을 렌더링한다', async () => {
    window.localStorage.setItem('owner-uuid', TEST_UUID);
    renderHome(<HomePage />);

    expect(screen.getByAltText('안심 그라운드')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText(/홍길동님을 위한/)).toBeInTheDocument(),
    );
    expect(screen.getByText('안심 그라운드')).toHaveClass('text-main');
    expect(
      screen.getByRole('button', { name: '지역 선택: 서울' }),
    ).toBeInTheDocument();
  });

  it('member 응답 도착 전에는 placeholder 닉네임을 보여준다', () => {
    window.localStorage.setItem('owner-uuid', TEST_UUID);
    mockApiGet({ memberHangs: true });
    renderHome(<HomePage />);

    expect(screen.getByText(/00님을 위한/)).toBeInTheDocument();
  });

  it('시설 카드 3개와 기본 뱃지 구성을 보여준다', () => {
    renderHome();

    expect(screen.getAllByRole('heading', { name: '시설 명' })).toHaveLength(3);
    expect(screen.getAllByText('종목명')).toHaveLength(3);
    expect(screen.getAllByText('휠체어 경사로')).toHaveLength(2);
    expect(screen.getAllByText('장애인 주차장')).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: '찜하기' })).toHaveLength(3);
  });

  it('모바일 홈 화면 폭과 흰색 배경을 유지한다', () => {
    renderHome();

    expect(screen.getByRole('main')).toHaveClass(
      'max-w-[360px]',
      'min-h-dvh',
      'bg-white',
    );
  });

  it('상단 인사와 위치 선택을 sticky 헤더로 묶고 그라데이션을 추가한다', () => {
    renderHome();

    const banner = screen.getByRole('banner');
    expect(banner).toHaveClass('sticky', 'top-0', 'z-10', 'bg-white');
    expect(banner.querySelector('.bg-gradient-to-b')).toHaveClass(
      'pointer-events-none',
      'absolute',
      'top-full',
      'from-white',
      'to-transparent',
    );
    expect(screen.getByLabelText('추천 시설')).toHaveClass(
      'flex',
      'flex-col',
      'gap-4',
    );
  });

  it('좋아요를 누르면 해당 카드의 찜 상태를 갱신한다', async () => {
    const user = userEvent.setup();
    renderHome();

    const firstLikeButton = screen.getAllByRole('button', {
      name: '찜하기',
    })[0];
    await user.click(firstLikeButton);

    expect(screen.getByRole('button', { name: '찜 해제' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('저장된 uuid로 맞춤형 시설 목록을 조회해 카드로 렌더링한다', async () => {
    window.localStorage.setItem('owner-uuid', TEST_UUID);
    mockApiGet({
      facilityResponses: [
        {
          data: {
            content: [
              {
                id: 7,
                name: '무장애 배드민턴장',
                category: 'BADMINTON',
                image: '/facility.png',
                region: 'SEOUL',
                curations: ['NO_STEP_COURT_ENTRY', 'VISUAL_ALARM'],
                matchCount: 2,
                isLiked: false,
              },
            ],
            currentPage: 0,
            size: 10,
            totalElements: 1,
            totalPages: 1,
            isFirst: true,
            isLast: true,
          },
        },
      ],
    });

    renderHome(<HomePage />);

    expect(
      await screen.findByRole('heading', { name: '무장애 배드민턴장' }),
    ).toBeInTheDocument();
    expect(apiGet).toHaveBeenCalledWith(
      `/api/v1/facilities/recommended/${TEST_UUID}`,
      { params: { page: 0, size: 10, region: 'SEOUL' } },
    );
    expect(screen.getByText('배드민턴')).toBeInTheDocument();
    expect(screen.getByText('코트진입 가능')).toBeInTheDocument();
    expect(screen.getByText('비상 시각알람')).toBeInTheDocument();
  });

  it('추천 시설의 isLiked 상태를 반영하고 찜하기 요청을 보낸다', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('owner-uuid', TEST_UUID);
    mockApiGet({
      facilityResponses: [
        {
          data: {
            content: [
              {
                id: 7,
                name: '무장애 배드민턴장',
                category: 'BADMINTON',
                image: '/facility.png',
                region: 'SEOUL',
                curations: ['NO_STEP_COURT_ENTRY'],
                matchCount: 1,
                isLiked: false,
              },
            ],
            currentPage: 0,
            size: 10,
            totalElements: 1,
            totalPages: 1,
            isFirst: true,
            isLast: true,
          },
        },
      ],
    });
    apiPost.mockResolvedValueOnce({ data: 'liked' });

    renderHome(<HomePage />);

    const likeButton = await screen.findByRole('button', { name: '찜하기' });

    await user.click(likeButton);

    expect(apiPost).toHaveBeenCalledWith('/api/v1/likes', { facilityId: 7 });
    expect(
      await screen.findByRole('button', { name: '찜 해제' }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  it('이미 찜한 추천 시설은 찜 해제 요청을 보낸다', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('owner-uuid', TEST_UUID);
    mockApiGet({
      facilityResponses: [
        {
          data: {
            content: [
              {
                id: 7,
                name: '무장애 배드민턴장',
                category: 'BADMINTON',
                image: '/facility.png',
                region: 'SEOUL',
                curations: ['NO_STEP_COURT_ENTRY'],
                matchCount: 1,
                isLiked: true,
              },
            ],
            currentPage: 0,
            size: 10,
            totalElements: 1,
            totalPages: 1,
            isFirst: true,
            isLast: true,
          },
        },
      ],
    });
    apiDelete.mockResolvedValueOnce({ data: 'unliked' });

    renderHome(<HomePage />);

    const unlikeButton = await screen.findByRole('button', {
      name: '찜 해제',
    });
    await user.click(unlikeButton);

    expect(apiDelete).toHaveBeenCalledWith('/api/v1/likes', {
      params: {
        uuid: TEST_UUID,
        facilityId: 7,
      },
    });
    expect(
      await screen.findByRole('button', { name: '찜하기' }),
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it('지역을 바꾸면 추천 시설을 해당 region으로 다시 조회한다', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('owner-uuid', TEST_UUID);
    mockApiGet({
      facilityResponses: [
        {
          data: {
            content: [
              {
                id: 7,
                name: '서울 배드민턴장',
                category: 'BADMINTON',
                image: '/facility.png',
                region: 'SEOUL',
                curations: ['NO_STEP_COURT_ENTRY'],
                matchCount: 1,
                isLiked: false,
              },
            ],
            currentPage: 0,
            size: 10,
            totalElements: 1,
            totalPages: 1,
            isFirst: true,
            isLast: true,
          },
        },
        {
          data: {
            content: [
              {
                id: 8,
                name: '대전 배드민턴장',
                category: 'BADMINTON',
                image: '/facility.png',
                region: 'DAEJEON',
                curations: ['VISUAL_ALARM'],
                matchCount: 1,
                isLiked: false,
              },
            ],
            currentPage: 0,
            size: 10,
            totalElements: 1,
            totalPages: 1,
            isFirst: true,
            isLast: true,
          },
        },
      ],
    });

    renderHome(<HomePage />);

    expect(
      await screen.findByRole('heading', { name: '서울 배드민턴장' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '지역 선택: 서울' }));
    await user.click(await screen.findByRole('button', { name: '대전' }));

    expect(
      await screen.findByRole('heading', { name: '대전 배드민턴장' }),
    ).toBeInTheDocument();
    expect(apiGet).toHaveBeenCalledWith(
      `/api/v1/facilities/recommended/${TEST_UUID}`,
      { params: { page: 0, size: 10, region: 'DAEJEON' } },
    );
  });
});
