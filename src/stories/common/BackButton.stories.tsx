import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BackButton } from '@/components/common/BackButton';

const meta = {
  title: 'Common/BackButton',
  component: BackButton,
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="flex h-32 w-full items-center justify-center bg-neutral-500">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BackButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
