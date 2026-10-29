import React, { useState } from 'react';
import { Challenge, DITFocusArea, ProgrammeId } from '../types';
import { FOCUS_AREAS } from '../data/mockData';
import {
  Code2,
  CheckCircle2,
  Clock,
  ChevronRight,
  Search,
  Filter,
  GraduationCap,
  Sparkles,
  Database,
  ShieldAlert,
  Brain,
  RotateCcw
} from 'lucide-react';
import { LearnPlayProveModal } from './LearnPlayProveModal';

interface ChallengesViewProps {
  challenges: Challenge[];
  completedIds: string[];
  currentProgramme: ProgrammeId;
  onCompleteChallenge: (id: string, earnedXp: number) => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({
  challenges,
  completedIds,
  currentProgramme,
  onCompleteChallenge
}) => {
  const [selectedArea, setSelectedArea] = useState<DITFocusArea | 'all'>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);

  // Filter challenges matching the selected filters
  const filtered = challenges.filter((c) => {
    const matchesProg = c.programme === 'BOTH' || c.programme === currentProgramme;
    const matchesArea = selectedArea === 'all' || c.focusArea === selectedArea;
    const matchesYear = selectedYear === 'all' || c.yearLevel === selectedYear;
    const matchesDiff = selectedDifficulty === 'all' || c.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.moduleCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.framework.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProg && matchesArea && matchesYear && matchesDiff && matchesSearch;
  });

  const totalPoints = challenges.reduce((acc, c) => acc + c.points, 0);
  const earnedPoints = challenges
    .filter((c) => completedIds.includes(c.id))
    .reduce((acc, c) => acc + c.points, 0);

  const handleResetFilters = () => {
    setSelectedArea('all');
    setSelectedYear('all');
    setSelectedDifficulty('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* View Header with Split Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1C56A8] dark:text-[#3FA7B8] uppercase tracking-wider mb-1">
            <span>Learn → Play → Prove Quest Architecture</span>
            <span aria-hidden="true">·</span>
            <span>{currentProgramme === 'DIT' ? 'Diploma in IT (SAQA 88322)' : 'BSc in IT (SAQA 122369)'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading uppercase font-bold text-[#14316B] dark:text-white tracking-tight">
            Curriculum Quests & Hands-On Labs
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Each quest features a 2-minute <strong>Learn</strong> concept, an interactive <strong>Play</strong> puzzle that reveals a secret gate code, and a final <strong>Prove</strong> task.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-sm shrink-0">
          <div className="px-3 border-r border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Quests Passed</span>
            <span className="text-base font-black font-heading text-[#14316B] dark:text-white tabular-nums">
              {completedIds.length} / {challenges.length}
            </span>
          </div>
          <div className="px-3 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Earned XP</span>
            <span className="text-base font-black font-heading text-[#E24B3C] tabular-nums">
              {earnedPoints} <span className="text-xs text-slate-400 font-normal">/ {totalPoints}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Focus Area Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedArea('all')}
          className={`px-3.5 py-1.5 text-xs font-heading uppercase font-bold rounded-lg whitespace-nowrap transition-colors ${
            selectedArea === 'all'
              ? 'bg-[#1C56A8] text-white shadow'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white border border-slate-200 dark:border-slate-800'
          }`}
        >
          All Domains
        </button>
        {Object.values(FOCUS_AREAS).map((area) => (
          <button
            key={area.id}
            onClick={() => setSelectedArea(area.id)}
            className={`px-3.5 py-1.5 text-xs font-heading uppercase font-bold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedArea === area.id
                ? 'bg-[#14316B] text-white shadow'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: area.color }} />
            <span>{area.shortLabel}</span>
          </button>
        ))}
      </div>

      {/* Secondary Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search quest by name, module code, or framework..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#1C56A8]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 rounded-lg px-3 py-2"
          >
            <option value="all">All Academic Years</option>
            <option value="Year 1">Year 1</option>
            <option value="Year 2">Year 2</option>
            <option value="Year 3">Year 3</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 rounded-lg px-3 py-2"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Quest Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((quest) => {
          const isDone = completedIds.includes(quest.id);

          return (
            <div
              key={quest.id}
              onClick={() => setActiveChallenge(quest)}
              className={`group flex flex-col justify-between p-5 bg-white dark:bg-slate-900 border rounded-2xl cursor-pointer transition-all hover:shadow-md ${
                isDone
                  ? 'border-emerald-500/40 bg-emerald-50/10'
                  : 'border-slate-200 dark:border-slate-800 hover:border-[#3FA7B8]'
              }`}
            >
              <div>
                {/* Metadata Row */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#1C56A8] dark:text-[#3FA7B8] text-[11px]">
                      {quest.moduleCode}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{quest.yearLevel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{quest.ditCredits} Credits</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={`font-semibold ${
                        quest.difficulty === 'Beginner'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : quest.difficulty === 'Intermediate'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-[#E24B3C]'
                      }`}
                    >
                      {quest.difficulty}
                    </span>
                  </div>

                  {isDone ? (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                    </span>
                  ) : (
                    <span className="font-black font-heading text-sm text-[#E24B3C] tabular-nums">
                      +{quest.points} XP
                    </span>
                  )}
                </div>

                {/* Quest Title */}
                <h3 className="text-base font-bold text-[#14316B] dark:text-white group-hover:text-[#1C56A8] dark:group-hover:text-[#3FA7B8] transition-colors">
                  {quest.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {quest.learn.headline} — {quest.learn.plainEnglishExplanation}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{quest.learn.estimatedMinutes}m loop</span>
                  </span>
                  <span>{quest.framework}</span>
                </div>

                <div className="flex items-center gap-1 font-heading uppercase font-bold text-xs text-[#1C56A8] dark:text-[#3FA7B8] group-hover:translate-x-1 transition-transform">
                  <span>{isDone ? 'Review Quest' : 'Start Quest'}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Never Show Empty Broken Dead-End State */}
      {filtered.length === 0 && (
        <div className="p-10 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
          <Code2 className="w-8 h-8 text-[#3FA7B8] mx-auto" />
          <h4 className="font-heading uppercase font-bold text-base text-[#14316B] dark:text-white">
            No quests match this specific filter combination
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try switching to another focus area or clear your search to explore available DIT & BSc IT quests.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-[#1C56A8] text-white text-xs font-bold font-heading uppercase rounded-lg shadow hover:bg-[#14316B] transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

      {/* 3-Stage Learn -> Play -> Prove Modal */}
      {activeChallenge && (
        <LearnPlayProveModal
          challenge={activeChallenge}
          isCompleted={completedIds.includes(activeChallenge.id)}
          onClose={() => setActiveChallenge(null)}
          onComplete={onCompleteChallenge}
        />
      )}
    </div>
  );
};
