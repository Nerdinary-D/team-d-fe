import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HomePage } from '@/app/(b2c)/_components/HomePage';
import { AppToastViewport } from '@/components/common/Toast';
import { BottomTab } from '@/components/common/bottomTab/BottomTab';

const meta = {
  title: 'Pages/Home/HomePage',
  component: HomePage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="min-h-[740px] bg-white">
        <Story />
        <BottomTab activePathname="/" />
        <AppToastViewport />
      </div>
    ),
  ],
} satisfies Meta<typeof HomePage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
