import { describe, expect, it } from 'vitest';

import { deriveTitleFromContent } from './notes.utils';

describe('deriveTitleFromContent', () => {
  it('returns the first non-empty line as the title', () => {
    const content = '\n\nWeekly Planning\n- ship MVP';

    const result = deriveTitleFromContent(content);

    expect(result).toBe('Weekly Planning');
  });

  it('strips markdown heading prefixes from the title line', () => {
    const content = '# Weekly Planning\n- ship MVP';

    const result = deriveTitleFromContent(content);

    expect(result).toBe('Weekly Planning');
  });

  it('uses the first meaningful line even if earlier lines are blank', () => {
    const content = '\n   \n## Sprint Review\nSummary';

    const result = deriveTitleFromContent(content);

    expect(result).toBe('Sprint Review');
  });

  it('returns Untitled for empty content', () => {
    const content = '';

    const result = deriveTitleFromContent(content);

    expect(result).toBe('Untitled');
  });

  it('returns Untitled for whitespace-only content', () => {
    const content = '\n   \n\t';

    const result = deriveTitleFromContent(content);

    expect(result).toBe('Untitled');
  });

  it('truncates long titles to the maximum supported length', () => {
    const longLine = 'A'.repeat(200);

    const result = deriveTitleFromContent(longLine);

    expect(result).toHaveLength(120);
    expect(result).toBe('A'.repeat(120));
  });
});
