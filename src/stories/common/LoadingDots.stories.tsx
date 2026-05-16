import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LoadingDots } from '@/components/common/LoadingDots';

const meta = {
  title: 'Common/LoadingDots',
  component: LoadingDots,
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof LoadingDots>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { size: 'md' },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <LoadingDots size="sm" />
      <LoadingDots size="md" />
      <LoadingDots size="lg" />
    </div>
  ),
};

export const CustomColor: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <LoadingDots dotClassName="bg-gray-500" />
      <LoadingDots dotClassName="bg-sub" />
      <LoadingDots dotClassName="bg-chat-fg" />
    </div>
  ),
};
