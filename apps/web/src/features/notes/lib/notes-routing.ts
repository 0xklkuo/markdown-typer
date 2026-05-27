import type { ListNotesQuery } from '@markdown-typer/shared-types';

import { buildListNotesSearchParams } from '@markdown-typer/shared-notes';

type BuildNotesPageUrlOptions = {
  pathname: string;
  query?: ListNotesQuery;
};

export const buildNotesPageUrl = ({
  pathname,
  query,
}: BuildNotesPageUrlOptions): string => {
  const search = buildListNotesSearchParams(query).toString();

  return search ? `${pathname}?${search}` : pathname;
};
