import { Note } from '../types/note';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type NoteContentInput = {
  content: string;
};

const getApiBaseUrl = (): string => {
  if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured.');
  }

  return API_BASE_URL;
};

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

export const listNotes = async (query?: {
  q?: string;
  includeDeleted?: boolean;
}): Promise<Note[]> => {
  const url = new URL(`${getApiBaseUrl()}/notes`);

  if (query?.q) {
    url.searchParams.set('q', query.q);
  }

  if (query?.includeDeleted) {
    url.searchParams.set('includeDeleted', 'true');
  }

  const response = await fetch(url.toString(), {
    cache: 'no-store',
  });

  return parseJsonResponse<Note[]>(response);
};

export const getNoteById = async (id: string): Promise<Note> => {
  const response = await fetch(`${getApiBaseUrl()}/notes/${id}`, {
    cache: 'no-store',
  });

  return parseJsonResponse<Note>(response);
};

export const createNote = async (input: NoteContentInput): Promise<Note> => {
  const response = await fetch(`${getApiBaseUrl()}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    body: JSON.stringify(input),
  });

  return parseJsonResponse<Note>(response);
};

export const updateNote = async (
  id: string,
  input: NoteContentInput,
): Promise<Note> => {
  const response = await fetch(`${getApiBaseUrl()}/notes/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    body: JSON.stringify(input),
  });

  return parseJsonResponse<Note>(response);
};
