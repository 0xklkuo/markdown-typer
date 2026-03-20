'use client';

import { useEffect, useRef, useState } from 'react';

import { useDebouncedValue } from '@/hooks/use-debounced-value';

import { updateNote } from '../api/notes-api';
import { Note } from '../types/note';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

type NoteEditorProps = {
  note: Note;
  onNoteSaved?: (note: Note) => void;
};

export const NoteEditor = ({
  note,
  onNoteSaved,
}: NoteEditorProps): React.ReactElement => {
  const [currentNote, setCurrentNote] = useState(note);
  const [content, setContent] = useState(note.content);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const latestSavedContentRef = useRef(note.content);
  const currentRequestIdRef = useRef(0);

  const debouncedContent = useDebouncedValue(content, 500);

  useEffect(() => {
    setCurrentNote(note);
    setContent(note.content);
    setSaveState('idle');
    setErrorMessage(null);
    latestSavedContentRef.current = note.content;
    currentRequestIdRef.current = 0;
  }, [note]);

  const hasUnsavedChanges = content !== latestSavedContentRef.current;

  useEffect(() => {
    if (debouncedContent === latestSavedContentRef.current) {
      return;
    }

    const requestId = currentRequestIdRef.current + 1;
    currentRequestIdRef.current = requestId;
    setSaveState('saving');
    setErrorMessage(null);

    void updateNote(currentNote.id, { content: debouncedContent })
      .then((updatedNote) => {
        if (currentRequestIdRef.current !== requestId) {
          return;
        }

        latestSavedContentRef.current = updatedNote.content;
        setCurrentNote(updatedNote);
        setContent(updatedNote.content);
        setSaveState('saved');
        onNoteSaved?.(updatedNote);
      })
      .catch((error: unknown) => {
        if (currentRequestIdRef.current !== requestId) {
          return;
        }

        setSaveState('error');
        setErrorMessage(
          error instanceof Error ? error.message : 'Failed to save note.',
        );
      });
  }, [currentNote.id, debouncedContent, onNoteSaved]);

  const statusText =
    saveState === 'saving'
      ? 'Saving...'
      : saveState === 'saved'
        ? 'Saved'
        : saveState === 'error'
          ? 'Save failed'
          : hasUnsavedChanges
            ? 'Unsaved changes'
            : 'Ready';

  return (
    <section className="flex min-h-[500px] flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {currentNote.title}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Updated {new Date(currentNote.updatedAt).toLocaleString()}
          </p>
        </div>

        <div className="text-xs text-slate-500">{statusText}</div>
      </header>

      <div className="flex-1 px-6 py-4">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Start writing..."
          className="min-h-[420px] w-full resize-none border-0 bg-transparent text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400"
          spellCheck={false}
        />
      </div>

      {errorMessage ? (
        <div className="border-t border-red-200 bg-red-50 px-6 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}
    </section>
  );
};
