import { createNotesClient } from '@markdown-typer/shared-notes';

const API_BASE_URL = 'http://localhost:3210/api';

const notesClient = createNotesClient({
  baseUrl: API_BASE_URL,
});

export const { createNote, getNoteById, listNotes, updateNote } = notesClient;
