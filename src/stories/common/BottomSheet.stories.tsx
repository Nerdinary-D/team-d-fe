import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Button } from '@/components/common/Button';
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from '@/components/common/BottomSheet';
import { Input } from '@/components/common/Input';

const meta = {
  title: 'Common/BottomSheet',
  component: BottomSheet,
} satisfies Meta<typeof BottomSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

function TriggerExample() {
  return (
    <BottomSheet>
      <BottomSheetTrigger render={<Button>바텀시트 열기</Button>} />
      <BottomSheetContent className="gap-[30px] px-4 pt-5 pb-5">
        <BottomSheetHeader>
          <BottomSheetTitle>제목</BottomSheetTitle>
        </BottomSheetHeader>
        <BottomSheetDescription>
          본문 내용. 화면 하단에서 위로 올라오는 시트입니다.
        </BottomSheetDescription>
      </BottomSheetContent>
    </BottomSheet>
  );
}

export const Default: Story = {
  render: () => <TriggerExample />,
};

function ControlledOpenExample() {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex gap-2">
      <Button onClick={() => setOpen(true)}>다시 열기</Button>
      <BottomSheet open={open} onOpenChange={setOpen}>
        <BottomSheetContent className="gap-[30px] px-4 pt-5 pb-5">
          <BottomSheetHeader>
            <BottomSheetTitle>controlled 열림</BottomSheetTitle>
          </BottomSheetHeader>
          <BottomSheetDescription>
            initialOpen=true 로 처음부터 열린 상태입니다.
          </BottomSheetDescription>
        </BottomSheetContent>
      </BottomSheet>
    </div>
  );
}

export const ControlledOpen: Story = {
  render: () => <ControlledOpenExample />,
};

function WithFormExample() {
  return (
    <BottomSheet>
      <BottomSheetTrigger render={<Button>폼 열기</Button>} />
      <BottomSheetContent className="gap-[30px] px-4 pt-5 pb-5">
        <BottomSheetHeader>
          <BottomSheetTitle>모집글 작성</BottomSheetTitle>
        </BottomSheetHeader>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-body2 text-gray-500">제목</label>
            <Input placeholder="예: 이번주 주말 같이 탁구치실 분!" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-body2 text-gray-500">날짜/시간</label>
            <Input placeholder="예: 매주 월요일 오후 6시" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-body2 text-gray-500">모집 내용</label>
            <textarea
              rows={5}
              placeholder="모집내용을 자유롭게 입력해보세요."
              className="w-full rounded-[10px] border border-gray-400 px-4 py-[15px] text-sm outline-none placeholder:text-gray-400 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </div>
        <Button className="h-[50px] rounded-[40px] bg-main text-white">
          등록하기
        </Button>
      </BottomSheetContent>
    </BottomSheet>
  );
}

export const WithForm: Story = {
  render: () => <WithFormExample />,
};
