import { expect, test } from "@playwright/test";

test("하단 탭으로 홈 ↔ 마이 페이지를 오갈 수 있다", async ({ page }) => {
  await page.goto("/");

  const nav = page.getByRole("navigation", { name: "메인 네비게이션" });
  const homeTab = nav.getByRole("link", { name: "홈" });
  const myTab = nav.getByRole("link", { name: "마이" });

  await myTab.click();
  await expect(page).toHaveURL("/my");
  await expect(
    page.getByRole("heading", { name: "마이" }),
  ).toBeVisible();
  await expect(myTab).toHaveClass(/text-foreground/);
  await expect(homeTab).toHaveClass(/text-muted-foreground/);

  await homeTab.click();
  await expect(page).toHaveURL("/");
  await expect(homeTab).toHaveClass(/text-foreground/);
});
