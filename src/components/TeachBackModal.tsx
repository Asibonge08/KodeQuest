import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Send, Sparkles, Brain, Award, AlertTriangle, ArrowRight, HelpCircle, CheckCircle2 } from 'lucide-react';
import { TeachBackGap } from '../types';

interface TeachBackModalProps {
  moduleCode: string;
  moduleName: string;
  onClose: () => void;
  onAddGap: (gap: TeachBackGap) => void;
  onAwardXp: (amount: number, reason: string) => void;
}

interface Message {
  sender: 'student' | 'kodi';
  text: string;
  clarityScore?: number;
  unexplainedJargon?: string[];
  gapsIdentified?: string[];
  followUpQuestion?: string;
}

const SAMPLE_CONCEPTS: Record<string, string[]> = {
  PROG511: ['Variables & Primitive Types', 'Conditionals & Logical Operators', 'While vs For Loops', 'Functions & Variable Scope'],
  PROG621: ['Object-Oriented Encapsulation', 'Polymorphism & Method Overriding', 'Abstract Classes vs Interfaces', 'Exception Handling Call Stack'],
  NET511: ['OSI 7-Layer Encapsulation', 'IP Addressing & Subnet Masks', 'TCP 3-Way Handshake', 'DNS Resolution Hierarchy'],
  DBS621: ['Primary Keys vs Foreign Keys', 'SQL INNER vs LEFT JOIN', 'Database Normalization (1NF to 3NF)', 'ACID Transaction Properties'],
  SEN700: ['Agile Sprint Planning', 'Continuous Integration / Deployment', 'Microservices vs Monoliths', 'Design Patterns (Factory, Observer)'],
  CYB700: ['Symmetric vs Asymmetric Encryption', 'Phishing & Social Engineering Vectors', 'SQL Injection Mitigation', 'Multi-Factor Authentication & Tokens']
};

