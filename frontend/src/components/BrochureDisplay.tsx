'use client';

import ReactMarkdown from 'react-markdown';

interface BrochureDisplayProps {
  content: string;
}

export default function BrochureDisplay({ content }: BrochureDisplayProps) {
  return (
    <div className="prose prose-sm sm:prose max-w-none">
      <article className="text-gray-800">
        <MarkdownContent content={content} />
      </article>
    </div>
  );
}

function MarkdownContent({ content }: { content: string }) {
  // Simple markdown rendering
  const lines = content.split('\n');
  
  return (
    <div className="space-y-4">
      {lines.map((line, idx) => {
        if (line.startsWith('# ')) {
          return <h1 key={idx} className="text-3xl font-bold mt-6 mb-3">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={idx} className="text-2xl font-bold mt-5 mb-2">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={idx} className="text-xl font-bold mt-4 mb-2">{line.slice(4)}</h3>;
        }
        if (line.startsWith('- ')) {
          return <li key={idx} className="ml-5 list-disc">{line.slice(2)}</li>;
        }
        if (line.startsWith('* ')) {
          return <li key={idx} className="ml-5 list-disc">{line.slice(2)}</li>;
        }
        if (line.trim() === '') {
          return <div key={idx} className="h-2"></div>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={idx} className="font-bold text-lg">{line.slice(2, -2)}</p>;
        }
        return <p key={idx} className="leading-relaxed">{line}</p>;
      })}
    </div>
  );
}
