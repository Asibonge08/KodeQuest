import React, { useState } from 'react';
import { FrameworkTrack, FrameworkLesson } from '../types';
import { FOCUS_AREAS } from '../data/mockData';
import { BookOpen, CheckCircle2, Award, Clock, ArrowRight, Sparkles, Check, X, ShieldCheck } from 'lucide-react';
import { fireSuccessConfetti } from '../utils/confetti';

interface FrameworksViewProps {
  frameworks: FrameworkTrack[];
  completedLessonIds: string[];
  onCompleteLesson: (lessonId: string, xp: number) => void;
}

export const FrameworksView: React.FC<FrameworksViewProps> = ({
  frameworks,
  completedLessonIds,
  onCompleteLesson
}) => {
  const [selectedTrack, setSelectedTrack] = useState<FrameworkTrack>(frameworks[0]);
  const [activeLesson, setActiveLesson] = useState<FrameworkLesson>(frameworks[0].lessons[0]);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleSelectTrack = (track: FrameworkTrack) => {
    setSelectedTrack(track);
    setActiveLesson(track.lessons[0]);
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleSelectLesson = (lesson: FrameworkLesson) => {
    setActiveLesson(lesson);
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleQuizSubmit = () => {
    if (selectedQuizAnswer === null) return;
    setQuizSubmitted(true);

    if (activeLesson.quiz && selectedQuizAnswer === activeLesson.quiz.correctAnswer) {
      if (!completedLessonIds.includes(activeLesson.id)) {
        fireSuccessConfetti();
        onCompleteLesson(activeLesson.id, activeLesson.xp);
      }
    }
  };

  const isLessonDone = completedLessonIds.includes(activeLesson.id);
  const trackFocus = FOCUS_AREAS[selectedTrack.focusArea];

  return (
    <div className="space-y-6 overflow-x-hidden max-w-full">
      {/* Header Banner - Richfield Prospectus corporate-academic style */}
      <div className="p-6 md:p-8 bg-[#14316B] text-white rounded-2xl border border-[#3FA7B8]/30 shadow-md">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#3FA7B8] mb-1">
              <span>Industry Badges & Micro-Credentials</span>
              <span aria-hidden="true">·</span>
              <span>More Than Just a Degree</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading uppercase font-bold text-white tracking-tight">
              Curriculum Industry Certifications
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 mt-2 max-w-2xl leading-relaxed">
              Richfield embeds global industry-recognised certifications from AWS Academy, Cisco Networking Academy, Microsoft, IBM Skills Academy, Salesforce, Oracle, and CIMA directly into your curriculum.
            </p>
          </div>

          <div className="bg-white/10 border border-white/15 p-4 rounded-xl text-xs text-white shrink-0">
            <span className="text-[10px] uppercase tracking-wider text-sky-300 block font-bold">Credential Progress</span>
            <span className="text-xl font-bold font-mono tabular-nums text-white">
              {completedLessonIds.length} <span className="text-xs text-sky-200 font-normal">/ {frameworks.reduce((acc, f) => acc + f.lessons.length, 0)} Badges</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Framework Track Picker Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {frameworks.map((fw) => {
          const isSelected = selectedTrack.id === fw.id;
          const meta = FOCUS_AREAS[fw.focusArea];
          const completedInTrack = fw.lessons.filter((l) => completedLessonIds.includes(l.id)).length;

          return (
            <button
              key={fw.id}
              onClick={() => handleSelectTrack(fw)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#1C56A8] text-white border-[#1C56A8] shadow-md ring-2 ring-[#3FA7B8]'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-[#1C56A8]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-2xl">{fw.badgeIcon}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {meta.shortLabel}
                  </span>
                </div>
                <h3 className="font-heading uppercase font-bold text-sm leading-tight">{fw.name}</h3>
                <p className={`text-xs mt-1 line-clamp-2 ${isSelected ? 'text-sky-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {fw.description}
                </p>
              </div>

              <div className={`mt-4 pt-3 border-t text-xs flex items-center justify-between ${
                isSelected ? 'border-white/20 text-sky-200' : 'border-slate-100 dark:border-slate-800 text-slate-500'
              }`}>
                <span className="font-bold text-[#E24B3C] dark:text-rose-400 tabular-nums">+{fw.totalXp} XP</span>
                <span className="text-[11px] font-mono">
                  {completedInTrack}/{fw.lessons.length} complete
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Lesson Deck & Learning Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-sm">
        {/* Left: Lessons sidebar within track */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 bg-[#DCEBF3]/60 dark:bg-slate-800 border border-[#3FA7B8]/30 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1C56A8] dark:text-[#3FA7B8]">
              <span className="text-lg">{selectedTrack.badgeIcon}</span>
              <span className="font-heading uppercase font-bold">{selectedTrack.category}</span>
            </div>
            <h2 className="text-base font-bold text-[#14316B] dark:text-white">{selectedTrack.name}</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{selectedTrack.description}</p>

            <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-[#3FA7B8] shrink-0" />
              <span>Partner: <strong className="text-[#14316B] dark:text-white font-bold">{selectedTrack.partnerBadge}</strong></span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-heading uppercase font-bold tracking-wider text-slate-500 mb-2 px-1">
              Micro-Credential Modules
            </h3>
            <div className="space-y-2">
              {selectedTrack.lessons.map((lesson, idx) => {
                const isSelected = activeLesson.id === lesson.id;
                const isDone = completedLessonIds.includes(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => handleSelectLesson(lesson)}
                    className={`w-full p-3 text-left rounded-xl border text-xs transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#1C56A8] text-white border-[#1C56A8] font-bold shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`font-mono text-[11px] ${isSelected ? 'text-sky-200' : 'text-slate-400'}`}>
                        {idx + 1}.
                      </span>
                      <span>{lesson.title}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span className={`font-bold tabular-nums text-[11px] ${isSelected ? 'text-amber-300' : 'text-[#E24B3C]'}`}>
                          +{lesson.xp} XP
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Active Lesson Concept, Code Snippet & Knowledge Quiz */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-6 min-w-0">
          <div className="space-y-5">
            {/* Lesson Title & Metadata */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs text-slate-400 font-mono">Module Lesson</span>
                <h3 className="text-lg sm:text-xl font-heading uppercase font-bold text-[#14316B] dark:text-white">
                  {activeLesson.title}
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activeLesson.duration}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-[#E24B3C] font-bold tabular-nums">+{activeLesson.xp} XP</span>
              </div>
            </div>

            {/* Concept Overview */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1.5">
              <h4 className="text-xs font-heading uppercase font-bold tracking-wider text-[#1C56A8] dark:text-[#3FA7B8]">
                Architectural Principle
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeLesson.conceptSummary}
              </p>
            </div>

            {/* Architecture Code Snippet without horizontal overflow */}
            <div className="min-w-0 max-w-full">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1 px-1">
                <span className="font-bold text-[#14316B] dark:text-white">Live Code Implementation</span>
                <span className="text-[11px] font-mono text-slate-400">Syntax Specification</span>
              </div>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-sky-300 overflow-x-auto leading-relaxed max-w-full break-words">
                {activeLesson.codeSnippet}
              </pre>
            </div>

            {/* Key Engineering Takeaways */}
            <div>
              <h4 className="text-xs font-heading uppercase font-bold tracking-wider text-slate-500 mb-2">
                Industry Exam Takeaways
              </h4>
              <ul className="space-y-1.5">
                {activeLesson.keyPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Interactive Knowledge Quiz Check */}
          {activeLesson.quiz && (
            <div className="p-5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-heading uppercase tracking-wider text-[#14316B] dark:text-amber-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Module Knowledge Check</span>
                </h4>
                {isLessonDone && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Badge Unlocked
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                {activeLesson.quiz.question}
              </p>

              <div className="space-y-2">
                {activeLesson.quiz.options.map((option, idx) => {
                  const isSelected = selectedQuizAnswer === idx;
                  const isCorrect = idx === activeLesson.quiz?.correctAnswer;
                  
                  let optionStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#1C56A8]';
                  if (quizSubmitted) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-100 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'bg-rose-100 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-200';
                    }
                  } else if (isSelected) {
                    optionStyle = 'bg-[#1C56A8] text-white border-[#1C56A8] font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !quizSubmitted && setSelectedQuizAnswer(idx)}
                      disabled={quizSubmitted}
                      className={`w-full p-3 rounded-xl border text-xs text-left transition-colors flex items-center justify-between ${optionStyle}`}
                    >
                      <span>{option}</span>
                      {quizSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                      {quizSubmitted && isSelected && !isCorrect && <X className="w-4 h-4 text-rose-600" />}
                    </button>
                  );
                })}
              </div>

              {quizSubmitted && (
                <div className={`p-3 rounded-xl text-xs leading-relaxed ${
                  selectedQuizAnswer === activeLesson.quiz.correctAnswer
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-950/30 border border-rose-500/30 text-rose-800 dark:text-rose-300'
                }`}>
                  <p className="font-bold mb-1">
                    {selectedQuizAnswer === activeLesson.quiz.correctAnswer ? '✓ Correct Answer!' : '✗ Not quite correct'}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">{activeLesson.quiz.explanation}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">Answer correctly to unlock +{activeLesson.xp} XP</span>
                <button
                  onClick={quizSubmitted ? () => { setQuizSubmitted(false); setSelectedQuizAnswer(null); } : handleQuizSubmit}
                  disabled={selectedQuizAnswer === null}
                  className="px-5 py-2.5 text-xs font-heading uppercase font-bold tracking-wider text-white bg-[#1C56A8] hover:bg-[#14316B] rounded-xl shadow transition-colors disabled:opacity-40"
                >
                  {quizSubmitted ? 'Retake Quiz' : 'Verify Answer'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
