import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { PartnerPostFormDialog } from '@/app/(b2c)/spots/[spotId]/_components/PartnerPostFormDialog';

const meta = {
  title: 'Pages/Spots/PartnerPostFormDialog',
  component: PartnerPostFormDialog,
} satisfies Meta<typeof PartnerPostFormDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

function DialogPlayground({ initialOpen }: { initialOpen: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <div className="flex gap-2">
      <Button onClick={() => setOpen(true)}>다이얼로그 열기</Button>
      <PartnerPostFormDialog spotId="1" open={open} onOpenChange={setOpen} />
    </div>
  );
}

export const Open: Story = {
  render: () => <DialogPlayground initialOpen={true} />,
};

export const Closed: Story = {
  render: () => <DialogPlayground initialOpen={false} />,
};
