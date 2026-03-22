'use client';

import { useEffect, useRef, useState } from 'react';

import { useDebouncedValue } from '@/hooks/use-debounced-value';

import { updateNote } from '../api/notes-api';
import { Note } from '../types/note';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

type NoteEditorProps = {
  note: Note;
  onNoteSaved?: (note: Note) => void;
  onTogglePin?: () => Promise<void>;
  onDelete?: () => Promise<void>;
  onRestore?: () => Promise<void>;
  isPinning?: boolean;
  isDeleting?: boolean;
  isRestoring?: boolean;
  actionErrorMessage?: string | null;
};

export const NoteEditor = ({
  note,
  onNoteSaved,
  onTogglePin,
  onDelete,
  onRestore,
  isPinning = false,
  isDeleting = false,
  isRestoring = false,
  actionErrorMessage = null,
}: NoteEditorProps): React.ReactElement => {
  const [currentNote, setCurrentNote] = useState(note);
  const [content, setContent] = useState(note.content);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  const latestSavedContentRef = useRef(note.content);
  const currentRequestIdRef = useRef(0);

  const debouncedContent = useDebouncedValue(content, 500);

  useEffect(() => {
    setCurrentNote(note);
    setContent(note.content);
    setSaveState('idle');
    setSaveErrorMessage(null);
    latestSavedContentRef.current = note.content;
    currentRequestIdRef.current = 0;
  }, [note]);

  const hasUnsavedChanges = content !== latestSavedContentRef.current;
  const isDeleted = currentNote.deletedAt !== null;

  useEffect(() => {
    if (isDeleted) {
      return;
    }

    if (debouncedContent === latestSavedContentRef.current) {
      return;
    }

    const requestId = currentRequestIdRef.current + 1;
    currentRequestIdRef.current = requestId;
    setSaveState('saving');
    setSaveErrorMessage(null);

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
        setSaveErrorMessage(
          error instanceof Error ? error.message : 'Failed to save note.',
        );
      });
  }, [currentNote.id, debouncedContent, isDeleted, onNoteSaved]);

  const getStatusText = (): string => {
    if (isDeleted) {
      return 'Deleted';
    }

    switch (saveState) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved';
      case 'error':
        return 'Save failed';
      case 'idle':
      default:
        return hasUnsavedChanges ? 'Unsaved changes' : 'Ready';
    }
  };

  const statusText = getStatusText();

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

        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-500">{statusText}</div>

          {isDeleted ? (
            <button
              type="button"
              onClick={() => {
                void onRestore?.();
              }}
              disabled={isRestoring}
              className="rounded-md border border-emerald-300 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRestoring ? 'Restoring...' : 'Restore'}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  void onTogglePin?.();
                }}
                disabled={isPinning || isDeleting}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPinning
                  ? currentNote.isPinned
                    ? 'Unpinning...'
                    : 'Pinning...'
                  : currentNote.isPinned
                    ? 'Unpin'
                    : 'Pin'}
              </button>

              <button
                type="button"
                onClick={() => {
                  void onDelete?.();
                }}
                disabled={isDeleting || isPinning}
                className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </>
          )}
        </div>
      </header>

      <div className="flex-1 px-6 py-4">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder={
            isDeleted ? 'Restore this note to edit it.' : 'Start writing...'
          }
          disabled={isDeleting || isDeleted || isRestoring}
          className="min-h-[420px] w-full resize-none border-0 bg-transparent text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-60"
          spellCheck={false}
        />
      </div>

      {saveErrorMessage || actionErrorMessage ? (
        <div className="border-t border-red-200 bg-red-50 px-6 py-3 text-sm text-red-700">
          {actionErrorMessage ?? saveErrorMessage}
        </div>
      ) : null}
    </section>
  );
};
