'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownPreviewProps = {
  content: string;
};

export const MarkdownPreview = ({
  content,
}: MarkdownPreviewProps): React.ReactElement => {
  if (!content.trim()) {
    return (
      <div className="text-sm text-slate-500">Nothing to preview yet.</div>
    );
  }

  return (
    <div className="markdown-preview">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
};
