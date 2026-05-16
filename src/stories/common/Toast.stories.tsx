import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ToastPopup } from '@/components/common/Toast';

const meta = {
  title: 'Common/ToastPopup',
  component: ToastPopup,
  args: {
    children: '찜한 그라운드에 추가했어요.',
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-40 items-center justify-center bg-gray-100 p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ToastPopup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongText: Story = {
  args: {
    children: '편의시설 정보가 저장되었습니다',
  },
};

export const RegionComplete: Story = {
  args: {
    children: '지역 설정이 완료되었어요!',
  },
};
