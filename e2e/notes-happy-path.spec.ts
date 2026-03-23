import { execSync } from 'node:child_process';

import { expect, test } from '@playwright/test';

const E2E_NOTE_PREFIX = '[E2E]';

const cleanupE2ENotes = (noteIds: string[] = []): void => {
  execSync('pnpm --filter @markdown-typer/api prisma:cleanup:e2e', {
    stdio: 'inherit',
    env: {
      ...process.env,
      E2E_NOTE_IDS: noteIds.join(','),
    },
  });
};

test.describe('notes happy path', () => {
  let createdNoteIds: string[];

  test.beforeEach(() => {
    createdNoteIds = [];
    cleanupE2ENotes();
  });

  test.afterEach(() => {
    cleanupE2ENotes(createdNoteIds);
  });

  test('user can create, edit, autosave, and search a note', async ({
    page,
  }) => {
    const uniqueTitle = `${E2E_NOTE_PREFIX} Note ${Date.now()}`;
    const noteContent = `# ${uniqueTitle}\nThis is an end-to-end test note.`;

    await page.goto('/notes');

    await page.getByRole('button', { name: 'New Note' }).click();

    await expect(page).toHaveURL(/\/notes\/.+/);

    const noteUrl = new URL(page.url());
    const pathSegments = noteUrl.pathname.split('/').filter(Boolean);
    const createdNoteId = pathSegments.at(-1);

    if (!createdNoteId) {
      throw new Error('Failed to capture created note id from URL.');
    }

    createdNoteIds.push(createdNoteId);

    const heading = page.getByRole('heading', { level: 2 });
    const editor = page.getByRole('textbox');

    await expect(heading).toHaveText('Untitled');
    await expect(editor).toHaveValue('');
    await expect(page.getByText('Ready')).toBeVisible();

    await editor.fill(noteContent);
    await expect(editor).toHaveValue(noteContent);

    await expect(page.getByText('Saved')).toBeVisible();
    await expect(heading).toHaveText(uniqueTitle);

    const searchInput = page.getByRole('searchbox');
    await searchInput.fill(uniqueTitle);

    await expect
      .poll(() => new URL(page.url()).searchParams.get('q'))
      .toBe(uniqueTitle);
    await expect(searchInput).toHaveValue(uniqueTitle);

    const matchingSidebarNotes = page
      .locator('aside a')
      .filter({ hasText: uniqueTitle });

    await expect(matchingSidebarNotes).toHaveCount(1);
    await expect(matchingSidebarNotes.first()).toBeVisible();
  });
});
