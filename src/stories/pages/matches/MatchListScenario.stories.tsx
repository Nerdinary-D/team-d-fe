import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EmptyState } from "@/components/common/EmptyState";
import { PageContainer } from "@/components/common/PageContainer";
import { MatchCard } from "@/app/(b2c)/matches/_components/MatchCard";
import { matchList } from "./fixtures";

const meta = {
  title: "Pages/Matches/MatchListScenario",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const List: Story = {
  render: () => {
    const header = (
      <header className="space-y-1">
        <h1 className="text-header1 text-foreground">경기 목록</h1>
        <p className="text-body2 text-muted-foreground">
          상태별 경기 카드가 함께 배치된 화면 예시입니다.
        </p>
      </header>
    );

    const cards = matchList.map((match) => (
      <MatchCard key={match.id} match={match} />
    ));

    const content = <div className="space-y-3">{cards}</div>;

    return (
      <PageContainer className="space-y-4">
        {header}
        {content}
      </PageContainer>
    );
  },
};

export const Empty: Story = {
  render: () => {
    const emptyState = (
      <EmptyState
        title="경기가 없습니다"
        description="조건에 맞는 경기 일정이 아직 등록되지 않았습니다."
      />
    );

    return <PageContainer>{emptyState}</PageContainer>;
  },
};
