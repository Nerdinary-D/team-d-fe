import { AuthGuard } from './_components/AuthGuard';

export default function B2CLayout({
  children,
  tab,
}: {
  children: React.ReactNode;
  tab?: React.ReactNode;
}) {
  const layout = (
    <div className="flex min-h-svh flex-col">
      <div className="flex-1 pb-[90px]">{children}</div>
      {tab}
    </div>
  );

  return <AuthGuard>{layout}</AuthGuard>;
}
