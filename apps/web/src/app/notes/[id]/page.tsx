import { notFound } from 'next/navigation';

import { getNoteById, listNotes } from '@/features/notes/api/notes-api';
import { SelectedNoteWorkspace } from '@/features/notes/components/selected-note-workspace';

type NotePageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    q?: string;
  }>;
};

const NotePage = async ({
  params,
  searchParams,
}: NotePageProps): Promise<React.ReactElement> => {
  const { id } = await params;
  const { q } = await searchParams;

  try {
    const [notes, note] = await Promise.all([listNotes({ q }), getNoteById(id)]);

    return (
      <SelectedNoteWorkspace
        initialNotes={notes}
        initialNote={note}
        searchQuery={q}
      />
    );
  } catch {
    notFound();
  }
};

export default NotePage;
