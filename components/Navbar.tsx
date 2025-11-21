import React from 'react';
import { Terminal, Github, Book, Bell, User } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <>
        <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 sticky top-0 z-30"></div>
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-1 z-20 support-backdrop-blur:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
                {/* Logo */}
                <div className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl blur opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
                    <div className="relative bg-white p-2 rounded-xl border border-slate-100">
                        <Terminal className="w-5 h-5 text-indigo-600" />
                    </div>
                </div>
                <div>
                    <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 leading-none">Cucaypy</h1>
                    <span className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider">AI Studio</span>
                </div>
                </div>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-1">
                <a href="#" className="px-3 py-2 text-sm font-medium text-slate-900 bg-slate-50/50 rounded-lg transition-all hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100">Workspace</a>
                <a href="#" className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-indigo-600 rounded-lg transition-colors">Docs</a>
                <a href="#" className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-indigo-600 rounded-lg transition-colors">API</a>
                </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
                <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all relative group">
                    <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                
                <div className="h-6 w-px bg-slate-200 mx-1"></div>

                <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-sm">
                        <User className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-xs font-semibold text-slate-700">Jose Divino</span>
                        <span className="text-[10px] text-slate-500">Pro Plan</span>
                    </div>
                </button>
            </div>
            </div>
        </div>
        </nav>
    </>
  );
};

export default Navbar;