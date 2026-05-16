import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '@/components/common/Button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/common/Card';

const meta = {
  title: 'Common/Card',
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const header = (
      <CardHeader>
        <CardTitle>경기 요약</CardTitle>
        <CardDescription>오늘 예정된 주요 경기입니다.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            보기
          </Button>
        </CardAction>
      </CardHeader>
    );

    const content = (
      <CardContent>
        <p>FC 서울 vs 수원 삼성</p>
      </CardContent>
    );

    const footer = <CardFooter>킥오프 19:00</CardFooter>;

    return (
      <Card className="max-w-sm">
        {header}
        {content}
        {footer}
      </Card>
    );
  },
};

export const Small: Story = {
  render: () => {
    const header = (
      <CardHeader>
        <CardTitle>알림</CardTitle>
        <CardDescription>라인업이 공개되었습니다.</CardDescription>
      </CardHeader>
    );

    return (
      <Card size="sm" className="max-w-sm">
        {header}
      </Card>
    );
  },
};
