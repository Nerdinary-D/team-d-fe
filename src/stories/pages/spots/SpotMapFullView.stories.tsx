import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SpotMapFullView } from '@/app/(b2c)/spots/[spotId]/map/_components/SpotMapFullView';

const meta = {
  title: 'Pages/Spots/SpotMapFullView',
  component: SpotMapFullView,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    spotId: '1',
  },
} satisfies Meta<typeof SpotMapFullView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
