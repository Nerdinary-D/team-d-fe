import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Image from 'next/image';
import { SelectToggle } from '@/components/common/SelectToggle';

const meta = {
  title: 'Common/SelectToggle',
  component: SelectToggle,
  args: {
    label: '서울',
    onClick: () => {},
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SelectToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLocationIcon: Story = {
  args: {
    icon: (
      <Image
        src="/icons/location.svg"
        alt=""
        width={24}
        height={24}
        aria-hidden
      />
    ),
  },
};

export const LongLabel: Story = {
  args: {
    label: '서울특별시 중구',
    icon: (
      <Image
        src="/icons/location.svg"
        alt=""
        width={24}
        height={24}
        aria-hidden
      />
    ),
  },
};
