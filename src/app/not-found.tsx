import Link from "next/link";
import { buttonVariants } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { PageContainer } from "@/components/common/PageContainer";

export default function NotFound() {
  const icon = (
    <span className="text-6xl font-bold tracking-tight">404</span>
  );

  const action = (
    <Link href="/" className={buttonVariants()}>
      홈으로 돌아가기
    </Link>
  );

  return (
    <PageContainer
      as="main"
      className="flex flex-1 flex-col items-center justify-center"
    >
      <EmptyState
        icon={icon}
        title="페이지를 찾을 수 없습니다"
        description="요청하신 페이지가 존재하지 않거나 이동되었어요."
        action={action}
      />
    </PageContainer>
  );
}
