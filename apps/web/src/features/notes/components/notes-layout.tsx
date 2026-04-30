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
    <main className="min-h-dvh bg-slate-50">
      <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6 lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-6">
        <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
          {sidebar}
        </aside>

        <section className="min-w-0 lg:min-h-[calc(100dvh-3rem)]">
          {content}
        </section>
      </div>
    </main>
  );
};
