import Link from 'next/link';

import { Note } from '../types/note';

type NotesListProps = {
  notes: Note[];
  selectedNoteId?: string;
  searchQuery?: string;
  includeDeleted?: boolean;
};

const formatUpdatedAt = (value: string): string =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));

export const NotesList = ({
  notes,
  selectedNoteId,
  searchQuery,
  includeDeleted,
}: NotesListProps): React.ReactElement => {
  if (notes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
        No notes yet.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {notes.map((note) => {
        const isSelected = note.id === selectedNoteId;

        const query = {
          ...(searchQuery?.trim() ? { q: searchQuery.trim() } : {}),
          ...(includeDeleted ? { includeDeleted: 'true' } : {}),
        };

        const href =
          Object.keys(query).length > 0
            ? {
                pathname: `/notes/${note.id}`,
                query,
              }
            : `/notes/${note.id}`;

        return (
          <li key={note.id}>
            <Link
              href={href}
              className={[
                'block rounded-lg border px-3 py-3 transition',
                isSelected
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50',
                note.deletedAt ? 'opacity-70' : '',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{note.title}</p>
                    {note.deletedAt ? (
                      <span
                        className={[
                          'rounded px-1.5 py-0.5 text-[10px] font-medium',
                          isSelected
                            ? 'bg-slate-700 text-slate-200'
                            : 'bg-slate-100 text-slate-600',
                        ].join(' ')}
                      >
                        Deleted
                      </span>
                    ) : null}
                  </div>

                  <p
                    className={[
                      'mt-1 line-clamp-2 text-xs',
                      isSelected ? 'text-slate-300' : 'text-slate-500',
                    ].join(' ')}
                  >
                    {note.content || 'Empty note'}
                  </p>
                </div>

                <div className="shrink-0 text-[11px]">
                  {note.isPinned ? '📌' : formatUpdatedAt(note.updatedAt)}
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
