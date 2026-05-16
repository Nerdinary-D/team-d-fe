import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '@/components/common/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/common/Dialog';

const meta = {
  title: 'Common/Dialog',
  component: Dialog,
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const trigger = (
      <DialogTrigger render={<Button />}>다이얼로그 열기</DialogTrigger>
    );

    const content = (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>경기 등록</DialogTitle>
          <DialogDescription>
            새 경기 정보를 입력하기 전에 팀과 일정을 확인해 주세요.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button>저장</Button>
        </DialogFooter>
      </DialogContent>
    );

    return (
      <Dialog>
        {trigger}
        {content}
      </Dialog>
    );
  },
};
