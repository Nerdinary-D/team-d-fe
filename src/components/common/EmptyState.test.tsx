import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("title은 항상 heading으로 렌더링된다", () => {
    render(<EmptyState title="결과가 없습니다" />);
    expect(
      screen.getByRole("heading", { name: "결과가 없습니다" }),
    ).toBeInTheDocument();
  });

  it("description이 있으면 함께 렌더링된다", () => {
    render(<EmptyState title="제목" description="설명 텍스트" />);
    expect(screen.getByText("설명 텍스트")).toBeInTheDocument();
  });

  it("description이 없으면 렌더링하지 않는다", () => {
    render(<EmptyState title="제목" />);
    expect(screen.queryByText(/설명/)).not.toBeInTheDocument();
  });

  it("icon과 action을 함께 렌더링한다", () => {
    render(
      <EmptyState
        title="제목"
        icon={<span data-testid="icon">404</span>}
        action={<button>다시 시도</button>}
      />,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "다시 시도" }),
    ).toBeInTheDocument();
  });
});
