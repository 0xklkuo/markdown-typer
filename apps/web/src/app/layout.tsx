import type { ReactNode } from 'react';

import '@/styles/globals.css';

export const metadata = {
  title: 'Markdown Typer',
  description: 'A minimal markdown note-taking app',
};

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps): React.ReactElement => {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
