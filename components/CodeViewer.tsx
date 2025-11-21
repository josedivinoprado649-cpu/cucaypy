import React from 'react';
import { ProjectFile } from '../types';

interface CodeViewerProps {
  file: ProjectFile;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ file }) => {
  const lines = file.content.split('\n');

  return (
    <div className="bg-slate-900 text-slate-300 font-mono text-sm overflow-hidden shadow-inner h-full flex flex-col">
      <div className="flex-1 overflow-auto custom-scrollbar">
        <div className="min-w-fit">
            {lines.map((line, index) => (
            <div key={index} className="flex hover:bg-slate-800/50 group">
                <div className="w-12 shrink-0 text-right pr-4 text-slate-600 select-none bg-slate-900/50 border-r border-slate-800 py-0.5 group-hover:text-slate-500">
                {index + 1}
                </div>
                <div className="pl-4 py-0.5 whitespace-pre text-slate-200">
                {line || ' '}
                </div>
            </div>
            ))}
        </div>
      </div>
      <div className="bg-slate-950 text-xs text-slate-500 px-4 py-2 border-t border-slate-800 flex justify-between items-center shrink-0">
        <span>{lines.length} lines</span>
        <span className="uppercase">{file.language}</span>
      </div>
    </div>
  );
};

export default CodeViewer;