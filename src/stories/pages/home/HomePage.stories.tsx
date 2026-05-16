import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { HomePage } from '@/app/(b2c)/_components/HomePage';
import { recommendedFacilitiesQuery } from '@/app/(b2c)/_fetch';
import { Toaster } from '@/components/common/Toast';
import { BottomTab } from '@/components/common/bottomTab/BottomTab';

const STORY_UUID = 'a33c6f0b-33a7-46ed-b75d-77637f338424';

function createHomePageQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });

  queryClient.setQueryData(
    recommendedFacilitiesQuery(STORY_UUID, {
      page: 0,
      size: 10,
      region: 'SEOUL',
    }).queryKey,
    {
      content: [
        {
          id: '1',
          name: '무장애 배드민턴장',
          sportName: '배드민턴',
          imageSrc: '/images/home/facility-placeholder.svg',
          imageAlt: '무장애 배드민턴장 이미지',
          badges: ['courtAccess', 'wheelchairRental', 'privateShower'],
          isFavorite: false,
        },
        {
          id: '2',
          name: '서울 포용 체육관',
          sportName: '배드민턴',
          imageSrc: '/images/home/facility-placeholder.svg',
          imageAlt: '서울 포용 체육관 이미지',
          badges: ['guideDogWelcome', 'brailleGuide', 'dedicatedStaff'],
          isFavorite: false,
        },
        {
          id: '3',
          name: '차분한 커뮤니티 코트',
          sportName: '배드민턴',
          imageSrc: '/images/home/facility-placeholder.svg',
          imageAlt: '차분한 커뮤니티 코트 이미지',
          badges: [
            'quietEnvironment',
            'privateSpace',
            'professionalInstructor',
          ],
          isFavorite: false,
        },
      ],
      currentPage: 0,
      size: 10,
      totalElements: 3,
      totalPages: 1,
      isFirst: true,
      isLast: true,
    },
  );

  return queryClient;
}

function HomePageStoryProvider({ children }: { children: ReactNode }) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('owner-uuid', STORY_UUID);
  }

  const queryClient = createHomePageQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const meta = {
  title: 'Pages/Home/HomePage',
  component: HomePage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <HomePageStoryProvider>
        <div className="min-h-[740px] bg-white">
          <Story />
          <BottomTab activePathname="/" />
          <Toaster />
        </div>
      </HomePageStoryProvider>
    ),
  ],
} satisfies Meta<typeof HomePage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
