'use client';

import { useEffect } from 'react';

type UseKeyboardShortcutOptions = {
  key: string;
  handler: () => void;
  enabled?: boolean;
  modKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  preventDefault?: boolean;
  allowRepeat?: boolean;
  allowInEditable?: boolean;
};

const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  const editableTagNames = ['input', 'textarea', 'select'];
  const tagName = target.tagName.toLowerCase();

  return editableTagNames.includes(tagName);
};

export const useKeyboardShortcut = ({
  key,
  handler,
  enabled = true,
  modKey = false,
  shiftKey = false,
  altKey = false,
  preventDefault = false,
  allowRepeat = false,
  allowInEditable = false,
}: UseKeyboardShortcutOptions): void => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const normalizedKey = key.toLowerCase();

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.defaultPrevented) {
        return;
      }

      if (!allowRepeat && event.repeat) {
        return;
      }

      if (!allowInEditable && isEditableTarget(event.target)) {
        return;
      }

      const pressedKey = event.key.toLowerCase();
      const pressedModKey = event.metaKey || event.ctrlKey;

      if (pressedKey !== normalizedKey) {
        return;
      }

      if (pressedModKey !== modKey) {
        return;
      }

      if (event.shiftKey !== shiftKey) {
        return;
      }

      if (event.altKey !== altKey) {
        return;
      }

      if (preventDefault) {
        event.preventDefault();
      }

      handler();
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [
    allowInEditable,
    allowRepeat,
    altKey,
    enabled,
    handler,
    key,
    modKey,
    preventDefault,
    shiftKey,
  ]);
};
