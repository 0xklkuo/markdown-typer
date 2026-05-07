import type {
  GetNoteByIdOptions,
  ListNotesQuery,
  Note,
  NoteInput,
} from '@markdown-typer/shared-types';

import { buildListNotesSearchParams } from './notes-utils';

type RequestHeaders = Record<string, string>;

type RequestJsonInit = RequestInit & {
  headers?: RequestHeaders;
};

type NotesClientConfig = {
  baseUrl: string;
  fetchFn?: typeof fetch;
  defaultInit?: RequestInit;
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

const normalizeHeaders = (headers?: RequestInit['headers']): RequestHeaders => {
  if (!headers) {
    return {};
  }

  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }

  if (typeof Headers !== 'undefined' && headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }

  return { ...(headers as RequestHeaders) };
};

const mergeRequestInit = (
  defaultInit: RequestInit | undefined,
  init: RequestInit | undefined,
): RequestInit => {
  return {
    ...defaultInit,
    ...init,
    headers: {
      ...normalizeHeaders(defaultInit?.headers),
      ...normalizeHeaders(init?.headers),
    },
  };
};

const createJsonRequestInit = (
  defaultInit: RequestInit | undefined,
  init: RequestJsonInit,
): RequestInit => {
  return mergeRequestInit(defaultInit, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...normalizeHeaders(init.headers),
    },
  });
};

export const createNotesClient = ({
  baseUrl,
  fetchFn = fetch,
  defaultInit,
}: NotesClientConfig) => {
  const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
    const response = await fetchFn(
      `${baseUrl}${path}`,
      mergeRequestInit(defaultInit, init),
    );

    return parseJsonResponse<T>(response);
  };

  return {
    listNotes: async (query?: ListNotesQuery): Promise<Note[]> => {
      const url = new URL(`${baseUrl}/notes`);
      url.search = buildListNotesSearchParams(query).toString();

      const response = await fetchFn(
        url.toString(),
        mergeRequestInit(defaultInit, undefined),
      );

      return parseJsonResponse<Note[]>(response);
    },
    getNoteById: async (
      id: string,
      options?: GetNoteByIdOptions,
    ): Promise<Note> => {
      const url = new URL(`${baseUrl}/notes/${id}`);

      if (options?.includeDeleted) {
        url.searchParams.set('includeDeleted', 'true');
      }

      const response = await fetchFn(
        url.toString(),
        mergeRequestInit(defaultInit, undefined),
      );

      return parseJsonResponse<Note>(response);
    },
    createNote: async (input: NoteInput): Promise<Note> => {
      return request<Note>(
        `/notes`,
        createJsonRequestInit(defaultInit, {
          method: 'POST',
          body: JSON.stringify(input),
        }),
      );
    },
    updateNote: async (id: string, input: NoteInput): Promise<Note> => {
      return request<Note>(
        `/notes/${id}`,
        createJsonRequestInit(defaultInit, {
          method: 'PATCH',
          body: JSON.stringify(input),
        }),
      );
    },
    pinNote: async (id: string): Promise<Note> => {
      return request<Note>(`/notes/${id}/pin`, {
        method: 'POST',
      });
    },
    unpinNote: async (id: string): Promise<Note> => {
      return request<Note>(`/notes/${id}/unpin`, {
        method: 'POST',
      });
    },
    deleteNote: async (id: string): Promise<Note> => {
      return request<Note>(`/notes/${id}`, {
        method: 'DELETE',
      });
    },
    restoreNote: async (id: string): Promise<Note> => {
      return request<Note>(`/notes/${id}/restore`, {
        method: 'POST',
      });
    },
  };
};
