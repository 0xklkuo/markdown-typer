import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { NoteEditor } from './note-editor';

vi.mock('../api/notes-api', () => ({
  updateNote: vi.fn(),
}));

describe('NoteEditor', () => {
  it('renders note title and content', () => {
    render(
      <NoteEditor
        note={{
          id: 'note_1',
          title: 'Weekly Planning',
          content: '# Weekly Planning\n- ship MVP',
          isPinned: false,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
          deletedAt: null,
        }}
      />,
    );

    expect(screen.getByText('Weekly Planning')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue(
      '# Weekly Planning\n- ship MVP',
    );
  });

  it('renders markdown preview when preview mode is selected', async () => {
    const user = userEvent.setup();

    render(
      <NoteEditor
        note={{
          id: 'note_1',
          title: 'Weekly Planning',
          content: '# Weekly Planning\n- ship MVP',
          isPinned: false,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
          deletedAt: null,
        }}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Preview' }));

    expect(
      screen.getByRole('heading', { level: 1, name: 'Weekly Planning' }),
    ).toBeInTheDocument();
    expect(screen.getByText('ship MVP')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('shows restore action and disables editing for deleted notes', () => {
    render(
      <NoteEditor
        note={{
          id: 'note_1',
          title: 'Deleted Note',
          content: 'archived content',
          isPinned: false,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
          deletedAt: '2026-01-02T00:00:00.000Z',
        }}
      />,
    );

    expect(screen.getByRole('button', { name: 'Restore' })).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
