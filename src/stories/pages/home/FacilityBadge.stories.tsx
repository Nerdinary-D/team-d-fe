import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  FacilityBadge,
  facilityBadgeVariants,
} from '@/app/(b2c)/_components/FacilityBadge';

const meta = {
  title: 'Pages/Home/FacilityBadge',
  component: FacilityBadge,
  args: {
    variant: 'courtAccess',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: facilityBadgeVariants.map((variant) => variant.key),
    },
  },
} satisfies Meta<typeof FacilityBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => {
    const badges = facilityBadgeVariants.map((variant) => (
      <FacilityBadge key={variant.key} variant={variant.key} />
    ));

    return <div className="flex max-w-[360px] flex-wrap gap-2">{badges}</div>;
  },
};
