import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BottomTab } from "./BottomTab";

const meta = {
  title: "Common/BottomTab",
  component: BottomTab,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="min-h-[180px] bg-muted">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BottomTab>;

export default meta;

type Story = StoryObj<typeof meta>;

export const HomeActive: Story = {
  args: {
    activePathname: "/",
  },
};

export const MateActive: Story = {
  args: {
    activePathname: "/matches",
  },
};

export const MyPageActive: Story = {
  args: {
    activePathname: "/my",
  },
};
