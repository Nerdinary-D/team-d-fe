import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { LikeButton } from '@/components/common/LikeButton';

const meta = {
  title: 'Common/LikeButton',
  component: LikeButton,
  args: {
    isLiked: false,
  },
  decorators: [
    (Story) => (
      <div className="flex h-32 w-full items-center justify-center bg-neutral-500">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LikeButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Liked: Story = {
  args: {
    isLiked: true,
  },
};

function ToggleExample() {
  const [isLiked, setIsLiked] = useState(false);
  return (
    <LikeButton
      isLiked={isLiked}
      onToggleLike={() => setIsLiked((v) => !v)}
    />
  );
}

export const Toggle: Story = {
  render: () => <ToggleExample />,
};
