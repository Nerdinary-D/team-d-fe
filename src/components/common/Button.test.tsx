import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("children을 렌더링한다", () => {
    render(<Button>확인</Button>);
    expect(screen.getByRole("button", { name: "확인" })).toBeInTheDocument();
  });

  it("variant에 해당하는 스타일 클래스를 입힌다", () => {
    render(<Button variant="destructive">삭제</Button>);
    const button = screen.getByRole("button", { name: "삭제" });
    expect(button.className).toMatch(/destructive/);
  });

  it("fullWidth면 w-full 클래스가 붙는다", () => {
    render(<Button fullWidth>전체</Button>);
    expect(screen.getByRole("button", { name: "전체" })).toHaveClass("w-full");
  });

  it("loading이면 disabled 처리되고 스피너가 노출된다", () => {
    render(<Button loading>저장</Button>);
    const button = screen.getByRole("button", { name: "저장" });
    expect(button).toBeDisabled();
    expect(button.querySelector("[aria-hidden]")).toBeInTheDocument();
  });

  it("클릭하면 onClick 핸들러가 호출된다", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>클릭</Button>);

    await user.click(screen.getByRole("button", { name: "클릭" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
