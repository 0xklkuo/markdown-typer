import { ReactNode } from 'react';

type NotesLayoutProps = {
  sidebar: ReactNode;
  content: ReactNode;
};

export const NotesLayout = ({
  sidebar,
  content,
}: NotesLayoutProps): React.ReactElement => {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside>{sidebar}</aside>
        <section>{content}</section>
      </div>
    </main>
  );
};
