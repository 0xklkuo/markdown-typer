import Link from 'next/link';

import { Note } from '../types/note';

type NotesListProps = {
  notes: Note[];
  selectedNoteId?: string;
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

        return (
          <li key={note.id}>
            <Link
              href={`/notes/${note.id}`}
              className={[
                'block rounded-lg border px-3 py-3 transition',
                isSelected
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{note.title}</p>
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
