import React, { useState } from 'react';
import { PenTool, Wand2, Tag, Quote, Save, Loader2 } from 'lucide-react';
import { JournalEntry } from '../types';
import { generateJournalMetadata, polishJournalContent } from '../services/geminiService';

interface SmartJournalProps {
  entries: JournalEntry[];
  addEntry: (entry: JournalEntry) => void;
}

export const SmartJournal: React.FC<SmartJournalProps> = ({ entries, addEntry }) => {
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedMeta, setGeneratedMeta] = useState<{title?: string, tags?: string[]} | null>(null);

  const handlePolish = async () => {
    if (!content.trim() || isProcessing) return;
    setIsProcessing(true);
    try {
      const polished = await polishJournalContent(content);
      if (polished) setContent(polished);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateMeta = async () => {
     if (!content.trim()) return null;
     setIsProcessing(true);
     try {
        const meta = await generateJournalMetadata(content);
        setGeneratedMeta(meta);
        return meta;
     } catch(e) {
        console.error(e);
        return null;
     } finally {
        setIsProcessing(false);
     }
  }

  const handleSave = async () => {
    if (!content.trim()) return;
    
    // Auto-generate meta if not already done
    let meta = generatedMeta;
    if (!meta) {
        meta = await handleGenerateMeta();
    }

    const newEntry: JournalEntry = {
        id: Date.now().toString(),
        content,
        title: meta?.title || "Untitled Entry",
        tags: meta?.tags || [],
        timestamp: new Date()
    };
    
    addEntry(newEntry);
    setContent('');
    setGeneratedMeta(null);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0 h-full flex flex-col">
       <header>
        <h1 className="text-2xl font-bold text-gray-800">Smart Journal</h1>
        <p className="text-gray-500">Reflect on your journey with AI assistance.</p>
      </header>

      {/* Editor */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write about your day, your meals, or your feelings..."
            className="w-full min-h-[150px] p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-violet-500 resize-none text-gray-700 leading-relaxed"
            disabled={isProcessing}
        />
        
        {/* AI Toolbar */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            <button 
                onClick={handlePolish}
                disabled={!content.trim() || isProcessing}
                className="flex items-center gap-2 px-3 py-2 bg-violet-50 text-violet-700 rounded-lg text-sm font-medium hover:bg-violet-100 disabled:opacity-50 transition-colors"
            >
                {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                Polish Text
            </button>
             <button 
                onClick={handleGenerateMeta}
                disabled={!content.trim() || isProcessing}
                className="flex items-center gap-2 px-3 py-2 bg-pink-50 text-pink-700 rounded-lg text-sm font-medium hover:bg-pink-100 disabled:opacity-50 transition-colors"
            >
                <Tag size={14} />
                Generate Tags & Title
            </button>
        </div>

        {/* Preview Metadata */}
        {generatedMeta && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 animate-fade-in">
                <h4 className="font-bold text-gray-800 mb-2">{generatedMeta.title}</h4>
                <div className="flex flex-wrap gap-2">
                    {generatedMeta.tags?.map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 bg-white border border-gray-200 rounded-full text-gray-600">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        )}

        <button 
            onClick={handleSave}
            disabled={!content.trim() || isProcessing}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
            <Save size={18} />
            Save Entry
        </button>
      </div>

      {/* Entries Feed */}
      <div className="flex-1 overflow-y-auto space-y-4">
        <h3 className="font-semibold text-gray-700 px-1">Past Entries</h3>
        {entries.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
                <BookOpenIcon size={32} className="mx-auto mb-3 opacity-30" />
                <p>No journal entries yet.</p>
            </div>
        ) : (
            entries.slice().reverse().map(entry => (
                <div key={entry.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-800 text-lg">{entry.title || "Untitled"}</h3>
                        <span className="text-xs text-gray-400 whitespace-nowrap">{entry.timestamp.toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{entry.content}</p>
                    <div className="flex flex-wrap gap-2">
                        {entry.tags?.map(tag => (
                            <span key={tag} className="text-[10px] px-2 py-1 bg-gray-100 text-gray-500 rounded-md">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

const BookOpenIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);
