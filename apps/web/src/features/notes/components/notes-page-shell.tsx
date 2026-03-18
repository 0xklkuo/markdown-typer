import { ReactNode } from 'react';

import { createNoteAction } from '../actions/create-note-action';
import { Note } from '../types/note';
import { CreateNoteButton } from './create-note-button';
import { NotesLayout } from './notes-layout';
import { NotesList } from './notes-list';

type NotesPageShellProps = {
  notes: Note[];
  selectedNoteId?: string;
  content: ReactNode;
};

export const NotesPageShell = ({
  notes,
  selectedNoteId,
  content,
}: NotesPageShellProps): React.ReactElement => {
  return (
    <NotesLayout
      sidebar={
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Notes</h1>
              <p className="text-sm text-slate-500">
                Minimal markdown note-taking.
              </p>
            </div>

            <CreateNoteButton createNoteAction={createNoteAction} />
          </div>

          <NotesList notes={notes} selectedNoteId={selectedNoteId} />
        </div>
      }
      content={content}
    />
  );
};
