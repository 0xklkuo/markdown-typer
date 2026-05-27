import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import type { Note as NoteDto } from '@markdown-typer/shared-types';

import { parseWithZod } from '../common/zod';
import {
  createNoteSchema,
  listNotesQuerySchema,
  noteIdParamSchema,
  noteVisibilityQuerySchema,
  updateNoteSchema,
} from './notes.schemas';
import type {
  CreateNoteInput,
  ListNotesQueryInput,
  NoteIdParamsInput,
  NoteVisibilityQueryInput,
  UpdateNoteInput,
} from './notes.schemas';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async createNote(@Body() body: CreateNoteInput): Promise<NoteDto> {
    const parsedBody = parseWithZod(createNoteSchema, body);

    return this.notesService.createNote(parsedBody.content);
  }

  @Get()
  async listNotes(@Query() query: ListNotesQueryInput): Promise<NoteDto[]> {
    const parsedQuery = parseWithZod(listNotesQuerySchema, query);

    return this.notesService.listNotes({
      q: parsedQuery.q,
      includeDeleted: parsedQuery.includeDeleted ?? false,
    });
  }

  @Get(':id')
  async getNoteById(
    @Param() params: NoteIdParamsInput,
    @Query() query: NoteVisibilityQueryInput,
  ): Promise<NoteDto> {
    const parsedParams = parseWithZod(noteIdParamSchema, params);
    const parsedQuery = parseWithZod(noteVisibilityQuerySchema, query);

    return this.notesService.getNoteById(parsedParams.id, {
      includeDeleted: parsedQuery.includeDeleted ?? false,
    });
  }

  @Patch(':id')
  async updateNote(
    @Param() params: NoteIdParamsInput,
    @Body() body: UpdateNoteInput,
  ): Promise<NoteDto> {
    const parsedParams = parseWithZod(noteIdParamSchema, params);
    const parsedBody = parseWithZod(updateNoteSchema, body);

    return this.notesService.updateNote(parsedParams.id, parsedBody.content);
  }

  @Delete(':id')
  async deleteNote(@Param() params: NoteIdParamsInput): Promise<NoteDto> {
    const parsedParams = parseWithZod(noteIdParamSchema, params);

    return this.notesService.deleteNote(parsedParams.id);
  }

  @Post(':id/restore')
  async restoreNote(@Param() params: NoteIdParamsInput): Promise<NoteDto> {
    const parsedParams = parseWithZod(noteIdParamSchema, params);

    return this.notesService.restoreNote(parsedParams.id);
  }

  @Post(':id/pin')
  async pinNote(@Param() params: NoteIdParamsInput): Promise<NoteDto> {
    const parsedParams = parseWithZod(noteIdParamSchema, params);

    return this.notesService.pinNote(parsedParams.id);
  }

  @Post(':id/unpin')
  async unpinNote(@Param() params: NoteIdParamsInput): Promise<NoteDto> {
    const parsedParams = parseWithZod(noteIdParamSchema, params);

    return this.notesService.unpinNote(parsedParams.id);
  }
}
