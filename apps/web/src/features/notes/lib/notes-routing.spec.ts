import { describe, expect, it } from 'vitest';

import { buildNotesPageUrl } from './notes-routing';

describe('buildNotesPageUrl', () => {
  it('builds a note page URL with trimmed query params', () => {
    expect(
      buildNotesPageUrl({
        pathname: '/notes/note_1',
        query: {
          q: '  weekly planning  ',
          includeDeleted: true,
        },
      }),
    ).toBe('/notes/note_1?q=weekly+planning&includeDeleted=true');
  });

  it('returns the base path when the query is empty', () => {
    expect(
      buildNotesPageUrl({
        pathname: '/notes',
        query: {
          q: '   ',
          includeDeleted: false,
        },
      }),
    ).toBe('/notes');
  });
});
