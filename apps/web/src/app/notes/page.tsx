import { listNotes } from '@/features/notes/api/notes-api';
import { NotesPageShell } from '@/features/notes/components/notes-page-shell';

type NotesPageProps = {
  searchParams: Promise<{
    q?: string;
    includeDeleted?: string;
  }>;
};

const NotesPage = async ({
  searchParams,
}: NotesPageProps): Promise<React.ReactElement> => {
  const { q, includeDeleted } = await searchParams;
  const shouldIncludeDeleted = includeDeleted === 'true';
  const notes = await listNotes({
    q,
    includeDeleted: shouldIncludeDeleted,
  });

  return (
    <NotesPageShell
      notes={notes}
      searchQuery={q}
      includeDeleted={shouldIncludeDeleted}
      content={
        <div className="flex min-h-[calc(100dvh-2rem)] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 shadow-sm sm:p-8 lg:min-h-[calc(100dvh-3rem)]">
          Select a note from the list or create a new one.
        </div>
      }
    />
  );
};

export default NotesPage;
