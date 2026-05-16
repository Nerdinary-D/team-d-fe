import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Textarea } from '@/components/common/Textarea';

const meta = {
  title: 'Common/Textarea',
  component: Textarea,
  args: {
    label: '모집 내용',
    placeholder: '모집내용을 자유롭게 입력해보세요.',
    rows: 5,
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    defaultValue: '주 1회 풋살 함께 즐길 메이트 모집합니다. 초보 환영이에요!',
  },
};

export const WithHelperText: Story = {
  args: {
    helperText: '500자 이내로 작성해주세요',
  },
};

export const WithError: Story = {
  args: {
    defaultValue: '내용이 너무 길어요',
    error: '500자 이내로 작성해주세요',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: '편집 불가',
  },
};

export const WithoutLabel: Story = {
  args: {
    label: undefined,
    placeholder: '라벨 없이 단독 textarea',
  },
};
