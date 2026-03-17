export type NoteResponse = {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
