import React, { useState } from 'react';
import { LeaderboardUser, CampusName, ProgrammeId } from '../types';
import { CAMPUS_METADATA } from '../data/richfieldCurriculum';
import { Trophy, Medal, Flame, Search, Filter, Users, Building2, Heart, GraduationCap } from 'lucide-react';
import { fireSuccessConfetti } from '../utils/confetti';

interface LeaderboardViewProps {
  leaderboard: LeaderboardUser[];
  currentUserHandle: string;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  leaderboard,
  currentUserHandle
}) => {
  const [programmeFilter, setProgrammeFilter] = useState<'all' | ProgrammeId>('all');
  const [campusFilter, setCampusFilter] = useState<'all' | CampusName>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cheeredUsers, setCheeredUsers] = useState<Record<string, number>>({});

  const handleCheer = (userId: string) => {
    fireSuccessConfetti();
    setCheeredUsers((prev) => ({
      ...prev,
      [userId]: (prev[userId] || 0) + 1
    }));
  };

  const filtered = leaderboard.filter((user) => {
    const matchesProg = programmeFilter === 'all' || user.programme === programmeFilter;
    const matchesCampus = campusFilter === 'all' || user.campus === campusFilter;
    const matchesSearch = searchQuery === '' ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.campus.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProg && matchesCampus && matchesSearch;
  });

  // Calculate Campus Stats for community engagement
  const campusScores = leaderboard.reduce((acc, user) => {
    acc[user.campus] = (acc[user.campus] || 0) + user.points;
    return acc;
  }, {} as Record<CampusName, number>);

  const sortedCampuses = (Object.entries(campusScores) as [CampusName, number][]).sort((a, b) => b[1] - a[1]);
  const topThree = filtered.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Top Header Banner with Richfield Navy/Teal Styling */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1C56A8] dark:text-[#3FA7B8] uppercase tracking-wider mb-1">
            <span>Richfield Student Community</span>
            <span aria-hidden="true">·</span>
            <span>All 8 Campuses + Distance Learning</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading uppercase font-bold text-[#14316B] dark:text-white tracking-tight">
            Global Faculty of IT Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Climb the national leaderboard across DIT and BSc IT programmes by passing Learn, Play, and Prove stages.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#DCEBF3]/60 dark:bg-slate-900 border border-[#3FA7B8]/30 px-3.5 py-2.5 rounded-xl text-xs text-[#14316B] dark:text-slate-200">
          <Users className="w-4 h-4 text-[#3FA7B8]" />
          <span>Active Challengers: <strong className="tabular-nums">{leaderboard.length} enrolled</strong></span>
        </div>
      </div>

      {/* Campus Championship Standings (Using exact prospectus campus colors) */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#14316B] dark:text-white uppercase tracking-wider">
          <span className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#3FA7B8]" />
            <span>Campus Leaderboard Standings</span>
          </span>
          <span className="text-slate-400 font-normal">Cumulative XP</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {sortedCampuses.map(([campus, score], idx) => {
            const meta = CAMPUS_METADATA[campus];
            return (
              <div
                key={campus}
                className={`p-2 rounded-xl border text-center transition-transform hover:scale-105 ${meta?.bgClass || 'bg-slate-100 border-slate-200'}`}
              >
                <span className={`text-[10px] font-bold uppercase block truncate ${meta?.textClass || 'text-slate-700'}`}>
                  {campus}
                </span>
                <span className="text-xs font-black font-heading tabular-nums text-[#14316B] dark:text-white block">
                  {score.toLocaleString()} XP
                </span>
                <span className="text-[10px] text-slate-500 font-mono">#{idx + 1}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 3 Podium (Gold, Silver, Bronze) */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Rank 2 (Silver) */}
          <div className="order-2 md:order-1 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center text-xl mb-2">
              🥈
            </div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Rank #2</span>
            <h3 className="text-base font-bold text-[#14316B] dark:text-white mt-1">{topThree[1].name}</h3>
            <span className="text-xs text-slate-500 font-mono">@{topThree[1].handle}</span>

            <div className="mt-3 py-1 px-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs flex items-center gap-2">
              <span className={CAMPUS_METADATA[topThree[1].campus]?.textClass || 'text-slate-700'}>
                {topThree[1].campus}
              </span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-[#1C56A8] dark:text-[#3FA7B8] font-semibold">{topThree[1].programme}</span>
            </div>

            <div className="mt-4 text-xl font-heading font-black text-[#14316B] dark:text-white tabular-nums">
              {topThree[1].points.toLocaleString()} <span className="text-xs text-slate-400 font-normal">XP</span>
            </div>

            <button
              onClick={() => handleCheer(topThree[1].id)}
              className="mt-3 flex items-center gap-1.5 text-xs text-[#E24B3C] hover:opacity-80 transition-opacity"
            >
              <Heart className="w-3.5 h-3.5 fill-[#E24B3C]/20" />
              <span>Cheer {cheeredUsers[topThree[1].id] ? `(${cheeredUsers[topThree[1].id]})` : ''}</span>
            </button>
          </div>

          {/* Rank 1 (Gold - Elevated Center) */}
          <div className="order-1 md:order-2 p-6 bg-gradient-to-b from-[#DCEBF3] via-white to-white dark:from-slate-800 dark:to-slate-900 border-2 border-[#1C56A8] dark:border-[#3FA7B8] rounded-2xl flex flex-col items-center text-center shadow-lg relative">
            <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/40 border-2 border-amber-400 flex items-center justify-center text-2xl mb-2 shadow">
              👑
            </div>
            <span className="text-[11px] uppercase tracking-wider text-[#1C56A8] dark:text-[#3FA7B8] font-bold">
              1st Place · Campus Champion
            </span>
            <h3 className="text-lg font-extrabold text-[#14316B] dark:text-white mt-1">{topThree[0].name}</h3>
            <span className="text-xs text-slate-500 font-mono">@{topThree[0].handle}</span>

            <div className="mt-3 py-1 px-3 bg-white dark:bg-slate-950 rounded-lg text-xs flex items-center gap-2 border border-slate-200 dark:border-slate-800">
              <span className={CAMPUS_METADATA[topThree[0].campus]?.textClass || 'text-slate-700'}>
                {topThree[0].campus} Campus
              </span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-[#1C56A8] dark:text-[#3FA7B8] font-bold">{topThree[0].programme}</span>
            </div>

            <div className="mt-4 text-2xl font-heading font-black text-[#1C56A8] dark:text-[#3FA7B8] tabular-nums">
              {topThree[0].points.toLocaleString()} <span className="text-xs text-slate-500 font-normal">XP</span>
            </div>

            <button
              onClick={() => handleCheer(topThree[0].id)}
              className="mt-3 flex items-center gap-1.5 text-xs text-[#E24B3C] hover:opacity-80 transition-opacity"
            >
              <Heart className="w-3.5 h-3.5 fill-[#E24B3C]/20" />
              <span>Cheer Champion {cheeredUsers[topThree[0].id] ? `(${cheeredUsers[topThree[0].id]})` : ''}</span>
            </button>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="order-3 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-amber-700/60 flex items-center justify-center text-xl mb-2">
              🥉
            </div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Rank #3</span>
            <h3 className="text-base font-bold text-[#14316B] dark:text-white mt-1">{topThree[2].name}</h3>
            <span className="text-xs text-slate-500 font-mono">@{topThree[2].handle}</span>

            <div className="mt-3 py-1 px-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs flex items-center gap-2">
              <span className={CAMPUS_METADATA[topThree[2].campus]?.textClass || 'text-slate-700'}>
                {topThree[2].campus}
              </span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-[#1C56A8] dark:text-[#3FA7B8] font-semibold">{topThree[2].programme}</span>
            </div>

            <div className="mt-4 text-xl font-heading font-black text-[#14316B] dark:text-white tabular-nums">
              {topThree[2].points.toLocaleString()} <span className="text-xs text-slate-400 font-normal">XP</span>
            </div>

            <button
              onClick={() => handleCheer(topThree[2].id)}
              className="mt-3 flex items-center gap-1.5 text-xs text-[#E24B3C] hover:opacity-80 transition-opacity"
            >
              <Heart className="w-3.5 h-3.5 fill-[#E24B3C]/20" />
              <span>Cheer {cheeredUsers[topThree[2].id] ? `(${cheeredUsers[topThree[2].id]})` : ''}</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, handle, or campus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#1C56A8]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Programme Filter */}
          <select
            value={programmeFilter}
            onChange={(e) => setProgrammeFilter(e.target.value as any)}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 rounded-lg px-3 py-2"
          >
            <option value="all">All Programmes</option>
            <option value="DIT">DIT (SAQA 88322)</option>
            <option value="BSc_IT">BSc IT (SAQA 122369)</option>
          </select>

          {/* Campus Filter */}
          <select
            value={campusFilter}
            onChange={(e) => setCampusFilter(e.target.value as any)}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 rounded-lg px-3 py-2"
          >
            <option value="all">All 8 Campuses + Distance</option>
            {Object.keys(CAMPUS_METADATA).map((camp) => (
              <option key={camp} value={camp}>{camp}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#14316B] text-white text-[11px] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 text-center w-16">Rank</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Campus Chip</th>
                <th className="py-3 px-4">Programme & Stream</th>
                <th className="py-3 px-4 text-center">Quests Solved</th>
                <th className="py-3 px-4 text-center">Streak</th>
                <th className="py-3 px-4 text-right">Total XP</th>
                <th className="py-3 px-4 text-center">Cheer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((user) => {
                const isCurrentUser = user.handle === currentUserHandle;
                const meta = CAMPUS_METADATA[user.campus];

                return (
                  <tr
                    key={user.id}
                    className={`transition-colors ${
                      isCurrentUser
                        ? 'bg-[#DCEBF3]/60 dark:bg-slate-800/80 font-bold text-[#14316B] dark:text-white'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <td className="py-3 px-4 text-center font-bold font-mono">
                      {user.rank === 1 && '🥇 #1'}
                      {user.rank === 2 && '🥈 #2'}
                      {user.rank === 3 && '🥉 #3'}
                      {user.rank > 3 && `#${user.rank}`}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#1C56A8] text-white font-bold flex items-center justify-center text-xs">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#14316B] dark:text-white">{user.name}</span>
                            {isCurrentUser && (
                              <span className="text-[10px] bg-[#E24B3C] text-white px-1.5 py-0.2 rounded font-semibold">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">@{user.handle}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1 ${meta?.bgClass || 'bg-slate-100'}`}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta?.color }} />
                        <span className={meta?.textClass || 'text-slate-700'}>{user.campus}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#1C56A8] dark:text-[#3FA7B8]">{user.programme}</span>
                      <span className="text-slate-400"> · {user.stream}</span>
                    </td>

                    <td className="py-3 px-4 text-center font-mono tabular-nums">
                      {user.challengesSolved}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-orange-500 font-bold tabular-nums">
                        <Flame className="w-3.5 h-3.5 fill-orange-500/20" />
                        {user.streakDays}d
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-black font-heading text-base text-[#14316B] dark:text-white tabular-nums">
                      {user.points.toLocaleString()} XP
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleCheer(user.id)}
                        className="p-1.5 text-slate-400 hover:text-[#E24B3C] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Cheer classmate"
                      >
                        <Heart className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Transparent Disclosure Notice */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-500 flex items-center justify-center gap-2">
          <GraduationCap className="w-3.5 h-3.5 text-[#3FA7B8]" />
          <span>
            <strong>Academic Disclosure:</strong> Leaderboard ranks reflect simulated peer cohort benchmarks across Richfield&apos;s 8 national campuses and Distance Learning to motivate consistent study habits.
          </span>
        </div>
      </div>
    </div>
  );
};
