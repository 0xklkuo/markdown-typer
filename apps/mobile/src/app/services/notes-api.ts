import { createNotesClient } from '@markdown-typer/shared-notes';

import { runtimeConfig } from '../config/runtime';

const notesClient = createNotesClient({
  baseUrl: runtimeConfig.apiBaseUrl,
});

export const { createNote, getNoteById, listNotes, updateNote } = notesClient;
