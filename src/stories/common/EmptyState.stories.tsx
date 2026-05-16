import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CalendarXIcon } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';

const meta = {
  title: 'Common/EmptyState',
  component: EmptyState,
  args: {
    title: '표시할 경기가 없습니다',
    description: '필터를 변경하거나 새 경기를 추가해 주세요.',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    icon: <CalendarXIcon />,
    action: <Button>경기 추가</Button>,
  },
};
