import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { SpotHero } from '@/app/(b2c)/spots/[spotId]/_components/SpotHero';
import { sampleSpot } from './fixtures';

const meta = {
  title: 'Pages/Spots/SpotHero',
  component: SpotHero,
  args: {
    imageUrl: sampleSpot.imageUrl,
    alt: sampleSpot.name,
    dotsCount: 3,
    activeIndex: 0,
  },
} satisfies Meta<typeof SpotHero>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SecondSlide: Story = {
  args: {
    activeIndex: 1,
  },
};

export const Liked: Story = {
  args: {
    isLiked: true,
  },
};

function LikeToggleExample() {
  const [isLiked, setIsLiked] = useState(false);
  return (
    <SpotHero
      imageUrl={sampleSpot.imageUrl}
      alt={sampleSpot.name}
      isLiked={isLiked}
      onToggleLike={() => setIsLiked((v) => !v)}
    />
  );
}

export const LikeToggle: Story = {
  render: () => <LikeToggleExample />,
};
