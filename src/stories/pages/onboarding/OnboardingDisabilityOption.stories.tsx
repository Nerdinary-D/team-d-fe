import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import {
  OnboardingDisabilityOption,
  OnboardingDisabilityOptionList,
} from '@/app/onboarding/_components/OnboardingDisabilityOption';
import type { OnboardingDisabilityRequirement } from '@/app/onboarding/_components/OnboardingDisabilityOption';

const selectedRequirements: OnboardingDisabilityRequirement[] = [
  { id: 'step-free-entry', label: '단차없는 휠체어 진입', checked: true },
  {
    id: 'equipment-rental',
    label: '스포츠 휠체어 및 맞춤 장비대여',
    checked: false,
  },
  {
    id: 'accessible-changing-room',
    label: '휠체어 전용 탈의실 및 샤워실',
    checked: false,
  },
];

function useSelectableRequirements() {
  const [requirements, setRequirements] = useState(selectedRequirements);

  const handleRequirementCheckedChange = (
    requirement: OnboardingDisabilityRequirement,
    checked: boolean,
  ) => {
    setRequirements((currentRequirements) =>
      currentRequirements.map((currentRequirement) =>
        currentRequirement.id === requirement.id
          ? { ...currentRequirement, checked }
          : currentRequirement,
      ),
    );
  };

  return { requirements, handleRequirementCheckedChange };
}

function SelectedExample() {
  const { requirements, handleRequirementCheckedChange } =
    useSelectableRequirements();

  const selectedCard = (
    <OnboardingDisabilityOption
      label="지체 장애"
      onRequirementCheckedChange={handleRequirementCheckedChange}
      requirements={requirements}
      selected
    />
  );

  return selectedCard;
}

function DefaultExample() {
  const [selected, setSelected] = useState(false);
  const { requirements, handleRequirementCheckedChange } =
    useSelectableRequirements();

  const defaultCard = (
    <OnboardingDisabilityOption
      label="지체 장애"
      onClick={() => setSelected((currentSelected) => !currentSelected)}
      onRequirementCheckedChange={handleRequirementCheckedChange}
      requirements={requirements}
      selected={selected}
    />
  );

  return defaultCard;
}

function ListExample() {
  const { requirements, handleRequirementCheckedChange } =
    useSelectableRequirements();

  const options = [
    {
      label: '지체 장애',
      requirements,
      selected: true,
    },
    { label: '시각 장애', selected: false },
    { label: '청각 장애', selected: false },
    { label: '발달 장애', selected: false },
  ];

  const optionItems = options.map((option) => (
    <OnboardingDisabilityOption
      key={option.label}
      onRequirementCheckedChange={handleRequirementCheckedChange}
      {...option}
    />
  ));

  return (
    <OnboardingDisabilityOptionList>
      {optionItems}
    </OnboardingDisabilityOptionList>
  );
}

const meta = {
  title: 'Pages/Onboarding/OnboardingDisabilityOption',
  component: OnboardingDisabilityOption,
  args: {
    label: '시각 장애',
    selected: false,
  },
  argTypes: {
    selected: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof OnboardingDisabilityOption>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <DefaultExample />,
};

export const Selected: Story = {
  render: () => <SelectedExample />,
};

export const List: Story = {
  render: () => <ListExample />,
};
