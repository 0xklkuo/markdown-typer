import type { ListNotesQuery, Note } from '@markdown-typer/shared-types';

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
