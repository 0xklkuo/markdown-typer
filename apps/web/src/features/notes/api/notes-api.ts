import { createNotesClient } from '@markdown-typer/shared-notes';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getApiBaseUrl = (): string => {
  if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured.');
  }

  return API_BASE_URL;
};

const notesClient = createNotesClient({
  baseUrl: getApiBaseUrl(),
  defaultInit: {
    cache: 'no-store',
  },
});

export const {
  createNote,
  deleteNote,
  getNoteById,
  listNotes,
  pinNote,
  restoreNote,
  unpinNote,
  updateNote,
} = notesClient;
