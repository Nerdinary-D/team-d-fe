import { expect, test } from '@playwright/test';
import { seedOwnerUuid } from './auth';

test('홈 진입 시 타이틀과 하단 네비게이션이 보인다', async ({ page }) => {
  await seedOwnerUuid(page);
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: '000님, 환영해요 😀' }),
  ).toBeVisible();
  await expect(
    page.getByRole('navigation', { name: '메인 네비게이션' }),
  ).toBeVisible();
});
