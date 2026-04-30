import Link from 'next/link';
import { ReactNode } from 'react';

import { createNoteAction } from '../actions/create-note-action';
import { Note } from '../types/note';
import { CreateNoteButton } from './create-note-button';
import { NotesLayout } from './notes-layout';
import { NotesList } from './notes-list';
import { NotesSearchForm } from './notes-search-form';

type NotesPageShellProps = {
  notes: Note[];
  selectedNoteId?: string;
  searchQuery?: string;
  includeDeleted?: boolean;
  content: ReactNode;
};

export const NotesPageShell = ({
  notes,
  selectedNoteId,
  searchQuery,
  includeDeleted,
  content,
}: NotesPageShellProps): React.ReactElement => {
  return (
    <NotesLayout
      sidebar={
        <div className="space-y-4 lg:sticky lg:top-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Link
                href="/notes"
                className="inline-block rounded-sm outline-none transition hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <h1 className="text-xl font-semibold text-slate-900">Notes</h1>
              </Link>

              <p className="text-sm text-slate-500">
                Minimal markdown note-taking.
              </p>
            </div>

            <div className="shrink-0">
              <CreateNoteButton createNoteAction={createNoteAction} />
            </div>
          </div>

          <NotesSearchForm />

          <div className="pb-1">
            <NotesList
              notes={notes}
              selectedNoteId={selectedNoteId}
              searchQuery={searchQuery}
              includeDeleted={includeDeleted}
            />
          </div>
        </div>
      }
      content={content}
    />
  );
};
