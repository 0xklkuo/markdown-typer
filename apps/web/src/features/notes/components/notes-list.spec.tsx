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

  it('renders notes inside a responsive scroll container', () => {
    const { container } = render(
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
          {
            id: 'note_2',
            title: 'Mobile Layout',
            content: 'Check smaller screen spacing',
            isPinned: true,
            createdAt: '2026-01-02T00:00:00.000Z',
            updatedAt: '2026-01-02T00:00:00.000Z',
            deletedAt: null,
          },
        ]}
      />,
    );

    const outerContainer = container.firstElementChild;
    expect(outerContainer).toHaveClass(
      'rounded-xl',
      'border',
      'border-slate-200',
      'bg-white',
      'shadow-sm',
    );

    const scrollContainer = outerContainer?.firstElementChild;
    expect(scrollContainer).toHaveClass(
      'max-h-[calc(100dvh-16rem)]',
      'overflow-y-auto',
      'p-2',
      'sm:max-h-[calc(100dvh-14rem)]',
      'lg:max-h-[calc(100dvh-8rem)]',
    );
  });
});
