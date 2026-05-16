export default function B2CLayout({
  children,
  tab,
}: {
  children: React.ReactNode;
  tab: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <div className="flex-1 pb-16">{children}</div>
      {tab}
    </div>
  );
}
