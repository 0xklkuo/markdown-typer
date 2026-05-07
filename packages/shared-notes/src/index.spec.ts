import { describe, expect, it, vi } from 'vitest';

import type { Note } from '@markdown-typer/shared-types';

import {
  buildListNotesSearchParams,
  createNotesClient,
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

describe('createNotesClient', () => {
  it('lists notes with query params', async () => {
    const fetchFn = vi.fn(
      async () =>
        new Response(JSON.stringify([createNote({ id: 'note_1' })]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
    );

    const client = createNotesClient({
      baseUrl: 'http://localhost:3210/api',
      fetchFn: fetchFn as typeof fetch,
    });

    const result = await client.listNotes({
      q: 'weekly',
      includeDeleted: true,
    });

    expect(fetchFn).toHaveBeenCalledWith(
      'http://localhost:3210/api/notes?q=weekly&includeDeleted=true',
      expect.objectContaining({
        headers: expect.any(Object),
      }),
    );
    expect(result).toHaveLength(1);
  });

  it('creates a note with json headers', async () => {
    const fetchFn = vi.fn(
      async () =>
        new Response(JSON.stringify(createNote({ id: 'note_2' })), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
    );

    const client = createNotesClient({
      baseUrl: 'http://localhost:3210/api',
      fetchFn: fetchFn as typeof fetch,
    });

    await client.createNote({ content: 'hello' });

    expect(fetchFn).toHaveBeenCalledWith(
      'http://localhost:3210/api/notes',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ content: 'hello' }),
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    );
  });

  it('throws parsed error messages from failed responses', async () => {
    const fetchFn = vi.fn(
      async () =>
        new Response(JSON.stringify({ message: 'Boom' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
    );

    const client = createNotesClient({
      baseUrl: 'http://localhost:3210/api',
      fetchFn: fetchFn as typeof fetch,
    });

    await expect(client.deleteNote('missing')).rejects.toThrow('Boom');
  });
});
