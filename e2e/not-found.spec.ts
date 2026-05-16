import { expect, test } from '@playwright/test';

test('존재하지 않는 경로로 진입하면 404 페이지가 노출된다', async ({
  page,
}) => {
  const response = await page.goto('/존재하지않는경로');

  expect(response?.status()).toBe(404);
  await expect(page.getByText('404')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: '페이지를 찾을 수 없습니다' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: '홈으로 돌아가기' }),
  ).toBeVisible();
});
