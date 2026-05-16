import { BottomTab } from "./_components/BottomTab";

export default function B2CLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <div className="flex-1 pb-16">{children}</div>
      <BottomTab />
    </div>
  );
}
