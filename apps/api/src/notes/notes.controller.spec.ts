import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

type NoteResponse = {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type NotesServiceMock = {
  createNote: ReturnType<typeof vi.fn>;
  listNotes: ReturnType<typeof vi.fn>;
  getNoteById: ReturnType<typeof vi.fn>;
  updateNote: ReturnType<typeof vi.fn>;
  deleteNote: ReturnType<typeof vi.fn>;
  restoreNote: ReturnType<typeof vi.fn>;
  pinNote: ReturnType<typeof vi.fn>;
  unpinNote: ReturnType<typeof vi.fn>;
};

const createNoteResponse = (
  overrides?: Partial<NoteResponse>,
): NoteResponse => ({
  id: 'note_1',
  title: 'Weekly Planning',
  content: '# Weekly Planning\n- ship MVP',
  isPinned: false,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  deletedAt: null,
  ...overrides,
});

const createNotesServiceMock = (): NotesServiceMock => ({
  createNote: vi.fn(),
  listNotes: vi.fn(),
  getNoteById: vi.fn(),
  updateNote: vi.fn(),
  deleteNote: vi.fn(),
  restoreNote: vi.fn(),
  pinNote: vi.fn(),
  unpinNote: vi.fn(),
});

describe('NotesController', () => {
  let controller: NotesController;
  let service: NotesServiceMock;

  beforeEach(() => {
    service = createNotesServiceMock();
    controller = new NotesController(service as unknown as NotesService);
  });

  describe('createNote', () => {
    it('calls NotesService.createNote with parsed content', async () => {
      const note = createNoteResponse();

      service.createNote.mockResolvedValue(note);

      const result = await controller.createNote({
        content: '# Weekly Planning\n- ship MVP',
      });

      expect(service.createNote).toHaveBeenCalledWith(
        '# Weekly Planning\n- ship MVP',
      );
      expect(result).toEqual(note);
    });

    it('defaults content to an empty string when omitted', async () => {
      const note = createNoteResponse({
        title: 'Untitled',
        content: '',
      });

      service.createNote.mockResolvedValue(note);

      const result = await controller.createNote({});

      expect(service.createNote).toHaveBeenCalledWith('');
      expect(result).toEqual(note);
    });
  });

  describe('listNotes', () => {
    it('calls NotesService.listNotes with parsed query values', async () => {
      const notes = [createNoteResponse()];

      service.listNotes.mockResolvedValue(notes);

      const result = await controller.listNotes({
        q: 'weekly',
        includeDeleted: 'true',
      });

      expect(service.listNotes).toHaveBeenCalledWith({
        q: 'weekly',
        includeDeleted: true,
      });
      expect(result).toEqual(notes);
    });

    it('defaults includeDeleted to false when omitted', async () => {
      const notes = [createNoteResponse()];

      service.listNotes.mockResolvedValue(notes);

      const result = await controller.listNotes({});

      expect(service.listNotes).toHaveBeenCalledWith({
        q: undefined,
        includeDeleted: false,
      });
      expect(result).toEqual(notes);
    });
  });

  describe('getNoteById', () => {
    it('calls NotesService.getNoteById with parsed params', async () => {
      const note = createNoteResponse();

      service.getNoteById.mockResolvedValue(note);

      const result = await controller.getNoteById(
        { id: 'note_1' },
        {},
      );

      expect(service.getNoteById).toHaveBeenCalledWith('note_1', {
        includeDeleted: false,
      });
      expect(result).toEqual(note);
    });

    it('passes includeDeleted to NotesService.getNoteById when requested', async () => {
      const note = createNoteResponse({
        deletedAt: '2026-01-02T00:00:00.000Z',
      });

      service.getNoteById.mockResolvedValue(note);

      const result = await controller.getNoteById(
        { id: 'note_1' },
        { includeDeleted: 'true' },
      );

      expect(service.getNoteById).toHaveBeenCalledWith('note_1', {
        includeDeleted: true,
      });
      expect(result).toEqual(note);
    });

    it('rethrows service errors such as NotFoundException', async () => {
      service.getNoteById.mockRejectedValue(
        new NotFoundException('Note not found'),
      );

      await expect(
        controller.getNoteById({ id: 'missing' }, {}),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('updateNote', () => {
    it('calls NotesService.updateNote with parsed params and body', async () => {
      const note = createNoteResponse({
        title: 'Updated Title',
        content: '# Updated Title\nnew content',
      });

      service.updateNote.mockResolvedValue(note);

      const result = await controller.updateNote(
        { id: 'note_1' },
        { content: '# Updated Title\nnew content' },
      );

      expect(service.updateNote).toHaveBeenCalledWith(
        'note_1',
        '# Updated Title\nnew content',
      );
      expect(result).toEqual(note);
    });
  });

  describe('deleteNote', () => {
    it('calls NotesService.deleteNote with parsed params', async () => {
      const note = createNoteResponse({
        deletedAt: '2026-01-02T00:00:00.000Z',
      });

      service.deleteNote.mockResolvedValue(note);

      const result = await controller.deleteNote({ id: 'note_1' });

      expect(service.deleteNote).toHaveBeenCalledWith('note_1');
      expect(result).toEqual(note);
    });
  });

  describe('restoreNote', () => {
    it('calls NotesService.restoreNote with parsed params', async () => {
      const note = createNoteResponse({
        deletedAt: null,
      });

      service.restoreNote.mockResolvedValue(note);

      const result = await controller.restoreNote({ id: 'note_1' });

      expect(service.restoreNote).toHaveBeenCalledWith('note_1');
      expect(result).toEqual(note);
    });
  });

  describe('pinNote', () => {
    it('calls NotesService.pinNote with parsed params', async () => {
      const note = createNoteResponse({
        isPinned: true,
      });

      service.pinNote.mockResolvedValue(note);

      const result = await controller.pinNote({ id: 'note_1' });

      expect(service.pinNote).toHaveBeenCalledWith('note_1');
      expect(result).toEqual(note);
    });
  });

  describe('unpinNote', () => {
    it('calls NotesService.unpinNote with parsed params', async () => {
      const note = createNoteResponse({
        isPinned: false,
      });

      service.unpinNote.mockResolvedValue(note);

      const result = await controller.unpinNote({ id: 'note_1' });

      expect(service.unpinNote).toHaveBeenCalledWith('note_1');
      expect(result).toEqual(note);
    });
  });
});
