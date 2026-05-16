import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MatchCard } from "@/app/(b2c)/matches/_components/MatchCard";
import { finishedMatch, liveMatch, scheduledMatch } from "./fixtures";

const meta = {
  title: "Pages/Matches/MatchCard",
  component: MatchCard,
  args: {
    match: scheduledMatch,
  },
} satisfies Meta<typeof MatchCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Scheduled: Story = {};

export const Live: Story = {
  args: {
    match: liveMatch,
  },
};

export const Finished: Story = {
  args: {
    match: finishedMatch,
  },
};
