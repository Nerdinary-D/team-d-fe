import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("문자열 클래스를 공백으로 이어준다", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("falsy 값은 무시한다", () => {
    expect(cn("a", false && "b", null, undefined, "", "c")).toBe("a c");
  });

  it("조건부 객체/배열도 평탄화한다", () => {
    expect(cn("a", { b: true, c: false }, ["d", "e"])).toBe("a b d e");
  });

  it("충돌하는 Tailwind 유틸리티는 뒤의 것이 이긴다 (twMerge)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm", "text-base")).toBe("text-base");
  });
});
