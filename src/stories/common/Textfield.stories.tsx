import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Textfield } from '@/components/common/Textfield';

const meta = {
  title: 'Common/Textfield',
  component: Textfield,
  args: {
    label: '제목',
    placeholder: '예: 이번주 주말 같이 탁구치실 분!',
  },
} satisfies Meta<typeof Textfield>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    defaultValue: '함께 풋살하실 분 구합니다',
  },
};

export const WithHelperText: Story = {
  args: {
    helperText: '50자 이내로 작성해주세요',
  },
};

export const WithError: Story = {
  args: {
    defaultValue: 'a'.repeat(60),
    error: '50자 이내로 작성해주세요',
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
    placeholder: '라벨 없이 단독 input',
  },
};
