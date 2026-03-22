import { z } from 'zod';

const noteContentSchema = z.string().max(100_000, {
  error: 'Note content must be 100000 characters or fewer.',
});

const booleanQuerySchema = z
  .union([z.literal('true'), z.literal('false')])
  .optional()
  .transform((value) => value === 'true');

export const createNoteSchema = z.object({
  content: noteContentSchema.default(''),
});

export const updateNoteSchema = z.object({
  content: noteContentSchema,
});

export const noteIdParamSchema = z.object({
  id: z.string().trim().min(1, {
    error: 'Note id is required.',
  }),
});

export const noteVisibilityQuerySchema = z.object({
  includeDeleted: booleanQuerySchema,
});

export const listNotesQuerySchema = z.object({
  q: z.string().trim().optional(),
  includeDeleted: booleanQuerySchema,
});

export type CreateNoteInput = z.input<typeof createNoteSchema>;
export type CreateNoteData = z.output<typeof createNoteSchema>;

export type UpdateNoteInput = z.input<typeof updateNoteSchema>;
export type UpdateNoteData = z.output<typeof updateNoteSchema>;

export type NoteIdParamsInput = z.input<typeof noteIdParamSchema>;
export type NoteIdParams = z.output<typeof noteIdParamSchema>;

export type NoteVisibilityQueryInput = z.input<typeof noteVisibilityQuerySchema>;
export type NoteVisibilityQuery = z.output<typeof noteVisibilityQuerySchema>;

export type ListNotesQueryInput = z.input<typeof listNotesQuerySchema>;
export type ListNotesQuery = z.output<typeof listNotesQuerySchema>;
