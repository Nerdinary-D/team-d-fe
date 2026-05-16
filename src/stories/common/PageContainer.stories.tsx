import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PageContainer } from "@/components/common/PageContainer";

const meta = {
  title: "Common/PageContainer",
  component: PageContainer,
  args: {
    size: "mobile",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["mobile", "sm", "md", "lg", "xl", "full"],
    },
  },
} satisfies Meta<typeof PageContainer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const content = (
      <div className="rounded-lg border bg-card p-4">
        <p className="text-body2">컨테이너 너비와 여백을 확인합니다.</p>
      </div>
    );

    return <PageContainer {...args}>{content}</PageContainer>;
  },
};
