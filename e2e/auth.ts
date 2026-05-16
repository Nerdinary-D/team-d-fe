import type { Page } from '@playwright/test';

const E2E_OWNER_UUID = '00000000-0000-4000-8000-000000000000';

export async function seedOwnerUuid(page: Page) {
  await page.addInitScript((ownerUuid) => {
    window.localStorage.setItem('owner-uuid', ownerUuid);
  }, E2E_OWNER_UUID);
}
