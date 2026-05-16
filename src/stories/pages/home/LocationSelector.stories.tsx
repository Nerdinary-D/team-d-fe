import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LocationSelector } from '@/components/common/LocationSelector';

const meta = {
  title: 'Pages/Home/LocationSelector',
  component: LocationSelector,
  args: {
    location: '서울',
  },
  decorators: [
    (Story) => (
      <div className="min-h-[120px] bg-white p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LocationSelector>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
