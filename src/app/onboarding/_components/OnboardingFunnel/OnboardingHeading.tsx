export function OnboardingHeading({
  bottomLine,
  id,
  topLine,
}: {
  bottomLine: string;
  id: string;
  topLine: string;
}) {
  const topLineElement = <span className="block">{topLine}</span>;
  const bottomLineElement = <span className="block">{bottomLine}</span>;

  const heading = (
    <h1 id={id} className="text-header2 text-black">
      {topLineElement}
      {bottomLineElement}
    </h1>
  );

  return heading;
}
