import { Injectable, NotFoundException } from '@nestjs/common';
import { Note, User } from '@prisma/client';

import { getEnv } from '../config/env';
import { PrismaService } from '../prisma/prisma.service';
import type { NoteResponse } from './notes.types';
import { deriveTitleFromContent } from './notes.utils';

type ListNotesOptions = {
  q?: string;
  includeDeleted?: boolean;
};

type GetNoteOptions = {
  includeDeleted?: boolean;
};

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) { }

  async createNote(content: string): Promise<NoteResponse> {
    const user = await this.getDefaultUser();

    const note = await this.prisma.note.create({
      data: {
        userId: user.id,
        content,
        title: deriveTitleFromContent(content),
      },
    });

    return this.toNoteResponse(note);
  }

  async listNotes(options: ListNotesOptions): Promise<NoteResponse[]> {
    const user = await this.getDefaultUser();
    const query = options.q?.trim();
    const includeDeleted = options.includeDeleted ?? false;

    const notes = await this.prisma.note.findMany({
      where: {
        userId: user.id,
        ...(includeDeleted ? {} : { deletedAt: null }),
        ...(query
          ? {
            OR: [
              {
                title: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                content: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
          }
          : {}),
      },
      orderBy: [{ isPinned: 'desc' }, { updatedAt: 'desc' }],
    });

    return notes.map(this.toNoteResponse);
  }

  async getNoteById(
    id: string,
    options?: GetNoteOptions,
  ): Promise<NoteResponse> {
    const note = await this.requireNote(id, options?.includeDeleted ?? false);

    return this.toNoteResponse(note);
  }

  async updateNote(id: string, content: string): Promise<NoteResponse> {
    const note = await this.requireActiveNote(id);

    const updatedNote = await this.prisma.note.update({
      where: { id: note.id },
      data: {
        content,
        title: deriveTitleFromContent(content),
      },
    });

    return this.toNoteResponse(updatedNote);
  }

  async deleteNote(id: string): Promise<NoteResponse> {
    const note = await this.requireActiveNote(id);

    const deletedNote = await this.prisma.note.update({
      where: { id: note.id },
      data: {
        deletedAt: new Date(),
      },
    });

    return this.toNoteResponse(deletedNote);
  }

  async restoreNote(id: string): Promise<NoteResponse> {
    const note = await this.requireNote(id, true);

    const restoredNote = await this.prisma.note.update({
      where: { id: note.id },
      data: {
        deletedAt: null,
      },
    });

    return this.toNoteResponse(restoredNote);
  }

  async pinNote(id: string): Promise<NoteResponse> {
    return this.updatePinnedState(id, true);
  }

  async unpinNote(id: string): Promise<NoteResponse> {
    return this.updatePinnedState(id, false);
  }

  private async updatePinnedState(
    id: string,
    isPinned: boolean,
  ): Promise<NoteResponse> {
    const note = await this.requireActiveNote(id);

    const updatedNote = await this.prisma.note.update({
      where: { id: note.id },
      data: { isPinned },
    });

    return this.toNoteResponse(updatedNote);
  }

  private async getDefaultUser(): Promise<User> {
    const env = getEnv();

    const user = await this.prisma.user.findUnique({
      where: {
        email: env.DEFAULT_USER_EMAIL,
      },
    });

    if (!user) {
      throw new NotFoundException(
        `Default user with email "${env.DEFAULT_USER_EMAIL}" was not found. Seed the database first.`,
      );
    }

    return user;
  }

  private async requireNote(
    id: string,
    includeDeleted: boolean,
  ): Promise<Note> {
    const user = await this.getDefaultUser();

    const note = await this.prisma.note.findFirst({
      where: {
        id,
        userId: user.id,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
    });

    if (!note) {
      throw new NotFoundException(`Note with id "${id}" was not found.`);
    }

    return note;
  }

  private async requireActiveNote(id: string): Promise<Note> {
    return this.requireNote(id, false);
  }

  private readonly toNoteResponse = (note: Note): NoteResponse => ({
    id: note.id,
    title: note.title,
    content: note.content,
    isPinned: note.isPinned,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
    deletedAt: note.deletedAt?.toISOString() ?? null,
  });
}
