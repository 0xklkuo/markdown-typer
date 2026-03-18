const MARKDOWN_HEADING_PREFIX = /^(#{1,6})\s+/;
const MAX_TITLE_LENGTH = 120;

const normalizeTitleLine = (line: string): string =>
  line.replace(MARKDOWN_HEADING_PREFIX, '').trim();

export const deriveTitleFromContent = (content: string): string => {
  const lines = content.split('\n');

  for (const rawLine of lines) {
    const trimmedLine = rawLine.trim();

    if (!trimmedLine) {
      continue;
    }

    const normalizedLine = normalizeTitleLine(trimmedLine);

    if (normalizedLine) {
      return normalizedLine.slice(0, MAX_TITLE_LENGTH);
    }
  }

  return 'Untitled';
};
