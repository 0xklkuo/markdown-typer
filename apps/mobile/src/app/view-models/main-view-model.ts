import { Observable } from '@nativescript/core';

import {
  deriveTitleFromContent,
  sortNotes,
  upsertSortedNote,
} from '@markdown-typer/shared-notes';
import type { Note } from '@markdown-typer/shared-types';

import {
  createNote,
  getNoteById,
  listNotes,
  updateNote,
} from '../services/notes-api';

const AUTOSAVE_DELAY_MS = 500;

type EditorMode = 'edit' | 'preview';

export class MainViewModel extends Observable {
  private autosaveTimeout: ReturnType<typeof setTimeout> | null = null;
  private latestSavedContent = '';
  private selectedNoteId: string | null = null;

  notes: Note[] = [];
  selectedNote: Note | null = null;
  editorContent = '';
  previewContent = '';
  previewContentText = 'Nothing to preview yet.';
  selectedTitle = 'Select a note';
  statusText = 'Ready';
  errorMessage = '';
  isBusy = false;
  mode: EditorMode = 'edit';

  constructor() {
    super();

    void this.initialize();
  }

  async initialize(): Promise<void> {
    await this.refreshNotes();
  }

  async refreshNotes(): Promise<void> {
    this.setBusy(true);
    this.setError('');

    try {
      const notes = await listNotes();
      this.notes = sortNotes(notes);
      this.notifyPropertyChange('notes', this.notes);

      const firstNote = this.notes[0];

      if (!this.selectedNoteId && firstNote) {
        await this.selectNote(firstNote.id);
        return;
      }
    } catch (error: unknown) {
      this.setError(
        error instanceof Error ? error.message : 'Failed to load notes.',
      );
    } finally {
      this.setBusy(false);
    }
  }

  async createNewNote(): Promise<void> {
    this.setBusy(true);
    this.setError('');

    try {
      const note = await createNote({ content: '' });
      this.notes = upsertSortedNote(this.notes, note);
      this.notifyPropertyChange('notes', this.notes);
      await this.applySelectedNote(note);
    } catch (error: unknown) {
      this.setError(
        error instanceof Error ? error.message : 'Failed to create note.',
      );
    } finally {
      this.setBusy(false);
    }
  }

  async selectNote(noteId: string): Promise<void> {
    this.setBusy(true);
    this.setError('');

    try {
      const note = await getNoteById(noteId);
      await this.applySelectedNote(note);
    } catch (error: unknown) {
      this.setError(
        error instanceof Error ? error.message : 'Failed to load note.',
      );
    } finally {
      this.setBusy(false);
    }
  }

  setMode(mode: EditorMode): void {
    this.mode = mode;
    this.notifyPropertyChange('mode', this.mode);
  }

  updateEditorContent(content: string): void {
    this.editorContent = content;
    this.previewContent = content;
    this.previewContentText = content || 'Nothing to preview yet.';
    this.selectedTitle = deriveTitleFromContent(content);
    this.statusText =
      content === this.latestSavedContent ? 'Saved' : 'Unsaved changes';

    this.notifyPropertyChange('editorContent', this.editorContent);
    this.notifyPropertyChange('previewContent', this.previewContent);
    this.notifyPropertyChange('selectedTitle', this.selectedTitle);
    this.notifyPropertyChange('statusText', this.statusText);

    this.queueAutosave();
  }

  private queueAutosave(): void {
    if (!this.selectedNote) {
      return;
    }

    if (this.autosaveTimeout) {
      clearTimeout(this.autosaveTimeout);
    }

    this.autosaveTimeout = setTimeout(() => {
      void this.saveSelectedNote();
    }, AUTOSAVE_DELAY_MS);
  }

  private async saveSelectedNote(): Promise<void> {
    if (!this.selectedNote || this.editorContent === this.latestSavedContent) {
      return;
    }

    this.statusText = 'Saving...';
    this.notifyPropertyChange('statusText', this.statusText);

    try {
      const updatedNote = await updateNote(this.selectedNote.id, {
        content: this.editorContent,
      });

      this.notes = upsertSortedNote(this.notes, updatedNote);
      this.notifyPropertyChange('notes', this.notes);
      await this.applySelectedNote(updatedNote);
      this.statusText = 'Saved';
      this.notifyPropertyChange('statusText', this.statusText);
    } catch (error: unknown) {
      this.setError(
        error instanceof Error ? error.message : 'Failed to save note.',
      );
      this.statusText = 'Save failed';
      this.notifyPropertyChange('statusText', this.statusText);
    }
  }

  private async applySelectedNote(note: Note): Promise<void> {
    this.selectedNoteId = note.id;
    this.selectedNote = note;
    this.editorContent = note.content;
    this.previewContent = note.content;
    this.latestSavedContent = note.content;
    this.selectedTitle = note.title;
    this.statusText = 'Saved';

    this.notifyPropertyChange('selectedNote', this.selectedNote);
    this.notifyPropertyChange('editorContent', this.editorContent);
    this.notifyPropertyChange('previewContent', this.previewContent);
    this.notifyPropertyChange('selectedTitle', this.selectedTitle);
    this.notifyPropertyChange('statusText', this.statusText);
  }

  private setBusy(value: boolean): void {
    this.isBusy = value;
    this.notifyPropertyChange('isBusy', this.isBusy);
  }

  private setError(message: string): void {
    this.errorMessage = message;
    this.notifyPropertyChange('errorMessage', this.errorMessage);
  }
}
