import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisStatus, ProjectFile, ChatMessage } from '../types';
import { Sparkles, Bot, RefreshCw, AlertCircle, PenTool, Code2, Image as ImageIcon, Send, LayoutTemplate, Palette, Smartphone, Bug, Camera, X } from 'lucide-react';

interface AnalysisPanelProps {
  status: AnalysisStatus;
  analysis: string | null;
  activeFile: ProjectFile;
  chatMessages: ChatMessage[];
  onAnalyze: () => void;
  onModifyCode: (instructions: string, image?: string) => void;
}

type Mode = 'analyze' | 'develop';

// "Keyboard" Quick Actions
const QUICK_ACTIONS = [
    { label: 'Add Image', icon: <ImageIcon className="w-3.5 h-3.5" />, prompt: 'Insert a nice placeholder image (from unsplash source or similar) into the main section with a modern border-radius and shadow.' },
    { label: 'Add Navbar', icon: <LayoutTemplate className="w-3.5 h-3.5" />, prompt: 'Create a responsive navigation bar with a logo and links for Home, About, and Contact.' },
    { label: 'Fix Styles', icon: <Palette className="w-3.5 h-3.5" />, prompt: 'Review the CSS and fix any spacing, alignment, or color consistency issues to make it look professional.' },
    { label: 'Mobile Fix', icon: <Smartphone className="w-3.5 h-3.5" />, prompt: 'Ensure the layout is fully responsive and looks great on mobile devices.' },
    { label: 'Add Footer', icon: <LayoutTemplate className="w-3.5 h-3.5" />, prompt: 'Add a footer with copyright info and social media links at the bottom.' },
    { label: 'Debug', icon: <Bug className="w-3.5 h-3.5" />, prompt: 'Check for any potential logic errors or syntax issues and fix them.' },
];

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ status, analysis, activeFile, chatMessages, onAnalyze, onModifyCode }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [mode, setMode] = useState<Mode>('analyze');
  const [instructions, setInstructions] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Auto-scroll
  useEffect(() => {
    if (status === AnalysisStatus.SUCCESS && contentRef.current && mode === 'analyze') {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [status, mode]);

  // Scroll chat to bottom on new message
  useEffect(() => {
    if (mode === 'develop' && chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, mode]);

  const isIdle = status === AnalysisStatus.IDLE;
  const isLoading = status === AnalysisStatus.LOADING;
  const isError = status === AnalysisStatus.ERROR;
  const isSuccess = status === AnalysisStatus.SUCCESS;

  const handleDevelopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (instructions.trim() || selectedImage) {
      onModifyCode(instructions, selectedImage || undefined);
      setInstructions('');
      setSelectedImage(null);
    }
  };

  const handleQuickAction = (prompt: string) => {
    onModifyCode(prompt);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 h-[650px] flex flex-col overflow-hidden ring-1 ring-slate-900/5 transition-all duration-300 hover:shadow-2xl">
      {/* Tabs */}
      <div className="p-3 border-b border-slate-100/50 flex gap-2 shrink-0 bg-gradient-to-b from-white to-slate-50/50">
        <button
          onClick={() => setMode('analyze')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
            mode === 'analyze' 
              ? 'bg-white text-purple-600 shadow-[0_2px_8px_rgba(147,51,234,0.15)] ring-1 ring-purple-100' 
              : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-700'
          }`}
        >
          <Bot className="w-4 h-4" />
          AI Analysis
        </button>
        <button
          onClick={() => setMode('develop')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
            mode === 'develop' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)]' 
              : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-700'
          }`}
        >
          <PenTool className="w-4 h-4" />
          Builder
        </button>
      </div>

      <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-50/30">
        
        {/* ANALYZE MODE */}
        {mode === 'analyze' && (
          <div className="h-full overflow-auto p-6 custom-scrollbar">
              {isLoading && (
                 <div className="flex flex-col items-center justify-center py-12 space-y-6">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                        </div>
                    </div>
                    <p className="text-slate-500 font-medium animate-pulse">Analyzing logic & structure...</p>
                 </div>
              )}
              
              {isError && (
                  <div className="p-6 bg-red-50/80 border border-red-100 text-red-700 rounded-xl flex flex-col items-center text-center">
                      <AlertCircle className="w-10 h-10 mb-3 text-red-500" />
                      <p className="font-medium">Analysis failed.</p>
                      <button onClick={onAnalyze} className="mt-3 text-sm px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-red-50 transition-colors">Try Again</button>
                  </div>
              )}

              {isIdle && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 p-4">
                  <div className="bg-gradient-to-br from-purple-100 to-indigo-50 p-6 rounded-full shadow-inner">
                    <Bot className="w-10 h-10 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Code Analysis AI</h3>
                    <p className="text-slate-500 mt-2 max-w-xs mx-auto text-sm leading-relaxed">
                      Select a file and let Cucaypy analyze your code for bugs, structure, and improvements.
                    </p>
                  </div>
                  <button
                    onClick={onAnalyze}
                    className="group px-6 py-3 bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 group-hover:text-purple-600" />
                    Analyze <span className="font-mono text-xs bg-purple-100 px-1.5 py-0.5 rounded text-purple-800">{activeFile.name}</span>
                  </button>
                </div>
              )}

              {isSuccess && analysis && (
                <div className="prose prose-slate prose-sm max-w-none animate-in fade-in slide-in-from-bottom-4 duration-500" ref={contentRef}>
                  <div className="flex items-center gap-2 text-purple-800 mb-6 bg-purple-50/80 backdrop-blur-sm p-4 rounded-xl border border-purple-100 shadow-sm">
                    <div className="bg-white p-1.5 rounded-full shadow-sm">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-semibold">Analysis Results</span>
                  </div>
                  <ReactMarkdown>{analysis}</ReactMarkdown>
                  <div className="mt-8 pt-6 border-t border-slate-200/60 flex justify-end">
                       <button
                          onClick={onAnalyze}
                          className="flex items-center gap-2 text-slate-400 hover:text-purple-600 text-xs font-medium transition-colors uppercase tracking-wider"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Refresh
                        </button>
                  </div>
                </div>
              )}
          </div>
        )}

        {/* DEVELOP / BUILDER MODE */}
        {mode === 'develop' && (
            <>
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                    {chatMessages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-60 p-8">
                            <div className="bg-blue-50 p-4 rounded-full mb-4">
                                <Code2 className="w-8 h-8 text-blue-500" />
                            </div>
                            <p className="text-sm text-slate-600 font-medium">Welcome to the Builder.</p>
                            <p className="text-xs text-slate-400 mt-1">Use the camera to snap a design, or type commands below.</p>
                        </div>
                    )}
                    
                    {chatMessages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div 
                                className={`
                                    max-w-[85%] rounded-2xl px-5 py-3.5 text-sm shadow-sm leading-relaxed relative group flex flex-col gap-2
                                    ${msg.role === 'user' 
                                        ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-br-none shadow-blue-500/20' 
                                        : msg.role === 'system'
                                            ? 'bg-transparent text-slate-400 text-xs text-center w-full shadow-none py-1'
                                            : 'bg-white text-slate-700 border border-slate-200/80 rounded-bl-none'
                                    }
                                `}
                            >
                                {msg.role === 'assistant' && (
                                    <div className="flex items-center gap-2 mb-1 pb-2 border-b border-slate-100">
                                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border border-white shadow-sm">
                                            <Bot className="w-3 h-3 text-blue-600"/> 
                                        </div>
                                        <span className="text-xs font-bold text-slate-800">Cucaypy AI</span>
                                    </div>
                                )}
                                {msg.image && (
                                  <img src={msg.image} alt="User upload" className="max-w-full rounded-lg border border-white/20 my-1" style={{maxHeight: '200px', objectFit: 'cover'}} />
                                )}
                                <span>{msg.content}</span>
                            </div>
                        </div>
                    ))}
                    
                    {isLoading && (
                         <div className="flex justify-start animate-in fade-in duration-300">
                            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-4 shadow-sm flex items-center gap-1.5">
                                <span className="text-xs text-slate-400 font-medium mr-2">Thinking</span>
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* "Developer Keyboard" / Input Area */}
                <div className="bg-white/80 backdrop-blur-md border-t border-slate-200/80 p-4 shrink-0 z-10">
                    
                    {/* Image Preview in Input */}
                    {selectedImage && (
                      <div className="mb-2 flex items-center gap-2 bg-slate-100 p-2 rounded-lg w-fit">
                        <img src={selectedImage} alt="Preview" className="w-10 h-10 object-cover rounded" />
                        <span className="text-xs text-slate-500">Image selected</span>
                        <button onClick={() => setSelectedImage(null)} className="bg-slate-200 rounded-full p-1 hover:bg-slate-300 text-slate-600">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Quick Actions Toolbar */}
                    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mask-linear items-center">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">Quick Keys</span>
                         {QUICK_ACTIONS.map((action, idx) => (
                             <button
                                key={idx}
                                onClick={() => handleQuickAction(action.prompt)}
                                disabled={isLoading}
                                className="group flex flex-col items-center justify-center gap-1 min-w-[70px] h-[60px] px-2 bg-slate-50 hover:bg-white text-slate-500 hover:text-blue-600 rounded-xl border border-slate-200 hover:border-blue-200 transition-all shadow-sm hover:shadow-md shrink-0"
                             >
                                 <div className="p-1.5 rounded-full bg-white group-hover:bg-blue-50 transition-colors">
                                    {action.icon}
                                 </div>
                                 <span className="text-[10px] font-medium truncate w-full text-center">{action.label}</span>
                             </button>
                         ))}
                    </div>

                    <form onSubmit={handleDevelopSubmit} className="relative flex items-center gap-2 mt-1">
                        <input 
                          type="file" 
                          accept="image/*" 
                          ref={fileInputRef} 
                          className="hidden" 
                          onChange={handleImageSelect} 
                        />
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="p-3 rounded-full bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="Add Photo/Screenshot"
                        >
                          <Camera className="w-5 h-5" />
                        </button>
                        
                        <div className="relative flex-1 group">
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-700 text-sm transition-all group-hover:bg-white"
                                placeholder="Describe changes or select a quick key..."
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                disabled={isLoading}
                            />
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                <PenTool className="w-4 h-4" />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={(!instructions.trim() && !selectedImage) || isLoading}
                            className={`
                                w-12 h-12 rounded-full transition-all shadow-md flex items-center justify-center
                                ${(!instructions.trim() && !selectedImage) || isLoading
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-105 active:scale-95'
                                }
                            `}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;