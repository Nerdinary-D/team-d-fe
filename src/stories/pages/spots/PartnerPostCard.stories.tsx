import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PartnerPostCard } from '@/app/(b2c)/spots/[spotId]/_components/PartnerPostCard';
import { samplePost, samplePostShort } from './fixtures';

const meta = {
  title: 'Pages/Spots/PartnerPostCard',
  component: PartnerPostCard,
  args: {
    post: samplePost,
  },
} satisfies Meta<typeof PartnerPostCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ShortContent: Story = {
  args: {
    post: samplePostShort,
  },
};
