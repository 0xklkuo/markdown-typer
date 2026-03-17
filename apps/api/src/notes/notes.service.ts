import { Injectable, NotFoundException } from '@nestjs/common';
import { Note, User } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { env } from '../config/env';
import { deriveTitleFromContent } from './notes.utils';
import { NoteResponse } from './notes.types';

type ListNotesOptions = {
  q?: string;
  includeDeleted?: boolean;
};

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) { }

  async createNote(content: string): Promise<NoteResponse> {
    const user = await this.getDefaultUser();
    const title = deriveTitleFromContent(content);

    const note = await this.prisma.note.create({
      data: {
        userId: user.id,
        content,
        title,
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
      orderBy: [
        { isPinned: 'desc' },
        { updatedAt: 'desc' },
      ],
    });

    return notes.map((note) => this.toNoteResponse(note));
  }

  async getNoteById(id: string): Promise<NoteResponse> {
    const user = await this.getDefaultUser();

    const note = await this.prisma.note.findFirst({
      where: {
        id,
        userId: user.id,
        deletedAt: null,
      },
    });

    if (!note) {
      throw new NotFoundException(`Note with id "${id}" was not found.`);
    }

    return this.toNoteResponse(note);
  }

  async updateNote(id: string, content: string): Promise<NoteResponse> {
    const note = await this.requireActiveNote(id);
    const title = deriveTitleFromContent(content);

    const updatedNote = await this.prisma.note.update({
      where: { id: note.id },
      data: {
        content,
        title,
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

  async pinNote(id: string): Promise<NoteResponse> {
    const note = await this.requireActiveNote(id);

    const pinnedNote = await this.prisma.note.update({
      where: { id: note.id },
      data: {
        isPinned: true,
      },
    });

    return this.toNoteResponse(pinnedNote);
  }

  async unpinNote(id: string): Promise<NoteResponse> {
    const note = await this.requireActiveNote(id);

    const unpinnedNote = await this.prisma.note.update({
      where: { id: note.id },
      data: {
        isPinned: false,
      },
    });

    return this.toNoteResponse(unpinnedNote);
  }

  private async getDefaultUser(): Promise<User> {
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

  private async requireActiveNote(id: string): Promise<Note> {
    const user = await this.getDefaultUser();

    const note = await this.prisma.note.findFirst({
      where: {
        id,
        userId: user.id,
        deletedAt: null,
      },
    });

    if (!note) {
      throw new NotFoundException(`Note with id "${id}" was not found.`);
    }

    return note;
  }

  private toNoteResponse(note: Note): NoteResponse {
    return {
      id: note.id,
      title: note.title,
      content: note.content,
      isPinned: note.isPinned,
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString(),
      deletedAt: note.deletedAt?.toISOString() ?? null,
    };
  }
}
