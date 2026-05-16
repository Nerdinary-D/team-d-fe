import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PartnerSection } from "@/app/(b2c)/spots/[spotId]/_components/PartnerSection";
import { samplePost, samplePostShort } from "./fixtures";

const meta = {
  title: "Pages/Spots/PartnerSection",
  component: PartnerSection,
  args: {
    posts: [samplePost, samplePostShort],
  },
} satisfies Meta<typeof PartnerSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithPosts: Story = {};

export const Empty: Story = {
  args: {
    posts: [],
  },
};
