import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CreatePostFab } from "@/app/(b2c)/spots/[spotId]/_components/CreatePostFab";

const meta = {
  title: "Pages/Spots/CreatePostFab",
  component: CreatePostFab,
  args: {
    onClick: () => {},
  },
  decorators: [
    (Story) => (
      <div className="relative h-[200px] w-full bg-gray-100">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CreatePostFab>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomLabel: Story = {
  args: {
    label: "함께할 메이트 찾기",
  },
};
