import { expect, test } from '@playwright/test';

test('user can create, edit, autosave, and search a note', async ({ page }) => {
  const uniqueTitle = `E2E Note ${Date.now()}`;
  const noteContent = `# ${uniqueTitle}\nThis is an end-to-end test note.`;

  await page.goto('/notes');

  await page.getByRole('button', { name: 'New Note' }).click();

  await expect(page).toHaveURL(/\/notes\/.+/);

  const editor = page.getByRole('textbox');
  await editor.fill(noteContent);

  await expect(page.getByText('Saved')).toBeVisible();
  await expect(page.getByRole('heading', { level: 2 })).toHaveText(uniqueTitle);

  const searchInput = page.getByRole('searchbox');
  await searchInput.fill(uniqueTitle);

  await expect
    .poll(() => new URL(page.url()).searchParams.get('q'))
    .toBe(uniqueTitle);
  await expect(searchInput).toHaveValue(uniqueTitle);
});
