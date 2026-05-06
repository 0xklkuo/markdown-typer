import type { ListNotesQuery, Note } from '@markdown-typer/shared-types';

const MARKDOWN_HEADING_PREFIX = /^(#{1,6})\s+/;
const MAX_TITLE_LENGTH = 120;

const normalizeTitleLine = (line: string): string =>
  line.replace(MARKDOWN_HEADING_PREFIX, '').trim();

export const deriveTitleFromContent = (content: string): string => {
  const lines = content.split('\n');

  for (const rawLine of lines) {
    const trimmedLine = rawLine.trim();

    if (!trimmedLine) {
      continue;
    }

    const normalizedLine = normalizeTitleLine(trimmedLine);

    if (normalizedLine) {
      return normalizedLine.slice(0, MAX_TITLE_LENGTH);
    }
  }

  return 'Untitled';
};

export const sortNotes = (notes: Note[]): Note[] => {
  return [...notes].sort((left, right) => {
    if (left.isPinned !== right.isPinned) {
      return left.isPinned ? -1 : 1;
    }

    return (
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
    );
  });
};

export const upsertSortedNote = (notes: Note[], updatedNote: Note): Note[] => {
  const nextNotes = notes.some((note) => note.id === updatedNote.id)
    ? notes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    : [updatedNote, ...notes];

  return sortNotes(nextNotes);
};

export const buildListNotesSearchParams = (
  query?: ListNotesQuery,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (query?.q?.trim()) {
    params.set('q', query.q.trim());
  }

  if (query?.includeDeleted) {
    params.set('includeDeleted', 'true');
  }

  return params;
};
