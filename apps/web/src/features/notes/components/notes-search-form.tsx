'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useDebouncedValue } from '@/hooks/use-debounced-value';

export const NotesSearchForm = (): React.ReactElement => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [includeDeleted, setIncludeDeleted] = useState(
    searchParams.get('includeDeleted') === 'true',
  );

  const debouncedQuery = useDebouncedValue(query, 250);

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
    setIncludeDeleted(searchParams.get('includeDeleted') === 'true');
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedQuery.trim()) {
      params.set('q', debouncedQuery.trim());
    } else {
      params.delete('q');
    }

    if (includeDeleted) {
      params.set('includeDeleted', 'true');
    } else {
      params.delete('includeDeleted');
    }

    const nextUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router.replace(nextUrl);
  }, [debouncedQuery, includeDeleted, pathname, router, searchParams]);

  return (
    <div className="space-y-3">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search notes..."
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
      />

      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={includeDeleted}
          onChange={(event) => setIncludeDeleted(event.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-slate-900"
        />
        Show deleted
      </label>
    </div>
  );
};
