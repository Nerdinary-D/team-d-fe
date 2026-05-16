import Link from "next/link";
import { buttonVariants } from "@/components/common/Button";
import { PageContainer } from "@/components/common/PageContainer";

export default function NotFound() {
  const code = (
    <p className="text-6xl font-bold tracking-tight text-muted-foreground">
      404
    </p>
  );

  const title = (
    <h1 className="mt-4 text-2xl font-semibold">페이지를 찾을 수 없습니다</h1>
  );

  const description = (
    <p className="mt-2 text-sm text-muted-foreground">
      요청하신 페이지가 존재하지 않거나 이동되었어요.
    </p>
  );

  const action = (
    <div className="mt-6">
      <Link href="/" className={buttonVariants()}>
        홈으로 돌아가기
      </Link>
    </div>
  );

  return (
    <PageContainer
      as="main"
      size="sm"
      className="flex flex-1 flex-col items-center justify-center text-center"
    >
      {code}
      {title}
      {description}
      {action}
    </PageContainer>
  );
}
