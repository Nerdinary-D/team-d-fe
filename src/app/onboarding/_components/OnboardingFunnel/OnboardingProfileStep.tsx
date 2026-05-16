import type { ChangeEvent } from 'react';
import { Textfield } from '@/components/common/Textfield';
import { OnboardingHeading } from './OnboardingHeading';

type OnboardingProfileStepProps = {
  nickname: string;
  onNicknameChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function OnboardingProfileStep({
  nickname,
  onNicknameChange,
}: OnboardingProfileStepProps) {
  const step = (
    <section
      className="mt-[22px] flex w-full flex-col"
      aria-labelledby="profile-step-title"
    >
      <OnboardingHeading
        id="profile-step-title"
        topLine="마지막으로,"
        bottomLine="닉네임을 알려주세요!"
      />
      <div className="mt-[20px]">
        <Textfield
          placeholder="닉네임을 입력하세요."
          value={nickname}
          onChange={onNicknameChange}
        />
      </div>
    </section>
  );

  return step;
}
