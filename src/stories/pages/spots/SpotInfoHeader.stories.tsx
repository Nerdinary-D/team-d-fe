import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SpotInfoHeader } from "@/app/(b2c)/spots/[spotId]/_components/SpotInfoHeader";
import { sampleSpot } from "./fixtures";

const meta = {
  title: "Pages/Spots/SpotInfoHeader",
  component: SpotInfoHeader,
  args: {
    name: sampleSpot.name,
    sport: sampleSpot.sport,
    address: sampleSpot.address,
  },
} satisfies Meta<typeof SpotInfoHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongAddress: Story = {
  args: {
    address: "서울특별시 강남구 테헤란로 123길 45 럭셔리 빌딩 지하 2층 풋살장 입구 측",
  },
};
