import { notFound } from 'next/navigation';

import { getNoteById, listNotes } from '@/features/notes/api/notes-api';
import { SelectedNoteWorkspace } from '@/features/notes/components/selected-note-workspace';

type NotePageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    q?: string;
    includeDeleted?: string;
  }>;
};

const NotePage = async ({
  params,
  searchParams,
}: NotePageProps): Promise<React.ReactElement> => {
  const { id } = await params;
  const { q, includeDeleted } = await searchParams;
  const shouldIncludeDeleted = includeDeleted === 'true';

  try {
    const [notes, note] = await Promise.all([
      listNotes({
        q,
        includeDeleted: shouldIncludeDeleted,
      }),
      getNoteById(id, {
        includeDeleted: shouldIncludeDeleted,
      }),
    ]);

    return (
      <SelectedNoteWorkspace
        initialNotes={notes}
        initialNote={note}
        searchQuery={q}
        includeDeleted={shouldIncludeDeleted}
      />
    );
  } catch {
    notFound();
  }
};

export default NotePage;
