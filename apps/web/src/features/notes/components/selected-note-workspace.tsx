'use client';

import { useCallback, useEffect, useState } from 'react';

import { sortNotes } from '../lib/sort-notes';
import { Note } from '../types/note';
import { NoteEditor } from './note-editor';
import { NotesPageShell } from './notes-page-shell';

type SelectedNoteWorkspaceProps = {
  initialNotes: Note[];
  initialNote: Note;
  searchQuery?: string;
};

export const SelectedNoteWorkspace = ({
  initialNotes,
  initialNote,
  searchQuery,
}: SelectedNoteWorkspaceProps): React.ReactElement => {
  const [notes, setNotes] = useState<Note[]>(() => sortNotes(initialNotes));
  const [selectedNote, setSelectedNote] = useState<Note>(initialNote);

  useEffect(() => {
    setNotes(sortNotes(initialNotes));
  }, [initialNotes]);

  useEffect(() => {
    setSelectedNote(initialNote);
  }, [initialNote]);

  const handleNoteSaved = useCallback((updatedNote: Note): void => {
    setSelectedNote(updatedNote);

    setNotes((currentNotes) => {
      const nextNotes = currentNotes.some((note) => note.id === updatedNote.id)
        ? currentNotes.map((note) =>
          note.id === updatedNote.id ? updatedNote : note,
        )
        : [updatedNote, ...currentNotes];

      return sortNotes(nextNotes);
    });
  }, []);

  return (
    <NotesPageShell
      notes={notes}
      selectedNoteId={selectedNote.id}
      searchQuery={searchQuery}
      content={<NoteEditor note={selectedNote} onNoteSaved={handleNoteSaved} />}
    />
  );
};
