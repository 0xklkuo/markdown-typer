import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NotesSearchForm } from './notes-search-form';

const replaceMock = vi.fn();
const searchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  usePathname: (): string => '/notes',
  useRouter: (): { replace: typeof replaceMock } => ({
    replace: replaceMock,
  }),
  useSearchParams: (): URLSearchParams => searchParams,
}));

describe('NotesSearchForm', () => {
  beforeEach(() => {
    replaceMock.mockReset();
    searchParams.delete('q');
    searchParams.delete('includeDeleted');
  });

  it('renders search input and deleted toggle', () => {
    render(<NotesSearchForm />);

    expect(screen.getByPlaceholderText('Search notes...')).toBeInTheDocument();
    expect(screen.getByLabelText('Show deleted')).toBeInTheDocument();
  });

  it('allows typing into the search input', async () => {
    const user = userEvent.setup();

    render(<NotesSearchForm />);

    const input = screen.getByPlaceholderText('Search notes...');

    await user.type(input, 'weekly');

    expect(input).toHaveValue('weekly');
  });
});
