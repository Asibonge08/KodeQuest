import React, { useState } from 'react';
import {
  X,
  FileText,
  Youtube,
  Upload,
  BookOpen,
  Sparkles,
  HelpCircle,
  Brain,
  Quote,
  CheckCircle2,
  RefreshCw,
  Send
} from 'lucide-react';
import { SourceVaultDoc } from '../types';

interface SourceVaultModalProps {
  moduleCode: string;
  moduleName: string;
  onClose: () => void;
  onAwardXp: (amount: number, reason: string) => void;
}

export const SourceVaultModal: React.FC<SourceVaultModalProps> = ({
  moduleCode,
  moduleName,
  onClose,
  onAwardXp
}) => {
  const [sourceText, setSourceText] = useState(
    `Module ${moduleCode}: ${moduleName} - Study Notes & Prescribed Textbook Digest.
Key Assessment Policy: Formative Assessments count 40% (tests, assignments, lab work). Summative Assessment counts 60% (three-hour written examination). Pass mark is 50%. Supplementary examination offered if final mark is between 40% and 47%.
Core Competency: Master underlying architectural models, rigorous syntax validation, error mitigation, and industry certifications (AWS, Cisco, IBM, Oracle, Fortinet).`
  );
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [activeAction, setActiveAction] = useState<string>('summary');
  const [customQuestion, setCustomQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [citations, setCitations] = useState<string[]>([]);
  const [flashcards, setFlashcards] = useState<Array<{ question: string; answer: string; citation: string }>>([]);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setSourceText((prev) => `${prev}\n\n=== UPLOADED: ${file.name} ===\n${content}`);
    };
    reader.readAsText(file);
  };

  const handleExecuteAction = async (action: string, customQuery?: string) => {
    setIsLoading(true);
    setActiveAction(action);
    setResultText(null);

    try {
      const res = await fetch('/api/ai/source-vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleCode,
          action,
          query: customQuery || action,
          sourceText,
          youtubeUrl
        })
      });

      if (!res.ok) throw new Error('Source Vault request failed');
      const data = await res.json();

      if (data.flashcards && Array.isArray(data.flashcards)) {
        setFlashcards(data.flashcards);
      } else {
        setResultText(data.result);
      }

      if (data.citations) {
        setCitations(data.citations);
      }

      onAwardXp(15, `Consulted Source Vault for ${moduleCode} (${action})`);
    } catch (err: any) {
      console.error('Source Vault fetch error:', err);
      setResultText(`Unable to process request at this moment. Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="flex flex-col w-full max-w-4xl h-[92vh] bg-white dark:bg-[#0b1222] border border-[#14316B]/20 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#14316B] text-white px-6 py-4 flex items-center justify-between border-b border-[#3FA7B8]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3FA7B8]/20 border border-[#3FA7B8] flex items-center justify-center text-[#3FA7B8]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading uppercase font-bold text-sm tracking-wider text-white">
                  Source Vault & Grounded AI Assistant
                </h3>
                <span className="text-[10px] bg-[#E24B3C]/20 text-[#E24B3C] border border-[#E24B3C]/40 px-2 py-0.5 rounded font-mono font-bold">
                  Zero Hallucination
                </span>
              </div>
              <p className="text-xs text-sky-200">
                {moduleCode} · {moduleName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main 2-Column Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
          
          {/* Left Column: Source Ingestion (Notes, PDF upload, YouTube links) */}
          <div className="lg:col-span-5 p-5 space-y-4 bg-slate-50 dark:bg-slate-900/60 overflow-y-auto">
            <div>
              <h4 className="text-xs font-heading uppercase font-bold tracking-wider text-[#14316B] dark:text-white mb-1">
                Curriculum Study Materials
              </h4>
              <p className="text-[11px] text-slate-500">
                Paste lecture notes or upload past exam papers. The AI will answer <span className="font-bold underline text-[#1C56A8] dark:text-[#3FA7B8]">only</span> from this text.
              </p>
            </div>

            {/* File Upload Drop Area */}
            <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#3FA7B8] rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-colors text-center bg-white dark:bg-slate-800">
              <Upload className="w-5 h-5 text-[#3FA7B8] mb-1" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Upload Study Guide (.txt / .pdf / .docx)
              </span>
              <span className="text-[10px] text-slate-400">Drag file or click to browse</span>
              <input
                type="file"
                accept=".txt,.md,.json,.pdf,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* YouTube URL input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5 text-rose-500" />
                <span>Reference YouTube Lecture Link:</span>
              </label>
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full py-1.5 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono focus:outline-none focus:border-[#1C56A8]"
              />
            </div>

            {/* Source Raw Textarea */}
            <div className="space-y-1 flex-1 flex flex-col">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                Source Text / Study Notes:
              </label>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                rows={8}
                className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono leading-relaxed text-slate-700 dark:text-slate-200 resize-none focus:outline-none focus:border-[#1C56A8]"
              />
            </div>
          </div>

          {/* Right Column: AI Actions & Grounded Output */}
          <div className="lg:col-span-7 p-5 flex flex-col justify-between space-y-4 overflow-y-auto">
            {/* Quick Action Buttons */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Source Vault Quick Workflows:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => handleExecuteAction('summary')}
                  disabled={isLoading}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors ${
                    activeAction === 'summary'
                      ? 'bg-[#1C56A8] text-white border-[#1C56A8]'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#1C56A8]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-[#3FA7B8]" />
                  <span>Summary</span>
                </button>

                <button
                  onClick={() => handleExecuteAction('flashcards')}
                  disabled={isLoading}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors ${
                    activeAction === 'flashcards'
                      ? 'bg-[#1C56A8] text-white border-[#1C56A8]'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#1C56A8]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#3FA7B8]" />
                  <span>Flashcards</span>
                </button>

                <button
                  onClick={() => handleExecuteAction('quiz')}
                  disabled={isLoading}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors ${
                    activeAction === 'quiz'
                      ? 'bg-[#1C56A8] text-white border-[#1C56A8]'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#1C56A8]'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#3FA7B8]" />
                  <span>Quiz (3-Q)</span>
                </button>

                <button
                  onClick={() => handleExecuteAction('predict_exam')}
                  disabled={isLoading}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors ${
                    activeAction === 'predict_exam'
                      ? 'bg-[#1C56A8] text-white border-[#1C56A8]'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#1C56A8]'
                  }`}
                >
                  <Brain className="w-3.5 h-3.5 text-[#3FA7B8]" />
                  <span>Predict Exam</span>
                </button>

                <button
                  onClick={() => handleExecuteAction('explain_simpler')}
                  disabled={isLoading}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors col-span-2 sm:col-span-2 ${
                    activeAction === 'explain_simpler'
                      ? 'bg-[#1C56A8] text-white border-[#1C56A8]'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#1C56A8]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#3FA7B8]" />
                  <span>Explain Simpler (Layman's Terms)</span>
                </button>
              </div>
            </div>

            {/* Results Frame */}
            <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 overflow-y-auto min-h-[220px]">
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12 space-y-2 text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#3FA7B8]" />
                  <span className="text-xs">Grounding response strictly in your study vault notes...</span>
                </div>
              )}

              {!isLoading && !resultText && flashcards.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Select a workflow button above or ask a specific question below.
                </div>
              )}

              {/* Flashcards View */}
              {!isLoading && flashcards.length > 0 && (
                <div className="space-y-3">
                  <h5 className="text-xs font-bold uppercase text-[#14316B] dark:text-[#3FA7B8]">
                    Grounded Flashcards (Click to flip):
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {flashcards.map((fc, idx) => {
                      const isFlipped = !!flippedCards[idx];
                      return (
                        <div
                          key={idx}
                          onClick={() => setFlippedCards((prev) => ({ ...prev, [idx]: !isFlipped }))}
                          className="min-h-[120px] p-4 bg-[#DCEBF3]/40 dark:bg-slate-800 border border-[#3FA7B8]/30 rounded-xl cursor-pointer hover:shadow-md transition-shadow flex flex-col justify-between text-xs"
                        >
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#1C56A8] dark:text-[#3FA7B8] block mb-1">
                              {isFlipped ? 'Answer (Memo)' : `Question ${idx + 1}`}
                            </span>
                            <p className="font-medium text-slate-800 dark:text-slate-100">
                              {isFlipped ? fc.answer : fc.question}
                            </p>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
                            <span>{isFlipped ? '✓ Verified' : 'Tap to flip'}</span>
                            <span className="italic font-mono text-[9px]">{fc.citation}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Text Result View */}
              {!isLoading && resultText && (
                <div className="space-y-4">
                  <div className="prose prose-sm dark:prose-invert text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line">
                    {resultText}
                  </div>

                  {/* Citations Box */}
                  {citations.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Quote className="w-3 h-3" />
                        <span>Curriculum Citations:</span>
                      </span>
                      <ul className="mt-1 space-y-1">
                        {citations.map((c, i) => (
                          <li key={i} className="text-[11px] font-mono text-[#1C56A8] dark:text-[#3FA7B8]">
                            • {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Custom Query Input pinned to bottom */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (customQuestion.trim()) {
                  handleExecuteAction('ask', customQuestion.trim());
                  setCustomQuestion('');
                }
              }}
              className="flex items-center gap-2 pt-2"
            >
              <input
                type="text"
                placeholder="Ask anything grounded in this module's study notes..."
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                disabled={isLoading}
                className="flex-1 py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#1C56A8]"
              />
              <button
                type="submit"
                disabled={!customQuestion.trim() || isLoading}
                className="px-4 py-2.5 bg-[#1C56A8] hover:bg-[#14316B] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition-colors disabled:opacity-40 flex items-center gap-1.5"
              >
                <span>Query</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
