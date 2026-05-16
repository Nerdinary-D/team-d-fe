import { describe, expect, it } from "vitest";
import { matchKeys } from "./matches";

describe("matchKeys", () => {
  it("루트 키는 ['matches']", () => {
    expect(matchKeys.all).toEqual(["matches"]);
  });

  it("list 키는 루트 + 'list'", () => {
    expect(matchKeys.list()).toEqual(["matches", "list"]);
  });

  it("detail 키는 루트 + 'detail' + id", () => {
    expect(matchKeys.detail("abc123")).toEqual(["matches", "detail", "abc123"]);
  });

  it("detail 키는 id마다 별도여야 한다 (캐시 분리 보장)", () => {
    expect(matchKeys.detail("1")).not.toEqual(matchKeys.detail("2"));
  });
});
