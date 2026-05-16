import { expect, test } from '@playwright/test';

test('하단 탭으로 홈 ↔ 마이 페이지를 오갈 수 있다', async ({ page }) => {
  await page.goto('/');

  const nav = page.getByRole('navigation', { name: '메인 네비게이션' });
  const mateTab = nav.getByRole('link', { name: '메이트' });
  const homeTab = nav.getByRole('link', { name: '홈' });
  const myTab = nav.getByRole('link', { name: '마이페이지' });

  await expect(nav).toHaveCSS('height', '90px');
  await expect(nav).toHaveCSS('border-top-left-radius', '32px');
  await expect(nav).toHaveCSS('border-top-right-radius', '32px');
  await expect(homeTab).toHaveClass(/text-main/);
  await expect(mateTab).toHaveClass(/text-gray-300/);

  await myTab.click();
  await expect(page).toHaveURL('/my');
  await expect(page.getByRole('heading', { name: '마이' })).toBeVisible();
  await expect(myTab).toHaveClass(/text-main/);
  await expect(homeTab).toHaveClass(/text-gray-300/);

  await homeTab.click();
  await expect(page).toHaveURL('/');
  await expect(homeTab).toHaveClass(/text-main/);
});
