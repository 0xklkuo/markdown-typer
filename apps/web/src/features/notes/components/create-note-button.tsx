'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type CreateNoteButtonProps = {
  createNoteAction: () => Promise<{ id: string }>;
};

export const CreateNoteButton = ({
  createNoteAction,
}: CreateNoteButtonProps): React.ReactElement => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleClick = async (): Promise<void> => {
    if (isCreating) {
      return;
    }

    try {
      setIsCreating(true);
      const note = await createNoteAction();
      router.push(`/notes/${note.id}`);
      router.refresh();
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isCreating}
      className="inline-flex items-center rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isCreating ? 'Creating...' : 'New Note'}
    </button>
  );
};
