import { describe, expect, it } from 'vitest';

import type { Note } from '@markdown-typer/shared-types';

import {
  buildListNotesSearchParams,
  sortNotes,
  upsertSortedNote,
} from './index';

const createNote = (overrides: Partial<Note>): Note => ({
  id: overrides.id ?? 'note_1',
  title: overrides.title ?? 'Untitled',
  content: overrides.content ?? '',
  isPinned: overrides.isPinned ?? false,
  createdAt: overrides.createdAt ?? '2026-01-01T00:00:00.000Z',
  updatedAt: overrides.updatedAt ?? '2026-01-01T00:00:00.000Z',
  deletedAt: overrides.deletedAt ?? null,
});

describe('sortNotes', () => {
  it('sorts pinned notes before unpinned notes', () => {
    const notes = [
      createNote({
        id: 'note_1',
        isPinned: false,
        updatedAt: '2026-01-01T00:00:00.000Z',
      }),
      createNote({
        id: 'note_2',
        isPinned: true,
        updatedAt: '2026-01-01T00:00:00.000Z',
      }),
    ];

    expect(sortNotes(notes).map((note) => note.id)).toEqual([
      'note_2',
      'note_1',
    ]);
  });

  it('sorts newer notes first when pin state matches', () => {
    const notes = [
      createNote({ id: 'note_1', updatedAt: '2026-01-01T00:00:00.000Z' }),
      createNote({ id: 'note_2', updatedAt: '2026-01-03T00:00:00.000Z' }),
      createNote({ id: 'note_3', updatedAt: '2026-01-02T00:00:00.000Z' }),
    ];

    expect(sortNotes(notes).map((note) => note.id)).toEqual([
      'note_2',
      'note_3',
      'note_1',
    ]);
  });
});

describe('upsertSortedNote', () => {
  it('replaces an existing note and keeps the list sorted', () => {
    const notes = [
      createNote({ id: 'note_1', updatedAt: '2026-01-01T00:00:00.000Z' }),
      createNote({ id: 'note_2', updatedAt: '2026-01-02T00:00:00.000Z' }),
    ];

    const updatedNote = createNote({
      id: 'note_1',
      updatedAt: '2026-01-04T00:00:00.000Z',
      title: 'Updated note',
    });

    expect(upsertSortedNote(notes, updatedNote).map((note) => note.id)).toEqual(
      ['note_1', 'note_2'],
    );
  });

  it('adds a new note and keeps the list sorted', () => {
    const notes = [
      createNote({ id: 'note_1', updatedAt: '2026-01-01T00:00:00.000Z' }),
    ];

    const newNote = createNote({
      id: 'note_2',
      isPinned: true,
      updatedAt: '2026-01-02T00:00:00.000Z',
    });

    expect(upsertSortedNote(notes, newNote).map((note) => note.id)).toEqual([
      'note_2',
      'note_1',
    ]);
  });
});

describe('buildListNotesSearchParams', () => {
  it('builds trimmed query params for list notes requests', () => {
    expect(
      buildListNotesSearchParams({
        q: '  weekly planning  ',
        includeDeleted: true,
      }).toString(),
    ).toBe('q=weekly+planning&includeDeleted=true');
  });

  it('returns empty params when query is empty', () => {
    expect(buildListNotesSearchParams({ q: '   ' }).toString()).toBe('');
  });
});
