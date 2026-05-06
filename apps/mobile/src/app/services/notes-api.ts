import { buildListNotesSearchParams } from '@markdown-typer/shared-notes';
import type {
  GetNoteByIdOptions,
  ListNotesQuery,
  Note,
  NoteInput,
} from '@markdown-typer/shared-types';

const API_BASE_URL = 'http://localhost:3210/api';

const parseJsonResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const fallbackMessage = `Request failed with status ${response.status}`;
    let message = fallbackMessage;

    try {
      const errorBody = (await response.json()) as {
        message?: string | string[];
      };

      if (typeof errorBody.message === 'string') {
        message = errorBody.message;
      } else if (Array.isArray(errorBody.message)) {
        message = errorBody.message.join(', ');
      }
    } catch {
      // Ignore JSON parsing failures and use fallback message.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
};

export const listNotes = async (query?: ListNotesQuery): Promise<Note[]> => {
  const url = new URL(`${API_BASE_URL}/notes`);
  url.search = buildListNotesSearchParams(query).toString();

  const response = await fetch(url.toString());

  return parseJsonResponse<Note[]>(response);
};

export const getNoteById = async (
  id: string,
  options?: GetNoteByIdOptions,
): Promise<Note> => {
  const url = new URL(`${API_BASE_URL}/notes/${id}`);

  if (options?.includeDeleted) {
    url.searchParams.set('includeDeleted', 'true');
  }

  const response = await fetch(url.toString());

  return parseJsonResponse<Note>(response);
};

export const createNote = async (input: NoteInput): Promise<Note> => {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return parseJsonResponse<Note>(response);
};

export const updateNote = async (
  id: string,
  input: NoteInput,
): Promise<Note> => {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return parseJsonResponse<Note>(response);
};
