'use client';

import { useEffect, useRef, useState } from 'react';

import { useDebouncedValue } from '@/hooks/use-debounced-value';

import { updateNote } from '../api/notes-api';
import { Note } from '../types/note';
import { MarkdownPreview } from './markdown-preview';

type EditorMode = 'edit' | 'preview';
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
  const [mode, setMode] = useState<EditorMode>('edit');
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  const latestSavedContentRef = useRef(note.content);
  const currentRequestIdRef = useRef(0);

  const debouncedContent = useDebouncedValue(content, 500);

  useEffect(() => {
    setCurrentNote(note);
    setContent(note.content);
    setMode('edit');
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
    <section className="flex min-h-[calc(100dvh-2rem)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:min-h-[calc(100dvh-3rem)]">
      <header className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-slate-900 sm:text-xl">
              {currentNote.title}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Updated {new Date(currentNote.updatedAt).toLocaleString()}
            </p>
          </div>

          <div className="text-xs text-slate-500 sm:text-right">
            {statusText}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex w-full rounded-md border border-slate-200 bg-slate-50 p-1 sm:w-auto">
            <button
              type="button"
              onClick={() => setMode('edit')}
              className={[
                'flex-1 rounded px-3 py-2 text-xs font-medium transition sm:flex-none',
                mode === 'edit'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700',
              ].join(' ')}
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => setMode('preview')}
              className={[
                'flex-1 rounded px-3 py-2 text-xs font-medium transition sm:flex-none',
                mode === 'preview'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700',
              ].join(' ')}
            >
              Preview
            </button>
          </div>

          {isDeleted ? (
            <button
              type="button"
              onClick={() => {
                void onRestore?.();
              }}
              disabled={isRestoring}
              className="w-full rounded-md border border-emerald-300 px-3 py-2 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-3 sm:py-1.5"
            >
              {isRestoring ? 'Restoring...' : 'Restore'}
            </button>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  void onTogglePin?.();
                }}
                disabled={isPinning || isDeleting}
                title="Pin or unpin note (Ctrl/Cmd+Shift+P)"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-1.5"
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
                className="w-full rounded-md border border-red-300 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-1.5"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 px-4 py-4 sm:px-6">
        {mode === 'edit' ? (
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={
              isDeleted ? 'Restore this note to edit it.' : 'Start writing...'
            }
            disabled={isDeleting || isDeleted || isRestoring}
            className="min-h-[50dvh] w-full flex-1 resize-none border-0 bg-transparent text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-60 sm:min-h-0"
            spellCheck={false}
          />
        ) : (
          <div className="min-h-[50dvh] w-full flex-1 overflow-y-auto sm:min-h-0">
            <MarkdownPreview content={content} />
          </div>
        )}
      </div>

      {saveErrorMessage || actionErrorMessage ? (
        <div className="border-t border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:px-6">
          {actionErrorMessage ?? saveErrorMessage}
        </div>
      ) : null}
    </section>
  );
};