export const TeachBackModal: React.FC<TeachBackModalProps> = ({
  moduleCode,
  moduleName,
  onClose,
  onAddGap,
  onAwardXp
}) => {
  const defaultConcepts = SAMPLE_CONCEPTS[moduleCode] || [
    'Core Foundational Principle',
    'Real-World System Implementation',
    'Error Handling & Boundary Conditions'
  ];

  const [selectedConcept, setSelectedConcept] = useState(defaultConcepts[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'kodi',
      text: `Sawubona! I'm Kodi, a first-year IT student here at Richfield. Our lecturer asked me about "${selectedConcept}", but the textbook is full of dense jargon! Can you explain it to me in your own words like we're chilling at the student canteen? Use a relatable South African analogy if you can!`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [sessionScore, setSessionScore] = useState<number | null>(null);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-ZA'; // South African English

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Speech start error:', err);
      }
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;
    const studentText = inputText.trim();
    setInputText('');

    const newMessages: Message[] = [...messages, { sender: 'student', text: studentText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/teach-back', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleCode,
          conceptTitle: selectedConcept,
          studentExplanation: studentText,
          conversationHistory: newMessages.slice(-4)
        })
      });

      if (!res.ok) throw new Error('Teach-back request failed');
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: 'kodi',
          text: data.kodiReply,
          clarityScore: data.clarityScore,
          unexplainedJargon: data.unexplainedJargon,
          gapsIdentified: data.gapsIdentified,
          followUpQuestion: data.followUpQuestion
        }
      ]);

      if (data.clarityScore) {
        setSessionScore(data.clarityScore);
        // Award XP based on clarity
        const xpEarned = data.clarityScore * 15;
        onAwardXp(xpEarned, `Feynman Teach-Back with Kodi (${selectedConcept}): Clarity ${data.clarityScore}/5`);
      }

      // Add gaps to spaced repetition
      if (data.gapsIdentified && Array.isArray(data.gapsIdentified)) {
        data.gapsIdentified.forEach((gap: string) => {
          onAddGap({
            id: `gap-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            moduleCode,
            topic: `${selectedConcept}: ${gap}`,
            dateAdded: new Date().toISOString().split('T')[0],
            resolved: false
          });
        });
      }
    } catch (err) {
      console.error('Teach-back error:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'kodi',
          text: `Eish, that makes sense! But what happens when the load is high or during load-shedding? How does the system avoid dropping packets? Also, can you give me an analogy like queueing for a taxi?`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="flex flex-col w-full max-w-2xl h-[90vh] bg-white dark:bg-[#0b1222] border border-[#14316B]/20 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#14316B] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#3FA7B8]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#3FA7B8]/20 border-2 border-[#3FA7B8] flex items-center justify-center text-xl shrink-0">
              🦊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading uppercase font-bold text-sm tracking-wider text-white">
                  Teach-Back Feynman Studio
                </h3>
                <span className="text-[10px] bg-[#3FA7B8]/20 text-[#3FA7B8] border border-[#3FA7B8]/40 px-2 py-0.5 rounded font-mono font-bold">
                  Kodi Mascot
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

        {/* Concept Selector Bar */}
        <div className="bg-[#DCEBF3] dark:bg-slate-900 px-5 py-2.5 border-b border-[#3FA7B8]/20 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 font-bold uppercase tracking-wider shrink-0 text-[11px]">
            Concept:
          </span>
          {defaultConcepts.map((c) => (
            <button
              key={c}
              onClick={() => {
                setSelectedConcept(c);
                setMessages([
                  {
                    sender: 'kodi',
                    text: `Sawubona! I'm Kodi, a first-year IT student. Can you explain "${c}" in plain English without jargon, maybe with a South African analogy?`
                  }
                ]);
              }}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedConcept === c
                  ? 'bg-[#1C56A8] text-white shadow-sm'
                  : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'student' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-start gap-2.5 max-w-[88%] sm:max-w-[80%]">
                {m.sender === 'kodi' && (
                  <div className="w-8 h-8 rounded-full bg-[#1C56A8] text-white text-sm flex items-center justify-center shrink-0 mt-1 shadow">
                    🦊
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    m.sender === 'student'
                      ? 'bg-[#1C56A8] text-white rounded-br-none shadow'
                      : 'bg-[#DCEBF3]/60 dark:bg-slate-800 text-[#14316B] dark:text-slate-100 rounded-bl-none border border-[#3FA7B8]/20'
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Feedback Card attached to Kodi's reply */}
                  {m.clarityScore !== undefined && (
                    <div className="mt-3 pt-3 border-t border-black/10 dark:border-white/10 space-y-2 text-xs">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-[#14316B] dark:text-[#3FA7B8] uppercase tracking-wider text-[11px]">
                          Feynman Clarity Rating
                        </span>
                        <span className="flex items-center gap-1 text-amber-500 font-mono">
                          {'★'.repeat(m.clarityScore)}{'☆'.repeat(5 - m.clarityScore)} ({m.clarityScore}/5)
                        </span>
                      </div>

                      {m.unexplainedJargon && m.unexplainedJargon.length > 0 && (
                        <div className="bg-amber-50 dark:bg-amber-950/40 p-2 rounded border border-amber-400/30 text-amber-900 dark:text-amber-200 text-[11px]">
                          <strong>⚠️ Unexplained Jargon flagged:</strong> {m.unexplainedJargon.join(', ')}
                        </div>
                      )}

                      {m.gapsIdentified && m.gapsIdentified.length > 0 && (
                        <div className="text-[11px] text-slate-600 dark:text-slate-300">
                          <strong>Gaps saved to Spaced Repetition:</strong>
                          <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                            {m.gapsIdentified.map((gap, gIdx) => (
                              <li key={gIdx}>{gap}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-[#3FA7B8] animate-ping" />
              <span>Kodi is thinking of naive questions...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar pinned above keyboard */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            {speechSupported && (
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:text-black dark:hover:text-white'
                }`}
                title={isListening ? 'Listening... click to stop' : 'Voice Teach-Back (dictate explanation)'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Teach Kodi "${selectedConcept}" in plain words...`}
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#1C56A8]"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-4 py-2.5 bg-[#1C56A8] hover:bg-[#14316B] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition-colors disabled:opacity-40 flex items-center gap-1.5"
            >
              <span>Explain</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          <p className="text-[10px] text-slate-400 mt-1.5 text-center">
            Tip: Explain simply without buzzwords. Use examples like minibus taxi ranks, spaza stores, or campus internet to boost clarity.
          </p>
        </div>
      </div>
    </div>
  );
};
