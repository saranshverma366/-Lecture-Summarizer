import React, { useState } from 'react';
import { Download, Copy, Check, FileText, Printer } from 'lucide-react';

interface FullMarkdownViewProps {
  markdown: string;
  lectureTitle: string;
}

export const FullMarkdownView: React.FC<FullMarkdownViewProps> = ({ markdown, lectureTitle }) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `${lectureTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'lecture_revision'}_study_kit.md`;
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-bold text-zinc-100">
              Complete 10-Section Markdown Study Kit
            </h3>
            <p className="text-xs text-zinc-400">
              Export-ready formatted notes complying strictly with sections 1 through 10.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle between rendered preview and raw text */}
          <div className="flex rounded-lg bg-zinc-800 p-0.5 border border-zinc-700">
            <button
              onClick={() => setViewMode('formatted')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'formatted' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Formatted
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'raw' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Raw Markdown
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .md</span>
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 overflow-x-auto shadow-inner">
        {viewMode === 'raw' ? (
          <pre className="text-xs sm:text-sm font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed select-all">
            {markdown}
          </pre>
        ) : (
          <div className="prose prose-invert max-w-none text-sm text-zinc-300 space-y-4">
            {/* Split markdown by main headers for clean display */}
            {markdown.split(/(?=# \d+\. )/g).map((section, idx) => {
              const lines = section.trim().split('\n');
              const header = lines[0] || '';
              const rest = lines.slice(1).join('\n');

              return (
                <div key={idx} className="pb-4 border-b border-zinc-800 last:border-b-0">
                  <h2 className="text-base sm:text-lg font-bold text-zinc-100 mb-2 text-indigo-300">
                    {header.replace(/^#\s*/, '')}
                  </h2>
                  <div className="text-zinc-300 whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">
                    {rest}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
