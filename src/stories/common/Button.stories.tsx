import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/common/Button';

const meta = {
  title: 'Common/Button',
  component: Button,
  args: {
    children: 'Button',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'outline',
        'secondary',
        'ghost',
        'destructive',
        'link',
      ],
    },
    size: {
      control: 'select',
      options: [
        'default',
        'xs',
        'sm',
        'lg',
        'icon',
        'icon-xs',
        'icon-sm',
        'icon-lg',
      ],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => {
    const variants = [
      'default',
      'outline',
      'secondary',
      'ghost',
      'destructive',
      'link',
    ] as const;
    const buttons = variants.map((variant) => (
      <Button key={variant} variant={variant}>
        {variant}
      </Button>
    ));

    return <div className="flex flex-wrap items-center gap-3">{buttons}</div>;
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    children: '저장 중',
  },
};

export const WithIcon: Story = {
  render: () => {
    const icon = <PlusIcon />;

    return (
      <Button>
        {icon}
        경기 추가
      </Button>
    );
  },
};
