import React from 'react';
import { FileCode, Terminal } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Cucaypy</h1>
              <p className="text-xs text-slate-500 font-medium">Project Code Analyzer</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <FileCode className="w-4 h-4" />
            <span>Analysis Mode Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;