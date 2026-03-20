import { listNotes } from '@/features/notes/api/notes-api';
import { NotesPageShell } from '@/features/notes/components/notes-page-shell';

type NotesPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

const NotesPage = async ({
  searchParams,
}: NotesPageProps): Promise<React.ReactElement> => {
  const { q } = await searchParams;
  const notes = await listNotes({ q });

  return (
    <NotesPageShell
      notes={notes}
      searchQuery={q}
      content={
        <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
          Select a note from the list or create a new one.
        </div>
      }
    />
  );
};

export default NotesPage;
