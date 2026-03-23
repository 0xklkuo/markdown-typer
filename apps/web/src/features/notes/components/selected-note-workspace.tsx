'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut';

import { deleteNote, pinNote, restoreNote, unpinNote } from '../api/notes-api';
import { sortNotes } from '../lib/sort-notes';
import { Note } from '../types/note';
import { NoteEditor } from './note-editor';
import { NotesPageShell } from './notes-page-shell';

type SelectedNoteWorkspaceProps = {
  initialNotes: Note[];
  initialNote: Note;
  searchQuery?: string;
  includeDeleted?: boolean;
};

export const SelectedNoteWorkspace = ({
  initialNotes,
  initialNote,
  searchQuery,
  includeDeleted,
}: SelectedNoteWorkspaceProps): React.ReactElement => {
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>(() => sortNotes(initialNotes));
  const [selectedNote, setSelectedNote] = useState<Note>(initialNote);
  const [isPinning, setIsPinning] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(
    null,
  );

  useEffect(() => {
    setNotes(sortNotes(initialNotes));
  }, [initialNotes]);

  useEffect(() => {
    setSelectedNote(initialNote);
  }, [initialNote]);

  const syncUpdatedNote = useCallback((updatedNote: Note): void => {
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

  const handleNoteSaved = useCallback(
    (updatedNote: Note): void => {
      syncUpdatedNote(updatedNote);
    },
    [syncUpdatedNote],
  );

  const handleTogglePin = useCallback(async (): Promise<void> => {
    setIsPinning(true);
    setActionErrorMessage(null);

    try {
      const updatedNote = selectedNote.isPinned
        ? await unpinNote(selectedNote.id)
        : await pinNote(selectedNote.id);

      syncUpdatedNote(updatedNote);
    } catch (error: unknown) {
      setActionErrorMessage(
        error instanceof Error ? error.message : 'Failed to update pin state.',
      );
    } finally {
      setIsPinning(false);
    }
  }, [selectedNote.id, selectedNote.isPinned, syncUpdatedNote]);

  const handleDelete = useCallback(async (): Promise<void> => {
    setIsDeleting(true);
    setActionErrorMessage(null);

    try {
      await deleteNote(selectedNote.id);

      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== selectedNote.id),
      );

      const params = new URLSearchParams();

      if (searchQuery?.trim()) {
        params.set('q', searchQuery.trim());
      }

      if (includeDeleted) {
        params.set('includeDeleted', 'true');
      }

      const nextUrl = params.toString()
        ? `/notes?${params.toString()}`
        : '/notes';

      router.push(nextUrl);
      router.refresh();
    } catch (error: unknown) {
      setActionErrorMessage(
        error instanceof Error ? error.message : 'Failed to delete note.',
      );
      setIsDeleting(false);
    }
  }, [includeDeleted, router, searchQuery, selectedNote.id]);

  const handleRestore = useCallback(async (): Promise<void> => {
    setIsRestoring(true);
    setActionErrorMessage(null);

    try {
      const updatedNote = await restoreNote(selectedNote.id);

      syncUpdatedNote(updatedNote);
    } catch (error: unknown) {
      setActionErrorMessage(
        error instanceof Error ? error.message : 'Failed to restore note.',
      );
    } finally {
      setIsRestoring(false);
    }
  }, [selectedNote.id, syncUpdatedNote]);

  useKeyboardShortcut({
    key: 'p',
    modKey: true,
    shiftKey: true,
    preventDefault: true,
    allowInEditable: true,
    enabled:
      !selectedNote.deletedAt && !isPinning && !isDeleting && !isRestoring,
    handler: () => {
      void handleTogglePin();
    },
  });

  return (
    <NotesPageShell
      notes={notes}
      selectedNoteId={selectedNote.id}
      searchQuery={searchQuery}
      includeDeleted={includeDeleted}
      content={
        <NoteEditor
          note={selectedNote}
          onNoteSaved={handleNoteSaved}
          onTogglePin={handleTogglePin}
          onDelete={handleDelete}
          onRestore={handleRestore}
          isPinning={isPinning}
          isDeleting={isDeleting}
          isRestoring={isRestoring}
          actionErrorMessage={actionErrorMessage}
        />
      }
    />
  );
};
