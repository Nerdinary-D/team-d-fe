import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Skeleton, SkeletonText } from '@/components/common/Skeleton';

const meta = {
  title: 'Common/Skeleton',
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Block: Story = {
  render: () => <Skeleton className="h-24 w-72" />,
};

export const Text: Story = {
  render: () => <SkeletonText className="w-72" lines={4} />,
};
