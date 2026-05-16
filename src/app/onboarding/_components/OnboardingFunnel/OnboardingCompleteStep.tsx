import Image from 'next/image';

export function OnboardingCompleteStep() {
  const confettiImage = (
    <Image
      src="/images/onboarding/complete-confetti.png"
      alt=""
      width={535}
      height={315}
      className="pointer-events-none absolute left-1/2 top-[102px] h-[315px] w-[535px] -translate-x-1/2 object-cover"
    />
  );

  const heading = (
    <h1
      id="onboarding-complete-title"
      aria-label="온보딩 완료! 이제 온그라운드를 시작할게요!"
      className="absolute left-1/2 top-[241px] w-full -translate-x-1/2 text-center text-header1 text-black"
    >
      <span className="block">온보딩 완료!</span>
      <span className="block">이제 온그라운드를 시작할게요!</span>
    </h1>
  );

  const completeStep = (
    <section
      aria-labelledby="onboarding-complete-title"
      className="absolute inset-0 overflow-hidden bg-white"
    >
      {confettiImage}
      {heading}
    </section>
  );

  return completeStep;
}
