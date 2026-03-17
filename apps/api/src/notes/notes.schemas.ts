import { z } from 'zod';

export const createNoteSchema = z.object({
  content: z
    .string()
    .max(100_000, {
      error: 'Note content must be 100000 characters or fewer.',
    })
    .default(''),
});

export const updateNoteSchema = z.object({
  content: z.string().max(100_000, {
    error: 'Note content must be 100000 characters or fewer.',
  }),
});

export const noteIdParamSchema = z.object({
  id: z.string().trim().min(1, {
    error: 'Note id is required.',
  }),
});

export const listNotesQuerySchema = z.object({
  q: z.string().trim().optional(),
  includeDeleted: z
    .union([z.literal('true'), z.literal('false')])
    .optional()
    .transform((value) => value === 'true'),
});

export type CreateNoteInput = z.input<typeof createNoteSchema>;
export type CreateNoteData = z.output<typeof createNoteSchema>;

export type UpdateNoteInput = z.input<typeof updateNoteSchema>;
export type UpdateNoteData = z.output<typeof updateNoteSchema>;

export type NoteIdParamsInput = z.input<typeof noteIdParamSchema>;
export type NoteIdParams = z.output<typeof noteIdParamSchema>;

export type ListNotesQueryInput = z.input<typeof listNotesQuerySchema>;
export type ListNotesQuery = z.output<typeof listNotesQuerySchema>;
