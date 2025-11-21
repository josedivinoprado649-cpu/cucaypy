import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import TabSelector from './components/TabSelector';
import CodeViewer from './components/CodeViewer';
import AnalysisPanel from './components/AnalysisPanel';
import PreviewFrame from './components/PreviewFrame';
import { INITIAL_FILES } from './constants';
import { ProjectFile, AnalysisStatus, ChatMessage } from './types';
import { analyzeCode, modifyCode } from './services/geminiService';
import { Code, Play, Layers, MonitorPlay } from 'lucide-react';

const App: React.FC = () => {
  const [files, setFiles] = useState<ProjectFile[]>(INITIAL_FILES);
  const [activeFileName, setActiveFileName] = useState<string>(INITIAL_FILES[0].name);
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('code');
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [analysisCache, setAnalysisCache] = useState<Record<string, string>>({});
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Derive active file from state
  const activeFile = files.find(f => f.name === activeFileName) || files[0];

  const handleFileSelect = (file: ProjectFile) => {
    setActiveFileName(file.name);
    if (analysisCache[file.name]) {
        setAnalysisStatus(AnalysisStatus.SUCCESS);
    } else {
        setAnalysisStatus(AnalysisStatus.IDLE);
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (analysisCache[activeFile.name]) {
        setAnalysisStatus(AnalysisStatus.SUCCESS);
        return;
    }

    setAnalysisStatus(AnalysisStatus.LOADING);
    try {
      const result = await analyzeCode(activeFile.name, activeFile.content);
      setAnalysisCache(prev => ({ ...prev, [activeFile.name]: result }));
      setAnalysisStatus(AnalysisStatus.SUCCESS);
    } catch (error) {
      setAnalysisStatus(AnalysisStatus.ERROR);
    }
  }, [activeFile, analysisCache]);

  const handleModifyCode = useCallback(async (instructions: string, image?: string) => {
    setAnalysisStatus(AnalysisStatus.LOADING);
    
    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: instructions || (image ? "Generated code from image" : ""),
        image: image,
        timestamp: Date.now()
    };
    setChatMessages(prev => [...prev, userMsg]);

    try {
        const newContent = await modifyCode(activeFile.name, activeFile.content, instructions, image);
        
        setFiles(prevFiles => 
            prevFiles.map(f => 
                f.name === activeFile.name 
                ? { ...f, content: newContent }
                : f
            )
        );

        setAnalysisCache(prev => {
            const newCache = { ...prev };
            delete newCache[activeFile.name];
            return newCache;
        });

        const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `I've updated ${activeFile.name}. Check the Preview tab!`,
            timestamp: Date.now()
        };
        setChatMessages(prev => [...prev, aiMsg]);

        setAnalysisStatus(AnalysisStatus.IDLE);
        
    } catch (error) {
        console.error(error);
        setAnalysisStatus(AnalysisStatus.ERROR);
        
        const errorMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `I encountered an error while trying to update the code. Please try again.`,
            timestamp: Date.now()
        };
        setChatMessages(prev => [...prev, errorMsg]);
    }
  }, [activeFile]);

  const currentAnalysis = analysisCache[activeFile.name] || null;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] relative overflow-x-hidden">
      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/30 blur-[100px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-[100px]"></div>
         <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] rounded-full bg-indigo-100/40 blur-[80px]"></div>
      </div>

      <Navbar />
      
      <main className="relative z-10 flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-200">
                    <Layers className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Workspace</h2>
                    <p className="text-slate-500 text-sm">AI-Powered Development Environment</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Editor/Preview (Span 8) */}
          <div className="lg:col-span-8 flex flex-col h-[700px] shadow-xl shadow-slate-200/50 rounded-xl border border-white/50 overflow-hidden ring-1 ring-slate-900/5 bg-white">
            
            {/* Panel Header Toolbar */}
            <div className="flex items-center justify-between bg-slate-100/80 backdrop-blur border-b border-slate-200 px-2 py-1.5 shrink-0">
                
                {/* Left Side: Tabs or Title */}
                <div className="flex-1 overflow-x-auto scrollbar-hide">
                    {viewMode === 'code' ? (
                        <TabSelector 
                            files={files} 
                            activeFile={activeFile} 
                            onSelectFile={handleFileSelect} 
                        />
                    ) : (
                        <div className="px-3 py-2 text-sm font-bold text-slate-600 flex items-center gap-2">
                             <div className="flex gap-1.5 mr-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400/50"></div>
                             </div>
                             <MonitorPlay className="w-4 h-4 text-indigo-500" />
                             Live Application
                        </div>
                    )}
                </div>

                {/* Right Side: View Toggle */}
                <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm gap-1 ml-2">
                    <button
                        onClick={() => setViewMode('code')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                            viewMode === 'code' 
                            ? 'bg-slate-800 text-white shadow-sm' 
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                        <Code className="w-3.5 h-3.5" />
                        Editor
                    </button>
                    <button
                        onClick={() => setViewMode('preview')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                            viewMode === 'preview' 
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm' 
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                        <Play className="w-3.5 h-3.5" />
                        Preview
                    </button>
                </div>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-hidden bg-slate-50 relative">
                {viewMode === 'code' ? (
                    <CodeViewer file={activeFile} />
                ) : (
                    <PreviewFrame files={files} />
                )}
            </div>
          </div>

          {/* Right Column: AI Panel (Span 4) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-[700px]">
            <AnalysisPanel 
                status={analysisStatus} 
                analysis={currentAnalysis} 
                activeFile={activeFile}
                chatMessages={chatMessages}
                onAnalyze={handleAnalyze}
                onModifyCode={handleModifyCode}
            />
          </div>

        </div>
      </main>

      <footer className="relative z-10 bg-white/50 backdrop-blur border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500 font-medium">
                &copy; {new Date().getFullYear()} Cucaypy AI. Created by <span className="text-slate-700 font-semibold">Jose Divino Prado da Lapa</span>.
            </p>
            <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    System Online
                </span>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;