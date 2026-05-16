import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { OnboardingProgress } from '@/app/onboarding/_components/OnboardingProgress';

const meta = {
  title: 'Pages/Onboarding/OnboardingProgress',
  component: OnboardingProgress,
  args: {
    currentStep: 1,
    totalSteps: 3,
  },
  argTypes: {
    currentStep: {
      control: { type: 'number', min: 1, max: 10 },
    },
    totalSteps: {
      control: { type: 'number', min: 1, max: 10 },
    },
  },
} satisfies Meta<typeof OnboardingProgress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FigmaDefault: Story = {
  render: (args) => {
    const progress = <OnboardingProgress {...args} />;

    return <div className="w-[328px] bg-white">{progress}</div>;
  },
};

export const Steps: Story = {
  render: () => {
    const examples = [
      { currentStep: 1, totalSteps: 3 },
      { currentStep: 2, totalSteps: 3 },
      { currentStep: 3, totalSteps: 3 },
    ];

    const progressItems = examples.map((example) => (
      <OnboardingProgress
        key={`${example.currentStep}-${example.totalSteps}`}
        {...example}
      />
    ));

    return <div className="flex w-[328px] flex-col gap-8">{progressItems}</div>;
  },
};
