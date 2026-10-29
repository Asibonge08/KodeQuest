import React, { useState, useEffect } from 'react';
import { ProgrammeId, CurriculumModule, Challenge } from '../types';
import { DIT_MODULES, BSC_IT_MODULES, PROGRAMMES } from '../data/richfieldCurriculum';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Award,
  ShieldCheck,
  GraduationCap,
  Flame,
  Calculator,
  Brain,
  FileText,
  Clock,
  Layers
} from 'lucide-react';

interface ModuleMapViewProps {
  currentProgramme: ProgrammeId;
  selectedSpecialisation: string;
  completedChallengeIds: string[];
  challenges: Challenge[];
  onSelectChallenge: (challenge: Challenge) => void;
  onOpenCalculator: () => void;
  onOpenTeachBack: (moduleCode: string, moduleName: string) => void;
  onOpenSourceVault: (moduleCode: string, moduleName: string) => void;
  onOpenExamSimulator: (moduleCode: string, moduleName: string) => void;
}

export const ModuleMapView: React.FC<ModuleMapViewProps> = ({
  currentProgramme,
  selectedSpecialisation,
  completedChallengeIds,
  challenges,
  onSelectChallenge,
  onOpenCalculator,
  onOpenTeachBack,
  onOpenSourceVault,
  onOpenExamSimulator
}) => {
  const [selectedYear, setSelectedYear] = useState<1 | 2 | 3>(1);
  const [isScrolled, setIsScrolled] = useState(false);
  const programmeMeta = PROGRAMMES[currentProgramme];

  const allModules = currentProgramme === 'DIT' ? DIT_MODULES : BSC_IT_MODULES;
  const yearModules = allModules.filter((m) => m.year === selectedYear);

  const sem1Modules = yearModules.filter((m) => m.semester === 1);
  const sem2Modules = yearModules.filter((m) => m.semester === 2);
  const totalYearCredits = yearModules.reduce((acc, m) => acc + m.credits, 0);

  // Monitor scroll to collapse banner into a slim bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 140) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper for Circular Progress Ring
  const renderProgressRing = (progressPct: number, color: string = '#1C56A8') => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progressPct / 100) * circumference;

    return (
      <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 44 44">
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth="3.5"
            fill="transparent"
          />
          <circle
            cx="22"
            cy="22"
            r={radius}
            stroke={color}
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <span className="absolute font-mono text-[10px] font-bold text-slate-800 dark:text-slate-100">
          {progressPct}%
        </span>
      </div>
    );
  };

  const getModuleStatus = (isDone: boolean, hasChallenge: boolean) => {
    if (isDone) {
      return { label: 'Mastered', bg: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-400/40' };
    }
    if (hasChallenge) {
      return { label: 'In Progress', bg: 'bg-[#DCEBF3] dark:bg-slate-800 text-[#1C56A8] dark:text-[#3FA7B8] border-[#3FA7B8]/40' };
    }
    return { label: 'Exam Ready', bg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700' };
  };

  return (
    <div className="space-y-6">
      
      {/* Sticky Slim Bar on Scroll */}
      {isScrolled && (
        <div className="fixed top-16 left-0 right-0 z-30 bg-[#14316B] text-white px-4 py-2 shadow-lg border-b border-[#3FA7B8]/30 animate-in fade-in slide-in-from-top-2 duration-200 flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-heading uppercase font-bold text-xs tracking-wider text-white">
                {programmeMeta.name}
              </span>
              <span className="text-white/30">|</span>
              <span className="text-xs text-sky-200 font-mono">
                Year {selectedYear} · {totalYearCredits} Credits · SAQA {programmeMeta.saqaId}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenCalculator}
                className="px-3 py-1 bg-[#E24B3C] text-white text-[11px] font-heading uppercase font-bold tracking-wider rounded-lg shadow"
              >
                40/60 Mark Calc
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Programme Hero Banner with Richfield Prospectus corporate-academic style */}
      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden border border-[#14316B]/20 shadow-md">
        {/* Left Blue Panel */}
        <div className="lg:col-span-8 p-6 md:p-8 bg-[#1C56A8] text-white flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase font-bold tracking-widest text-[#3FA7B8] mb-1">
              FACULTY OF INFORMATION TECHNOLOGY (IT)
            </div>
            <h1 className="text-2xl md:text-3xl font-heading uppercase font-bold tracking-tight text-white">
              {programmeMeta.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 mt-2 leading-relaxed max-w-2xl">
              {programmeMeta.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-6 mt-6 border-t border-white/15 text-xs text-sky-200">
            <span>SAQA ID: <strong className="text-white font-mono">{programmeMeta.saqaId}</strong></span>
            <span aria-hidden="true">·</span>
            <span>NQF Level: <strong className="text-white font-mono">{programmeMeta.nqfLevel}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Total Credits: <strong className="text-white font-mono">{programmeMeta.totalCredits}</strong></span>
            <span aria-hidden="true">·</span>
            <span className="text-[#3FA7B8] font-bold">{programmeMeta.accreditation}</span>
          </div>
        </div>

        {/* Right White/Light Panel with Assessment Rules */}
        <div className="lg:col-span-4 p-6 bg-white dark:bg-slate-900 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#14316B]/15">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
              <span>Active Specialisation</span>
              <span className="text-[#1C56A8] dark:text-[#3FA7B8]">{selectedSpecialisation}</span>
            </div>

            <div className="p-3.5 bg-[#DCEBF3]/60 dark:bg-slate-800/80 rounded-xl space-y-1.5 text-xs">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 block font-semibold">
                Richfield Grading Standard
              </span>
              <p className="text-[#14316B] dark:text-slate-200 font-bold">
                40% Formative + 60% Summative (50% Pass)
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Supplementary exam threshold: 40% – 47%
              </p>
            </div>
          </div>

          <button
            onClick={onOpenCalculator}
            className="w-full mt-4 py-2.5 px-4 bg-[#E24B3C] hover:bg-[#c93f31] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow transition-colors flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            <span>Open 40/60 Mark Calculator</span>
          </button>
        </div>
      </div>

      {/* Year Selector Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr as any)}
              className={`px-5 py-2 text-xs font-heading uppercase font-bold tracking-wider rounded-lg transition-colors ${
                selectedYear === yr
                  ? 'bg-[#14316B] text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              Year {yr} ({yr === 1 ? 'NQF 5' : yr === 2 ? 'NQF 6' : currentProgramme === 'DIT' ? 'NQF 6' : 'NQF 7'})
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Year {selectedYear} Total Credits: <strong className="text-[#14316B] dark:text-white tabular-nums">{totalYearCredits}</strong>
        </span>
      </div>

      {/* Module Cards: Semester 1 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-heading uppercase font-bold tracking-wider text-[#14316B] dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3FA7B8]" />
            <span>Semester 1 Modules ({sem1Modules.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sem1Modules.map((mod) => {
            const linkedChallenge = challenges.find((c) => c.moduleCode === mod.code || mod.code.startsWith(c.moduleCode.slice(0, 4)));
            const isDone = linkedChallenge && completedChallengeIds.includes(linkedChallenge.id);
            const status = getModuleStatus(!!isDone, !!linkedChallenge);
            const progress = isDone ? 100 : linkedChallenge ? 40 : 0;

            return (
              <div
                key={mod.code}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                {/* Card Top: Code, Progress Ring, and Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#14316B] dark:text-[#3FA7B8]">
                        {mod.code}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${status.bg}`}>
                        {status.label}
                      </span>
                    </div>

                    <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-snug">
                      {mod.name}
                    </h3>

                    {mod.isElective && (
                      <span className="text-[10px] text-[#55305A] dark:text-purple-400 font-semibold block">
                        Elective: {mod.specialisation}
                      </span>
                    )}
                  </div>

                  {renderProgressRing(progress, isDone ? '#10b981' : '#1C56A8')}
                </div>

                {/* Module Metadata chips */}
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>NQF Level {mod.nqfLevel}</span>
                  <span>·</span>
                  <span className="font-bold text-[#1C56A8] dark:text-[#3FA7B8]">{mod.credits} Credits</span>
                  {mod.badgePartner && (
                    <>
                      <span>·</span>
                      <span className="text-amber-600 font-bold">{mod.badgePartner}</span>
                    </>
                  )}
                </div>

                {/* Action Grid (Learn/Play/Prove, Teach-Back Kodi, Source Vault, Exam Sim) */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {linkedChallenge ? (
                    <button
                      onClick={() => onSelectChallenge(linkedChallenge)}
                      className="py-2 px-3 bg-[#1C56A8] hover:bg-[#14316B] text-white text-[11px] font-heading uppercase font-bold tracking-wider rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#3FA7B8]" />
                      <span>{isDone ? 'Review Quest' : 'Practice Quest'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenExamSimulator(mod.code, mod.name)}
                      className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[#14316B] dark:text-slate-200 text-[11px] font-heading uppercase font-bold tracking-wider rounded-xl transition-colors"
                    >
                      Syllabus Drill
                    </button>
                  )}

                  <button
                    onClick={() => onOpenTeachBack(mod.code, mod.name)}
                    className="py-2 px-3 bg-[#DCEBF3] dark:bg-slate-800 hover:bg-[#3FA7B8] hover:text-white text-[#14316B] dark:text-slate-200 text-[11px] font-heading uppercase font-bold tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1"
                    title="Feynman Teach-Back with Kodi mascot"
                  >
                    <span>🦊 Teach-Back</span>
                  </button>

                  <button
                    onClick={() => onOpenSourceVault(mod.code, mod.name)}
                    className="py-2 px-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1"
                    title="Upload notes or search study guides"
                  >
                    <FileText className="w-3 h-3 text-[#3FA7B8]" />
                    <span>Source Vault</span>
                  </button>

                  <button
                    onClick={() => onOpenExamSimulator(mod.code, mod.name)}
                    className="py-2 px-3 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 text-[#E24B3C] text-[11px] font-heading uppercase font-bold tracking-wider rounded-xl border border-rose-300 dark:border-rose-800 flex items-center justify-center gap-1"
                    title="Simulate 40/60 exam paper"
                  >
                    <Award className="w-3 h-3" />
                    <span>Exam Sim</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Module Cards: Semester 2 */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-heading uppercase font-bold tracking-wider text-[#14316B] dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1C56A8]" />
            <span>Semester 2 Modules ({sem2Modules.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sem2Modules.map((mod) => {
            const linkedChallenge = challenges.find((c) => c.moduleCode === mod.code || mod.code.startsWith(c.moduleCode.slice(0, 4)));
            const isDone = linkedChallenge && completedChallengeIds.includes(linkedChallenge.id);
            const status = getModuleStatus(!!isDone, !!linkedChallenge);
            const progress = isDone ? 100 : linkedChallenge ? 40 : 0;

            return (
              <div
                key={mod.code}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                {/* Card Top: Code, Progress Ring, and Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#14316B] dark:text-[#3FA7B8]">
                        {mod.code}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${status.bg}`}>
                        {status.label}
                      </span>
                    </div>

                    <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-snug">
                      {mod.name}
                    </h3>

                    {mod.isElective && (
                      <span className="text-[10px] text-[#55305A] dark:text-purple-400 font-semibold block">
                        Elective: {mod.specialisation}
                      </span>
                    )}
                  </div>

                  {renderProgressRing(progress, isDone ? '#10b981' : '#1C56A8')}
                </div>

                {/* Module Metadata chips */}
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>NQF Level {mod.nqfLevel}</span>
                  <span>·</span>
                  <span className="font-bold text-[#1C56A8] dark:text-[#3FA7B8]">{mod.credits} Credits</span>
                  {mod.badgePartner && (
                    <>
                      <span>·</span>
                      <span className="text-amber-600 font-bold">{mod.badgePartner}</span>
                    </>
                  )}
                </div>

                {/* Action Grid */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {linkedChallenge ? (
                    <button
                      onClick={() => onSelectChallenge(linkedChallenge)}
                      className="py-2 px-3 bg-[#1C56A8] hover:bg-[#14316B] text-white text-[11px] font-heading uppercase font-bold tracking-wider rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#3FA7B8]" />
                      <span>{isDone ? 'Review Quest' : 'Practice Quest'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenExamSimulator(mod.code, mod.name)}
                      className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[#14316B] dark:text-slate-200 text-[11px] font-heading uppercase font-bold tracking-wider rounded-xl transition-colors"
                    >
                      Syllabus Drill
                    </button>
                  )}

                  <button
                    onClick={() => onOpenTeachBack(mod.code, mod.name)}
                    className="py-2 px-3 bg-[#DCEBF3] dark:bg-slate-800 hover:bg-[#3FA7B8] hover:text-white text-[#14316B] dark:text-slate-200 text-[11px] font-heading uppercase font-bold tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1"
                    title="Feynman Teach-Back with Kodi mascot"
                  >
                    <span>🦊 Teach-Back</span>
                  </button>

                  <button
                    onClick={() => onOpenSourceVault(mod.code, mod.name)}
                    className="py-2 px-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1"
                    title="Upload notes or search study guides"
                  >
                    <FileText className="w-3 h-3 text-[#3FA7B8]" />
                    <span>Source Vault</span>
                  </button>

                  <button
                    onClick={() => onOpenExamSimulator(mod.code, mod.name)}
                    className="py-2 px-3 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 text-[#E24B3C] text-[11px] font-heading uppercase font-bold tracking-wider rounded-xl border border-rose-300 dark:border-rose-800 flex items-center justify-center gap-1"
                    title="Simulate 40/60 exam paper"
                  >
                    <Award className="w-3 h-3" />
                    <span>Exam Sim</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
