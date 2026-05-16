export function OnboardingHeading({
  bottomLine,
  id,
  topLine,
}: {
  bottomLine: string;
  id: string;
  topLine: string;
}) {
  return (
    <h1 id={id} className="text-header2 text-black">
      <span className="block">{topLine}</span>
      <span className="block">{bottomLine}</span>
    </h1>
  );
}
