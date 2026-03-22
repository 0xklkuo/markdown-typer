import type { ReactElement, ReactNode } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { NotesList } from './notes-list';

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    className,
  }: {
    children: ReactNode;
    href: string | { pathname: string; query?: Record<string, string> };
    className?: string;
  }): ReactElement => {
    const resolvedHref =
      typeof href === 'string'
        ? href
        : `${href.pathname}${
            href.query ? `?${new URLSearchParams(href.query).toString()}` : ''
          }`;

    return (
      <a href={resolvedHref} className={className}>
        {children}
      </a>
    );
  },
}));

describe('NotesList', () => {
  it('renders notes', () => {
    render(
      <NotesList
        notes={[
          {
            id: 'note_1',
            title: 'Weekly Planning',
            content: '# Weekly Planning\n- ship MVP',
            isPinned: false,
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z',
            deletedAt: null,
          },
        ]}
      />,
    );

    expect(screen.getByText('Weekly Planning')).toBeInTheDocument();
    expect(
      screen.getByText('# Weekly Planning - ship MVP'),
    ).toBeInTheDocument();
  });

  it('renders empty state when there are no notes', () => {
    render(<NotesList notes={[]} />);

    expect(screen.getByText('No notes yet.')).toBeInTheDocument();
  });
});
