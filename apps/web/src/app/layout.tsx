import '@/styles/globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Markdown Typer',
  description: 'A minimal markdown note-taking app',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProps): React.ReactElement {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
