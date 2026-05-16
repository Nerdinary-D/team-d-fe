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
import { Textarea } from '@/components/common/Textarea';
import { Textfield } from '@/components/common/Textfield';

const meta = {
  title: 'Common/BottomSheet',
  component: BottomSheet,
} satisfies Meta<typeof BottomSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

function TriggerExample() {
  const triggerExample = (
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

  return triggerExample;
}

export const Default: Story = {
  render: () => {
    const story = <TriggerExample />;
    return story;
  },
};

function ControlledOpenExample() {
  const [open, setOpen] = useState(true);
  const controlledOpenExample = (
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

  return controlledOpenExample;
}

export const ControlledOpen: Story = {
  render: () => {
    const story = <ControlledOpenExample />;
    return story;
  },
};

function WithFormExample() {
  const titleField = (
    <Textfield label="제목" placeholder="예: 이번주 주말 같이 탁구치실 분!" />
  );

  const dateField = (
    <Textfield label="날짜/시간" placeholder="예: 매주 월요일 오후 6시" />
  );

  const contentField = (
    <Textarea
      label="모집 내용"
      placeholder="모집내용을 자유롭게 입력해보세요."
    />
  );

  const formContent = (
    <div className="flex flex-col gap-5">
      {titleField}
      {dateField}
      {contentField}
    </div>
  );

  const submitButton = (
    <Button className="h-[50px] rounded-[40px] bg-main text-white">
      등록하기
    </Button>
  );

  const withFormExample = (
    <BottomSheet>
      <BottomSheetTrigger render={<Button>폼 열기</Button>} />
      <BottomSheetContent className="gap-[30px] px-4 pt-5 pb-5">
        <BottomSheetHeader>
          <BottomSheetTitle>모집글 작성</BottomSheetTitle>
        </BottomSheetHeader>
        {formContent}
        {submitButton}
      </BottomSheetContent>
    </BottomSheet>
  );

  return withFormExample;
}

export const WithForm: Story = {
  render: () => {
    const story = <WithFormExample />;
    return story;
  },
};
