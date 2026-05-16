import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PlusIcon } from "lucide-react";
import { BottomCTA } from "@/components/common/BottomCTA";

const meta = {
  title: "Common/BottomCTA",
  component: BottomCTA,
  args: {
    onClick: () => {},
    children: "모집글 등록하기",
  },
  decorators: [
    (Story) => (
      <div className="relative h-[200px] w-full bg-gray-100">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BottomCTA>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcon: Story = {
  render: () => (
    <BottomCTA onClick={() => {}}>
      <PlusIcon className="size-6" />
      <span className="text-subtitle2">모집글 등록하기</span>
    </BottomCTA>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "비활성 상태",
  },
};
