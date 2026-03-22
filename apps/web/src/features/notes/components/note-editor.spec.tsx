import { render, screen } from '@testing-library/react';
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
