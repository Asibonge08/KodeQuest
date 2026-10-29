import React, { useState } from 'react';
import { UserProfileState, Badge, ProgrammeId, CampusName } from '../types';
import { PROGRAMMES, CAMPUS_METADATA } from '../data/richfieldCurriculum';
import { ALL_BADGES } from '../data/mockData';
import { exportProfileToJson } from '../utils/storage';
import {
  GraduationCap,
  Building2,
  Award,
  Flame,
  CheckCircle2,
  Lock,
  RotateCcw,
  Sparkles,
  BookOpen,
  Edit3,
  Calculator,
  ShieldCheck,
  Zap,
  Download,
  CheckSquare,
  Square
} from 'lucide-react';

interface ProfileViewProps {
  userProfile: UserProfileState;
  onUpdateProfile: (updated: Partial<UserProfileState>) => void;
  onOpenCalculator: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  onUpdateProfile,
  onOpenCalculator
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempCampus, setTempCampus] = useState<CampusName>(userProfile.campus);
  const [tempProgramme, setTempProgramme] = useState<ProgrammeId>(userProfile.programme);
  const [tempStream, setTempStream] = useState<string>(userProfile.stream);

  const currentProg = PROGRAMMES[userProfile.programme];
  const campusMeta = CAMPUS_METADATA[userProfile.campus];

  const handleSaveProfile = () => {
    onUpdateProfile({
      campus: tempCampus,
      programme: tempProgramme,
      stream: tempStream
    });
    setIsEditing(false);
  };

  const handleToggleGap = (gapId: string) => {
    const nextGaps = (userProfile.teachBackGaps || []).map((g) =>
      g.id === gapId ? { ...g, resolved: !g.resolved } : g
    );
    onUpdateProfile({ teachBackGaps: nextGaps });
  };

  const unlockedCount = userProfile.unlockedBadgeIds.length;
  const progressPercent = Math.min(100, Math.round((userProfile.levelProgressXp / userProfile.nextLevelXp) * 100));

  const earnedCredits = userProfile.completedChallengeIds.length * 15;
  const creditsPct = Math.min(100, Math.round((earnedCredits / currentProg.totalCredits) * 100));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1C56A8] dark:text-[#3FA7B8] uppercase tracking-wider mb-1">
            <span>Official Student Dossier</span>
            <span aria-hidden="true">·</span>
            <span>SAQA {currentProg.saqaId} · NQF Level {currentProg.nqfLevel}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading uppercase font-bold text-[#14316B] dark:text-white tracking-tight">
            Student Profile & Academic Credentials
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Manage your qualification, elective stream, generator streak protection, and spaced repetition review lists.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportProfileToJson(userProfile)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1C56A8] hover:bg-[#14316B] text-white rounded-lg text-xs font-heading uppercase font-bold tracking-wider shadow transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Progress</span>
          </button>

          <button
            onClick={onOpenCalculator}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#E24B3C] hover:bg-[#c93f31] text-white rounded-lg text-xs font-heading uppercase font-bold tracking-wider shadow transition-colors"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Mark Calculator</span>
          </button>
        </div>
      </div>

      {/* Hero Dossier Card with Richfield Blue/Navy Gradient */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-[#14316B] via-[#1C56A8] to-[#14316B] text-white rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/10 border-2 border-[#3FA7B8] flex items-center justify-center font-heading font-black text-3xl text-white shadow-inner shrink-0">
              {userProfile.name.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-xl md:text-2xl font-heading uppercase font-bold tracking-wide">
                  {userProfile.name}
                </h2>
                <span className="text-xs bg-black/20 border border-white/20 text-[#3FA7B8] px-2 py-0.5 rounded font-mono font-bold">
                  {userProfile.studentId}
                </span>
              </div>
              <p className="text-xs text-sky-200 font-mono">@{userProfile.handle}</p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-sky-100 pt-1">
                <span className="flex items-center gap-1 font-semibold">
                  <GraduationCap className="w-4 h-4 text-[#3FA7B8]" />
                  <span>{currentProg.name}</span>
                </span>
                <span aria-hidden="true" className="text-white/30">·</span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4 text-orange-400" />
                  <span>{userProfile.campus} Campus</span>
                </span>
                <span aria-hidden="true" className="text-white/30">·</span>
                <span className="text-[#3FA7B8] font-bold">Stream: {userProfile.stream}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-white/25 rounded-lg text-xs font-heading uppercase font-bold tracking-wider transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Switch Programme / Campus'}</span>
          </button>
        </div>

        {/* Inline Programme & Campus Editor */}
        {isEditing && (
          <div className="p-4 bg-black/20 border border-white/15 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs animate-in fade-in duration-200">
            <div>
              <label className="block text-sky-200 font-semibold mb-1">Programme</label>
              <select
                value={tempProgramme}
                onChange={(e) => {
                  const newProg = e.target.value as ProgrammeId;
                  setTempProgramme(newProg);
                  setTempStream(PROGRAMMES[newProg].specialisations[0]);
                }}
                className="w-full bg-[#14316B] border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none"
              >
                <option value="DIT">Diploma in IT (SAQA 88322)</option>
                <option value="BSc_IT">BSc in IT (SAQA 122369)</option>
              </select>
            </div>

            <div>
              <label className="block text-sky-200 font-semibold mb-1">Campus</label>
              <select
                value={tempCampus}
                onChange={(e) => setTempCampus(e.target.value as CampusName)}
                className="w-full bg-[#14316B] border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none"
              >
                {Object.keys(CAMPUS_METADATA).map((camp) => (
                  <option key={camp} value={camp}>{camp}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sky-200 font-semibold mb-1">Specialisation Stream</label>
              <select
                value={tempStream}
                onChange={(e) => setTempStream(e.target.value)}
                className="w-full bg-[#14316B] border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none"
              >
                {PROGRAMMES[tempProgramme].specialisations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3 flex justify-end">
              <button
                onClick={handleSaveProfile}
                className="px-6 py-2 bg-[#E24B3C] hover:bg-[#c93f31] text-white font-heading uppercase font-bold tracking-wider rounded-lg shadow"
              >
                Apply Changes
              </button>
            </div>
          </div>
        )}

        {/* Level Progression & Academic Credits Meter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/15">
          {/* Level XP Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-heading uppercase font-bold text-sky-200">
                Level {userProfile.currentLevel} Senior Scholar
              </span>
              <span className="font-mono text-sky-200 tabular-nums">
                {userProfile.levelProgressXp} / {userProfile.nextLevelXp} XP
              </span>
            </div>
            <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-[#3FA7B8] to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Academic SAQA Credits Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-heading uppercase font-bold text-sky-200">
                Curriculum Credits ({currentProg.name})
              </span>
              <span className="font-mono text-sky-200 tabular-nums">
                {earnedCredits} / {currentProg.totalCredits} Credits
              </span>
            </div>
            <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-[#E24B3C] rounded-full transition-all duration-500"
                style={{ width: `${creditsPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* At-a-Glance 4 Stat Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-[#14316B] border border-white/10 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-sky-300 block">Total Experience</span>
            <span className="text-xl font-heading font-black tabular-nums">{userProfile.totalPoints.toLocaleString()} XP</span>
          </div>
          <div className="p-3 bg-[#1C56A8] border border-white/10 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-sky-300 block">Study Streak</span>
            <span className="text-xl font-heading font-black text-orange-300 tabular-nums">{userProfile.streakDays} Days</span>
          </div>
          <div className="p-3 bg-[#3FA7B8] text-white border border-white/10 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-slate-100 block">Generator Defense</span>
            <span className="text-xl font-heading font-black tabular-nums flex items-center justify-center gap-1">
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{userProfile.generatorFuel || 2} Cans</span>
            </span>
          </div>
          <div className="p-3 bg-white text-[#14316B] rounded-xl text-center shadow">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Badges Unlocked</span>
            <span className="text-xl font-heading font-black tabular-nums">{unlockedCount} / {ALL_BADGES.length}</span>
          </div>
        </div>
      </div>

      {/* Spaced Repetition Gap List from Kodi Teach-Back */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-[#3FA7B8]" />
            <h3 className="font-heading uppercase text-sm font-bold text-[#14316B] dark:text-white">
              Spaced Repetition & Feynman Teach-Back Gap List
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {(userProfile.teachBackGaps || []).filter((g) => !g.resolved).length} Pending Review
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          Conceptual gaps automatically identified when explaining topics to mascot Kodi:
        </p>

        <div className="space-y-2 pt-1">
          {(userProfile.teachBackGaps || []).length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center">
              No conceptual gaps yet. Practice a Teach-Back session with Kodi on any module to test your clarity!
            </p>
          ) : (
            userProfile.teachBackGaps.map((gap) => (
              <div
                key={gap.id}
                onClick={() => handleToggleGap(gap.id)}
                className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                  gap.resolved
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 line-through'
                    : 'bg-[#DCEBF3]/40 dark:bg-slate-800/80 border-[#3FA7B8]/30 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {gap.resolved ? (
                    <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span className="font-mono text-[#1C56A8] dark:text-[#3FA7B8] font-bold">
                    [{gap.moduleCode}]
                  </span>
                  <span>{gap.topic}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{gap.dateAdded}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Exam Simulator Outcomes */}
      {userProfile.examScores && Object.keys(userProfile.examScores).length > 0 && (
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading uppercase text-sm font-bold text-[#14316B] dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Summative Exam Simulator Results</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">40/60 Weighting</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(userProfile.examScores).map(([modCode, scoreData]) => (
              <div
                key={modCode}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="font-mono text-[#14316B] dark:text-white">{modCode}</span>
                  <span className="text-sm font-black font-heading text-[#1C56A8] dark:text-[#3FA7B8]">
                    {scoreData.score}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">{scoreData.statusText}</p>
                <span className="text-[10px] text-slate-400 block pt-1 font-mono">{scoreData.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Industry Badges Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading uppercase text-base font-bold text-[#14316B] dark:text-white">
              Richfield Embedded Industry Badges
            </h3>
            <p className="text-xs text-slate-500">
              Co-certified micro-credentials included in curriculum (AWS Academy, Cisco, IBM, Oracle, Fortinet, CIMA).
            </p>
          </div>
          <span className="text-xs font-bold text-[#3FA7B8] tabular-nums">
            {unlockedCount} of {ALL_BADGES.length} Earned
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = userProfile.unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isUnlocked
                    ? 'bg-white dark:bg-slate-900 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{badge.icon}</span>
                    {isUnlocked ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Earned
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Incomplete
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-[#14316B] dark:text-white">{badge.name}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{badge.description}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>{badge.partner || 'Richfield Academy'}</span>
                  {badge.unlockedAt && <span className="font-mono text-slate-400">{badge.unlockedAt}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
