import { notFound } from 'next/navigation';

import { getNoteById, listNotes } from '@/features/notes/api/notes-api';
import { NoteDetail } from '@/features/notes/components/note-detail';
import { NotesPageShell } from '@/features/notes/components/notes-page-shell';

type NotePageProps = {
  params: Promise<{
    id: string;
  }>;
};

const NotePage = async ({
  params,
}: NotePageProps): Promise<React.ReactElement> => {
  const { id } = await params;

  try {
    const [notes, note] = await Promise.all([listNotes(), getNoteById(id)]);

    return (
      <NotesPageShell
        notes={notes}
        selectedNoteId={note.id}
        content={<NoteDetail note={note} />}
      />
    );
  } catch {
    notFound();
  }
};

export default NotePage;
