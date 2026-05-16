import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input } from '@/components/common/Input';

const meta = {
  title: 'Common/Input',
  component: Input,
  args: {
    placeholder: '팀 이름을 입력하세요',
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: '수정할 수 없는 값',
  },
};

export const Invalid: Story = {
  args: {
    'aria-invalid': true,
    value: '잘못된 입력',
  },
};
