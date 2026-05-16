import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { OnboardingModeCard } from '@/app/onboarding/_components/OnboardingModeCard';

const description =
  '설명 텍스트설명 텍스트설명 텍스트설명 텍스트설명 텍스트설명 텍스트';

const meta = {
  title: 'Pages/Onboarding/OnboardingModeCard',
  component: OnboardingModeCard,
  args: {
    title: '사용자 모드',
    description,
    selected: false,
  },
  argTypes: {
    selected: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof OnboardingModeCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '사장님 모드',
    selected: false,
  },
};

export const Selected: Story = {
  args: {
    title: '사용자 모드',
    selected: true,
  },
};

export const Variants: Story = {
  render: () => {
    const defaultCard = (
      <OnboardingModeCard title="사장님 모드" description={description} />
    );

    const selectedCard = (
      <OnboardingModeCard
        title="사용자 모드"
        description={description}
        selected
      />
    );

    return (
      <div className="flex w-[328px] flex-col gap-6">
        {defaultCard}
        {selectedCard}
      </div>
    );
  },
};
