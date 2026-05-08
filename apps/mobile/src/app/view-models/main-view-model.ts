import { Observable } from '@nativescript/core';

import { sortNotes, upsertSortedNote } from '@markdown-typer/shared-notes';
import type { Note } from '@markdown-typer/shared-types';

import {
  createNote,
  getNoteById,
  listNotes,
  updateNote,
} from '../services/notes-api';

const AUTOSAVE_DELAY_MS = 500;
const MAX_NOTE_EXCERPT_LENGTH = 96;

type MobileScreen = 'list' | 'detail';

type NoteListItem = {
  id: string;
  title: string;
  excerpt: string;
  isPinned: boolean;
};

const buildNoteExcerpt = (content: string): string => {
  const singleLine = content.replace(/\s+/g, ' ').trim();

  if (!singleLine) {
    return 'Empty note';
  }

  if (singleLine.length <= MAX_NOTE_EXCERPT_LENGTH) {
    return singleLine;
  }

  return `${singleLine.slice(0, MAX_NOTE_EXCERPT_LENGTH).trimEnd()}…`;
};

export class MainViewModel extends Observable {
  private autosaveTimeout: ReturnType<typeof setTimeout> | null = null;
  private latestSavedContent = '';
  private selectedNoteId: string | null = null;

  notes: Note[] = [];
  noteListItems: NoteListItem[] = [];
  selectedNote: Note | null = null;
  editorContent = '';
  selectedTitle = 'Select a note';
  statusText = 'Ready';
  errorMessage = '';
  isBusy = false;
  screen: MobileScreen = 'list';
  canGoBack = false;

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
      this.noteListItems = this.notes.map((note) => ({
        id: note.id,
        title: note.title,
        excerpt: buildNoteExcerpt(note.content),
        isPinned: note.isPinned,
      }));
      this.notifyPropertyChange('notes', this.notes);
      this.notifyPropertyChange('noteListItems', this.noteListItems);

      if (!this.selectedNoteId) {
        this.showList();
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
      this.syncNoteListItems();
      this.notifyPropertyChange('notes', this.notes);
      this.notifyPropertyChange('noteListItems', this.noteListItems);
      await this.applySelectedNote(note);
      this.showDetail();
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
      this.showDetail();
    } catch (error: unknown) {
      this.setError(
        error instanceof Error ? error.message : 'Failed to load note.',
      );
    } finally {
      this.setBusy(false);
    }
  }

  showList(): void {
    this.screen = 'list';
    this.canGoBack = false;
    this.notifyPropertyChange('screen', this.screen);
    this.notifyPropertyChange('canGoBack', this.canGoBack);
  }

  showDetail(): void {
    this.screen = 'detail';
    this.canGoBack = true;
    this.notifyPropertyChange('screen', this.screen);
    this.notifyPropertyChange('canGoBack', this.canGoBack);
  }

  updateEditorContent(content: string): void {
    this.editorContent = content;
    this.statusText =
      content === this.latestSavedContent ? 'Saved' : 'Unsaved changes';

    this.notifyPropertyChange('editorContent', this.editorContent);
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
      this.syncNoteListItems();
      this.notifyPropertyChange('notes', this.notes);
      this.notifyPropertyChange('noteListItems', this.noteListItems);
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
    this.latestSavedContent = note.content;
    this.selectedTitle = note.title;
    this.statusText = 'Saved';

    this.notifyPropertyChange('selectedNote', this.selectedNote);
    this.notifyPropertyChange('editorContent', this.editorContent);
    this.notifyPropertyChange('selectedTitle', this.selectedTitle);
    this.notifyPropertyChange('statusText', this.statusText);
  }

  private syncNoteListItems(): void {
    this.noteListItems = this.notes.map((note) => ({
      id: note.id,
      title: note.title,
      excerpt: buildNoteExcerpt(note.content),
      isPinned: note.isPinned,
    }));
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
