import type { Meta, StoryObj } from '@storybook/nextjs-vite';
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
    onBack: () => {},
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

export const NoBackButton: Story = {
  args: {
    onBack: undefined,
  },
};
