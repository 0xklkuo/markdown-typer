import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PrismaService } from '../prisma/prisma.service';
import { NotesService } from './notes.service';

process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/test';
process.env.DEFAULT_USER_NAME = 'Local User';
process.env.DEFAULT_USER_EMAIL = 'local@example.com';

type MockUser = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

type MockNote = {
  id: string;
  userId: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

type PrismaServiceMock = {
  user: {
    findUnique: ReturnType<typeof vi.fn>;
  };
  note: {
    create: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
};

const createMockUser = (): MockUser => {
  const now = new Date('2026-01-01T00:00:00.000Z');

  return {
    id: 'user_1',
    email: process.env.DEFAULT_USER_EMAIL!,
    name: process.env.DEFAULT_USER_NAME!,
    createdAt: now,
    updatedAt: now,
  };
};

const createMockNote = (overrides?: Partial<MockNote>): MockNote => {
  const now = new Date('2026-01-01T00:00:00.000Z');

  return {
    id: 'note_1',
    userId: 'user_1',
    title: 'Untitled',
    content: '',
    isPinned: false,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    ...overrides,
  };
};

const createPrismaServiceMock = (): PrismaServiceMock => ({
  user: {
    findUnique: vi.fn(),
  },
  note: {
    create: vi.fn(),
    findMany: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
  },
});

describe('NotesService', () => {
  let prisma: PrismaServiceMock;
  let service: NotesService;
  let defaultUser: MockUser;

  beforeEach(() => {
    prisma = createPrismaServiceMock();
    service = new NotesService(prisma as unknown as PrismaService);
    defaultUser = createMockUser();

    prisma.user.findUnique.mockResolvedValue(defaultUser);
  });

  describe('createNote', () => {
    it('creates a note for the default user and derives the title from content', async () => {
      const createdNote = createMockNote({
        title: 'Weekly Planning',
        content: '# Weekly Planning\n- ship MVP',
      });

      prisma.note.create.mockResolvedValue(createdNote);

      const result = await service.createNote('# Weekly Planning\n- ship MVP');

      expect(prisma.note.create).toHaveBeenCalledWith({
        data: {
          userId: defaultUser.id,
          content: '# Weekly Planning\n- ship MVP',
          title: 'Weekly Planning',
        },
      });

      expect(result).toEqual({
        id: createdNote.id,
        title: createdNote.title,
        content: createdNote.content,
        isPinned: createdNote.isPinned,
        createdAt: createdNote.createdAt.toISOString(),
        updatedAt: createdNote.updatedAt.toISOString(),
        deletedAt: null,
      });
    });
  });

  describe('listNotes', () => {
    it('lists notes excluding deleted notes by default', async () => {
      const notes = [
        createMockNote({
          id: 'note_1',
          title: 'Pinned Note',
          isPinned: true,
        }),
      ];

      prisma.note.findMany.mockResolvedValue(notes);

      await service.listNotes({});

      expect(prisma.note.findMany).toHaveBeenCalledWith({
        where: {
          userId: defaultUser.id,
          deletedAt: null,
        },
        orderBy: [{ isPinned: 'desc' }, { updatedAt: 'desc' }],
      });
    });

    it('includes search conditions when a query is provided', async () => {
      prisma.note.findMany.mockResolvedValue([]);

      await service.listNotes({ q: 'weekly' });

      expect(prisma.note.findMany).toHaveBeenCalledWith({
        where: {
          userId: defaultUser.id,
          deletedAt: null,
          OR: [
            {
              title: {
                contains: 'weekly',
                mode: 'insensitive',
              },
            },
            {
              content: {
                contains: 'weekly',
                mode: 'insensitive',
              },
            },
          ],
        },
        orderBy: [{ isPinned: 'desc' }, { updatedAt: 'desc' }],
      });
    });

    it('can include deleted notes when requested', async () => {
      prisma.note.findMany.mockResolvedValue([]);

      await service.listNotes({ includeDeleted: true });

      expect(prisma.note.findMany).toHaveBeenCalledWith({
        where: {
          userId: defaultUser.id,
        },
        orderBy: [{ isPinned: 'desc' }, { updatedAt: 'desc' }],
      });
    });
  });

  describe('getNoteById', () => {
    it('returns a note when found', async () => {
      const note = createMockNote({
        id: 'note_123',
        title: 'Meeting Notes',
      });

      prisma.note.findFirst.mockResolvedValue(note);

      const result = await service.getNoteById('note_123');

      expect(prisma.note.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'note_123',
          userId: defaultUser.id,
          deletedAt: null,
        },
      });

      expect(result.title).toBe('Meeting Notes');
    });

    it('throws NotFoundException when the note does not exist', async () => {
      prisma.note.findFirst.mockResolvedValue(null);

      await expect(service.getNoteById('missing_note')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('can return a deleted note when includeDeleted is true', async () => {
      const note = createMockNote({
        id: 'note_deleted',
        title: 'Deleted Note',
        deletedAt: new Date('2026-01-03T00:00:00.000Z'),
      });

      prisma.note.findFirst.mockResolvedValue(note);

      const result = await service.getNoteById('note_deleted', {
        includeDeleted: true,
      });

      expect(prisma.note.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'note_deleted',
          userId: defaultUser.id,
        },
      });

      expect(result.deletedAt).toBe(note.deletedAt?.toISOString() ?? null);
    });
  });

  describe('updateNote', () => {
    it('updates content and recomputes the title', async () => {
      const existingNote = createMockNote({
        id: 'note_1',
        title: 'Old Title',
        content: 'Old content',
      });

      const updatedNote = createMockNote({
        id: 'note_1',
        title: 'New Title',
        content: '# New Title\nUpdated content',
      });

      prisma.note.findFirst.mockResolvedValue(existingNote);
      prisma.note.update.mockResolvedValue(updatedNote);

      const result = await service.updateNote(
        'note_1',
        '# New Title\nUpdated content',
      );

      expect(prisma.note.update).toHaveBeenCalledWith({
        where: { id: 'note_1' },
        data: {
          content: '# New Title\nUpdated content',
          title: 'New Title',
        },
      });

      expect(result.title).toBe('New Title');
    });
  });

  describe('deleteNote', () => {
    it('soft deletes a note by setting deletedAt', async () => {
      const existingNote = createMockNote({
        id: 'note_1',
      });

      const deletedAt = new Date('2026-01-02T00:00:00.000Z');
      const deletedNote = createMockNote({
        id: 'note_1',
        deletedAt,
      });

      prisma.note.findFirst.mockResolvedValue(existingNote);
      prisma.note.update.mockResolvedValue(deletedNote);

      const result = await service.deleteNote('note_1');

      expect(prisma.note.update).toHaveBeenCalledWith({
        where: { id: 'note_1' },
        data: {
          deletedAt: expect.any(Date),
        },
      });

      expect(result.deletedAt).toBe(deletedAt.toISOString());
    });
  });

  describe('restoreNote', () => {
    it('restores a deleted note by setting deletedAt to null', async () => {
      const deletedNote = createMockNote({
        id: 'note_1',
        deletedAt: new Date('2026-01-02T00:00:00.000Z'),
      });

      const restoredNote = createMockNote({
        id: 'note_1',
        deletedAt: null,
      });

      prisma.note.findFirst.mockResolvedValue(deletedNote);
      prisma.note.update.mockResolvedValue(restoredNote);

      const result = await service.restoreNote('note_1');

      expect(prisma.note.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'note_1',
          userId: defaultUser.id,
        },
      });

      expect(prisma.note.update).toHaveBeenCalledWith({
        where: { id: 'note_1' },
        data: {
          deletedAt: null,
        },
      });

      expect(result.deletedAt).toBeNull();
    });
  });

  describe('pinNote', () => {
    it('pins a note', async () => {
      const existingNote = createMockNote({
        id: 'note_1',
        isPinned: false,
      });

      const pinnedNote = createMockNote({
        id: 'note_1',
        isPinned: true,
      });

      prisma.note.findFirst.mockResolvedValue(existingNote);
      prisma.note.update.mockResolvedValue(pinnedNote);

      const result = await service.pinNote('note_1');

      expect(prisma.note.update).toHaveBeenCalledWith({
        where: { id: 'note_1' },
        data: { isPinned: true },
      });

      expect(result.isPinned).toBe(true);
    });
  });

  describe('unpinNote', () => {
    it('unpins a note', async () => {
      const existingNote = createMockNote({
        id: 'note_1',
        isPinned: true,
      });

      const unpinnedNote = createMockNote({
        id: 'note_1',
        isPinned: false,
      });

      prisma.note.findFirst.mockResolvedValue(existingNote);
      prisma.note.update.mockResolvedValue(unpinnedNote);

      const result = await service.unpinNote('note_1');

      expect(prisma.note.update).toHaveBeenCalledWith({
        where: { id: 'note_1' },
        data: { isPinned: false },
      });

      expect(result.isPinned).toBe(false);
    });
  });

  describe('default user lookup', () => {
    it('throws NotFoundException when the default user is missing', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.createNote('hello')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
