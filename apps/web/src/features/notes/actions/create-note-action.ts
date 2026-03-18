'use server';

import { createNote } from '../api/notes-api';

export const createNoteAction = async (): Promise<{ id: string }> => {
  const note = await createNote({ content: '' });

  return { id: note.id };
};
