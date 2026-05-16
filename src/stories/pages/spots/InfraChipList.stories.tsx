import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { InfraChipList } from '@/app/(b2c)/spots/[spotId]/_components/InfraChipList';

const meta = {
  title: 'Pages/Spots/InfraChipList',
  component: InfraChipList,
  args: {
    infraList: ['휠체어 경사로', '주차 가능', '샤워 시설'],
  },
} satisfies Meta<typeof InfraChipList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Single: Story = {
  args: {
    infraList: ['휠체어 경사로'],
  },
};

export const Empty: Story = {
  args: {
    infraList: [],
  },
};
