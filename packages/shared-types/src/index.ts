export type Note = {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ListNotesQuery = {
  q?: string;
  includeDeleted?: boolean;
};

export type GetNoteByIdOptions = {
  includeDeleted?: boolean;
};

export type NoteInput = {
  content: string;
};
