const MARKDOWN_HEADING_PREFIX = /^(#{1,6})\s+/;
const MARKDOWN_HEADING_LENGTH = 120;

function normalizeTitleLine(line: string): string {
  return line.replace(MARKDOWN_HEADING_PREFIX, '').trim();
}

export function deriveTitleFromContent(content: string): string {
  const lines = content.split('\n');

  for (const rawLine of lines) {
    const trimmedLine = rawLine.trim();

    if (!trimmedLine) {
      continue;
    }

    const normalizedLine = normalizeTitleLine(trimmedLine);

    if (normalizedLine) {
      return normalizedLine.slice(0, MARKDOWN_HEADING_LENGTH);
    }
  }

  return 'Untitled';
}
