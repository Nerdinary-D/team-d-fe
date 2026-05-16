import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FacilityCard } from '@/app/(b2c)/_components/FacilityCard';
import type { FacilityBadgeVariant } from '@/app/(b2c)/_components/FacilityBadge';

const defaultBadges = [
  'wheelchairRamp',
  'accessibleParking',
] satisfies FacilityBadgeVariant[];

const fourBadges = [
  'wheelchairRamp',
  'accessibleParking',
  'courtAccess',
  'privateShower',
] satisfies FacilityBadgeVariant[];

const overflowBadges = [
  'wheelchairRamp',
  'accessibleParking',
  'courtAccess',
  'privateShower',
  'guideDogWelcome',
  'brailleGuide',
] satisfies FacilityBadgeVariant[];

const meta = {
  title: 'Pages/Home/FacilityCard',
  component: FacilityCard,
  args: {
    name: '시설 명',
    sportName: '종목명',
    imageSrc:
      'https://www.figma.com/api/mcp/asset/35cceb88-ebde-4902-aa5c-a4fb5c56ebea',
    imageAlt: '시설 이미지',
    badges: defaultBadges,
    isFavorite: false,
  },
  decorators: [
    (Story) => (
      <div className="min-h-[420px] bg-white p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FacilityCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FourBadges: Story = {
  args: {
    badges: fourBadges,
  },
};

export const OverflowBadges: Story = {
  args: {
    badges: overflowBadges,
    isFavorite: true,
  },
};
