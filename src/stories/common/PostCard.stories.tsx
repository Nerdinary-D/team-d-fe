import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PostCard } from '@/components/common/PostCard';

const meta = {
  title: 'Common/PostCard',
  component: PostCard,
  args: {
    title: '함께 풋살하실 분 구합니다',
    schedule: '매주 월요일 / 6시',
    content:
      '주 1회 풋살 함께 즐길 메이트 모집합니다. 초보 환영이에요! 가볍게 운동하고 친목 다지실 분 연락 주세요.',
    openChatUrl: 'https://open.kakao.com/o/example1',
    createdAt: '2026-05-10T12:00:00.000Z',
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[328px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PostCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ShortContent: Story = {
  args: {
    title: '주말 풋살 모임',
    schedule: '매주 토요일 / 10시',
    content: '토요일 아침 풋살 메이트 구해요. 실력은 중급 정도.',
    createdAt: '2026-05-12T09:00:00.000Z',
  },
};

export const LongContent: Story = {
  args: {
    title: '평일 저녁 농구 같이 하실 분 모집합니다',
    schedule: '매주 수/금 / 19:30',
    content:
      '평일 저녁마다 농구 같이 하실 분 구해요. 처음 시작하시는 분도 환영입니다. 실력보다 매너가 우선! 부담 없이 연락 주세요. 코트는 인근 공원 농구장이고, 비 오면 휴무입니다.',
  },
};
