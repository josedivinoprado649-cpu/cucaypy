import React from 'react';
import { ProjectFile } from '../types';
import { FileJson, FileCode, FileType } from 'lucide-react';

interface TabSelectorProps {
  files: ProjectFile[];
  activeFile: ProjectFile;
  onSelectFile: (file: ProjectFile) => void;
}

const TabSelector: React.FC<TabSelectorProps> = ({ files, activeFile, onSelectFile }) => {
  const getIcon = (name: string) => {
    if (name.endsWith('.html')) return <FileCode className="w-4 h-4 text-orange-500" />;
    if (name.endsWith('.css')) return <FileType className="w-4 h-4 text-blue-500" />;
    if (name.endsWith('.js') || name.endsWith('.ts')) return <FileJson className="w-4 h-4 text-yellow-500" />;
    return <FileCode className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="flex space-x-1 p-1 overflow-x-auto scrollbar-hide">
      {files.map((file) => (
        <button
          key={file.name}
          onClick={() => onSelectFile(file)}
          className={`
            flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 min-w-fit
            ${activeFile.name === file.name
              ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200'
              : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
            }
          `}
        >
          {getIcon(file.name)}
          {file.name}
        </button>
      ))}
    </div>
  );
};

export default TabSelector;