import { Note } from '../types/note';

type NoteDetailProps = {
  note: Note;
};

export const NoteDetail = ({
  note,
}: NoteDetailProps): React.ReactElement => {
  return (
    <section className="flex min-h-[400px] flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="border-b border-slate-200 pb-4">
        <h2 className="text-lg font-semibold text-slate-900">{note.title}</h2>
        <p className="mt-1 text-xs text-slate-500">
          Updated {new Date(note.updatedAt).toLocaleString()}
        </p>
      </header>

      <div className="mt-4 flex-1">
        <pre className="whitespace-pre-wrap break-words font-sans text-sm text-slate-800">
          {note.content || 'This note is empty.'}
        </pre>
      </div>
    </section>
  );
};
