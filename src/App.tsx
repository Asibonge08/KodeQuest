import React, { useState, useEffect } from 'react';
import { TopBar, Sidebar, ActiveNavTab } from './components/Navigation';
import { ModuleMapView } from './components/ModuleMapView';
import { ChallengesView } from './components/ChallengesView';
import { VideoVaultView } from './components/VideoVaultView';
import { FrameworksView } from './components/FrameworksView';
import { LeaderboardView } from './components/LeaderboardView';
import { ProfileView } from './components/ProfileView';
import { MarkCalculatorModal } from './components/MarkCalculatorModal';
import { LearnPlayProveModal } from './components/LearnPlayProveModal';
import { TeachBackModal } from './components/TeachBackModal';
import { SourceVaultModal } from './components/SourceVaultModal';
import { ExamSimulatorModal } from './components/ExamSimulatorModal';
import { ALL_CHALLENGES } from './data/challengesData';
import { FRAMEWORK_TRACKS, ALL_BADGES } from './data/mockData';
import { PROGRAMMES } from './data/richfieldCurriculum';
import { UserProfileState, Challenge, LeaderboardUser, ProgrammeId, TeachBackGap } from './types';
import { fireLevelUpConfetti } from './utils/confetti';
import { loadStoredProfile, saveStoredProfile } from './utils/storage';
import { Sparkles, X, Shield, GraduationCap } from 'lucide-react';

const INITIAL_RICHFIELD_USER: UserProfileState = {
  name: 'Alex Dlamini',
  handle: 'alex_dlamini',
  studentId: 'RGI-88322-2026',
  campus: 'Umhlanga',
  programme: 'DIT',
  stream: 'Programming',
  currentYear: 1,
  totalPoints: 1420,
  currentLevel: 5,
  levelProgressXp: 420,
  nextLevelXp: 600,
  streakDays: 7,
  generatorFuel: 2,
  generatorActive: true,
  completedChallengeIds: ['ch-prog-511', 'ch-sql-621'],
  passedPlayStages: ['ch-prog-511', 'ch-sql-621'],
  unlockedBadgeIds: ['b-initiate', 'b-prog-master', 'b-streak-week'],
  weakTopics: ['VLSM Subnet Bit Allocation', 'INVEST Story Acceptance Criteria', 'De Morgan Propositional Logic'],
  teachBackGaps: [
    {
      id: 'gap-init-1',
      moduleCode: 'NET511',
      topic: 'TCP 3-Way Handshake SYN flood mitigation',
      dateAdded: '2026-10-25',
      resolved: false
    },
    {
      id: 'gap-init-2',
      moduleCode: 'DBS621',
      topic: 'Difference between INNER JOIN and LEFT OUTER JOIN with NULLs',
      dateAdded: '2026-10-24',
      resolved: true
    }
  ],
  moduleReadiness: {
    PROG511: { formative: 82, summative: 85, readinessPct: 84 },
    NET511: { formative: 75, summative: 80, readinessPct: 78 },
    DBS621: { formative: 70, summative: 75, readinessPct: 73 }
  },
  examScores: {
    PROG511: { score: 84, maxMarks: 100, date: '2026-10-24', statusText: 'Distinction (First Class)' }
  },
  pointsHistory: [
    { date: '2026-10-25', points: 150, reason: 'Passed DBS621: SQL Enrolment & High Achievers Query' },
    { date: '2026-10-24', points: 120, reason: 'Completed PROG511: 40/60 Assessment Grade Normalizer' },
    { date: '2026-10-22', points: 100, reason: '7-Day Study Streak Milestone' }
  ]
};

const INITIAL_CAMPUS_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    id: 'u-1',
    name: 'Sipho Ndlovu',
    handle: 'sndlovu_it',
    campus: 'Umhlanga',
    programme: 'DIT',
    stream: 'Programming',
    points: 2480,
    challengesSolved: 19,
    streakDays: 14,
    avatarSeed: 'Sipho'
  },
  {
    rank: 2,
    id: 'u-2',
    name: 'Chantelle Van Zyl',
    handle: 'cvzyl_dev',
    campus: 'Bryanston',
    programme: 'DIT',
    stream: 'Network Engineering',
    points: 2190,
    challengesSolved: 17,
    streakDays: 11,
    avatarSeed: 'Chantelle'
  },
  {
    rank: 3,
    id: 'u-3',
    name: 'Amahle Mthembu',
    handle: 'amahle_tech',
    campus: 'Cape Town',
    programme: 'BSc_IT',
    stream: 'Emerging Technologies',
    points: 1940,
    challengesSolved: 15,
    streakDays: 9,
    avatarSeed: 'Amahle'
  },
  {
    rank: 4,
    id: 'u-user',
    name: 'Alex Dlamini',
    handle: 'alex_dlamini',
    campus: 'Umhlanga',
    programme: 'DIT',
    stream: 'Programming',
    points: 1420,
    challengesSolved: 2,
    streakDays: 7,
    avatarSeed: 'Alex',
    isCurrentUser: true
  },
  {
    rank: 5,
    id: 'u-5',
    name: 'Tariq Patel',
    handle: 'tariq_cisco',
    campus: 'Centurion',
    programme: 'BSc_IT',
    stream: 'Network Engineering',
    points: 1380,
    challengesSolved: 10,
    streakDays: 5,
    avatarSeed: 'Tariq'
  },
  {
    rank: 6,
    id: 'u-6',
    name: 'Zanele Khumalo',
    handle: 'zkhumalo_ba',
    campus: 'Pretoria',
    programme: 'DIT',
    stream: 'Business Analysis',
    points: 1210,
    challengesSolved: 8,
    streakDays: 6,
    avatarSeed: 'Zanele'
  },
  {
    rank: 7,
    id: 'u-7',
    name: 'Keagan Pillay',
    handle: 'kpillay_code',
    campus: 'Musgrave',
    programme: 'DIT',
    stream: 'Programming',
    points: 1150,
    challengesSolved: 8,
    streakDays: 4,
    avatarSeed: 'Keagan'
  },
  {
    rank: 8,
    id: 'u-8',
    name: 'Nomsa Sithole',
    handle: 'nsithole_dist',
    campus: 'Distance Learning',
    programme: 'BSc_IT',
    stream: 'IT Management',
    points: 980,
    challengesSolved: 6,
    streakDays: 3,
    avatarSeed: 'Nomsa'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('module_map');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Modals state
  const [isMarkCalcOpen, setIsMarkCalcOpen] = useState(false);
  const [modalChallenge, setModalChallenge] = useState<Challenge | null>(null);
  const [teachBackTarget, setTeachBackTarget] = useState<{ code: string; name: string } | null>(null);
  const [sourceVaultTarget, setSourceVaultTarget] = useState<{ code: string; name: string } | null>(null);
  const [examSimulatorTarget, setExamSimulatorTarget] = useState<{ code: string; name: string } | null>(null);

  // Persistent User Profile State with localStorage
  const [userProfile, setUserProfile] = useState<UserProfileState>(() => loadStoredProfile(INITIAL_RICHFIELD_USER));
  const [challenges] = useState<Challenge[]>(ALL_CHALLENGES);
  const [frameworks] = useState(FRAMEWORK_TRACKS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(INITIAL_CAMPUS_LEADERBOARD);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    saveStoredProfile(userProfile);
  }, [userProfile]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4500);
  };

  const handleProgrammeChange = (newProgramme: ProgrammeId) => {
    const progInfo = PROGRAMMES[newProgramme];
    setUserProfile((prev) => ({
      ...prev,
      programme: newProgramme,
      stream: progInfo.specialisations[0],
      studentId: newProgramme === 'DIT' ? 'RGI-88322-2026' : 'RGI-122369-2026'
    }));

    setLeaderboard((prev) =>
      prev.map((u) => (u.isCurrentUser ? { ...u, programme: newProgramme } : u))
    );

    showNotification(`Switched programme to ${progInfo.name} (${progInfo.saqaId})`);
  };

  const handleAwardXp = (amount: number, reason: string) => {
    const newTotalPoints = userProfile.totalPoints + amount;
    const pointsForLevel = 500;
    const newLevel = Math.floor(newTotalPoints / pointsForLevel) + 1;
    const newProgressXp = newTotalPoints % pointsForLevel;

    const todayStr = new Date().toISOString().split('T')[0];
    const newHistory = [
      { date: todayStr, points: amount, reason },
      ...userProfile.pointsHistory
    ];

    setUserProfile((prev) => ({
      ...prev,
      totalPoints: newTotalPoints,
      currentLevel: newLevel,
      levelProgressXp: newProgressXp,
      pointsHistory: newHistory
    }));

    setLeaderboard((prev) => {
      const updated = prev.map((u) => {
        if (u.isCurrentUser) {
          return { ...u, points: newTotalPoints };
        }
        return u;
      });
      updated.sort((a, b) => b.points - a.points);
      return updated.map((u, idx) => ({ ...u, rank: idx + 1 }));
    });

    if (newLevel > userProfile.currentLevel) {
      fireLevelUpConfetti();
      showNotification(`🎉 LEVEL UP! You reached Level ${newLevel} and earned +${amount} XP!`);
    } else {
      showNotification(`✨ ${reason} (+${amount} XP)`);
    }
  };

  const handleCompleteChallenge = (challengeId: string, earnedPoints: number) => {
    if (userProfile.completedChallengeIds.includes(challengeId)) return;

    const newCompletedIds = [...userProfile.completedChallengeIds, challengeId];
    const challengeObj = challenges.find((c) => c.id === challengeId);
    handleAwardXp(earnedPoints, `Completed quest: ${challengeObj?.title || 'Curriculum Quest'}`);

    setUserProfile((prev) => ({
      ...prev,
      completedChallengeIds: newCompletedIds
    }));

    setLeaderboard((prev) =>
      prev.map((u) => (u.isCurrentUser ? { ...u, challengesSolved: newCompletedIds.length } : u))
    );
  };

  const handleCompleteLesson = (lessonId: string, earnedXp: number) => {
    handleAwardXp(earnedXp, 'Passed industry badge micro-credential lesson');
  };

  const handleAddTeachBackGap = (gap: TeachBackGap) => {
    setUserProfile((prev) => ({
      ...prev,
      teachBackGaps: [gap, ...prev.teachBackGaps]
    }));
    showNotification(`Added "${gap.topic}" to your Spaced Repetition Gap List`);
  };

  const handleRecordExamScore = (
    moduleCode: string,
    formative: number,
    summative: number,
    finalMark: number,
    statusText: string
  ) => {
    const today = new Date().toISOString().split('T')[0];
    setUserProfile((prev) => ({
      ...prev,
      examScores: {
        ...prev.examScores,
        [moduleCode]: { score: finalMark, maxMarks: 100, date: today, statusText }
      },
      moduleReadiness: {
        ...prev.moduleReadiness,
        [moduleCode]: { formative, summative, readinessPct: finalMark }
      }
    }));
    showNotification(`Recorded ${moduleCode} Exam Result: ${finalMark}% (${statusText})`);
  };

  const handleUpdateProfile = (partial: Partial<UserProfileState>) => {
    setUserProfile((prev) => ({
      ...prev,
      ...partial
    }));

    if (partial.campus || partial.programme || partial.stream) {
      setLeaderboard((prev) =>
        prev.map((u) => {
          if (u.isCurrentUser) {
            return {
              ...u,
              campus: partial.campus || u.campus,
              programme: partial.programme || u.programme,
              stream: partial.stream || u.stream
            };
          }
          return u;
        })
      );
    }
    showNotification('Student academic dossier updated successfully.');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${isDarkMode ? 'dark bg-[#0b1222] text-slate-100' : 'bg-slate-50 text-[#14316B]'}`}>
      
      {/* Top Bar with 'DevQuest' title, qualification switcher, and Richfield branding */}
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userProfile={userProfile}
        onProgrammeChange={handleProgrammeChange}
        onOpenCalculator={() => setIsMarkCalcOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onProfileImported={(imported) => setUserProfile(imported)}
        onToast={showNotification}
      />

      {/* Main Container: Sidebar + Viewport Deck */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userProfile={userProfile}
          onProgrammeChange={handleProgrammeChange}
          onOpenCalculator={() => setIsMarkCalcOpen(true)}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen(false)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'module_map' && (
            <ModuleMapView
              currentProgramme={userProfile.programme}
              selectedSpecialisation={userProfile.stream}
              completedChallengeIds={userProfile.completedChallengeIds}
              challenges={challenges}
              onSelectChallenge={(ch) => setModalChallenge(ch)}
              onOpenCalculator={() => setIsMarkCalcOpen(true)}
              onOpenTeachBack={(code, name) => setTeachBackTarget({ code, name })}
              onOpenSourceVault={(code, name) => setSourceVaultTarget({ code, name })}
              onOpenExamSimulator={(code, name) => setExamSimulatorTarget({ code, name })}
            />
          )}

          {activeTab === 'challenges' && (
            <ChallengesView
              challenges={challenges}
              completedIds={userProfile.completedChallengeIds}
              currentProgramme={userProfile.programme}
              onCompleteChallenge={handleCompleteChallenge}
            />
          )}

          {activeTab === 'video_vault' && (
            <VideoVaultView onAwardXp={handleAwardXp} />
          )}

          {activeTab === 'frameworks' && (
            <FrameworksView
              frameworks={frameworks}
              completedLessonIds={userProfile.completedChallengeIds}
              onCompleteLesson={handleCompleteLesson}
            />
          )}

          {activeTab === 'leaderboard' && (
            <LeaderboardView
              leaderboard={leaderboard}
              currentUserHandle={userProfile.handle}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              userProfile={userProfile}
              onUpdateProfile={handleUpdateProfile}
              onOpenCalculator={() => setIsMarkCalcOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Richfield Formative/Summative Mark Calculator Modal */}
      {isMarkCalcOpen && (
        <MarkCalculatorModal onClose={() => setIsMarkCalcOpen(false)} />
      )}

      {/* Challenge Modal (Triggered directly from Module Map or Quests) */}
      {modalChallenge && (
        <LearnPlayProveModal
          challenge={modalChallenge}
          isCompleted={userProfile.completedChallengeIds.includes(modalChallenge.id)}
          onClose={() => setModalChallenge(null)}
          onComplete={handleCompleteChallenge}
        />
      )}

      {/* Feynman Teach-Back Modal (Kodi Mascot) */}
      {teachBackTarget && (
        <TeachBackModal
          moduleCode={teachBackTarget.code}
          moduleName={teachBackTarget.name}
          onClose={() => setTeachBackTarget(null)}
          onAddGap={handleAddTeachBackGap}
          onAwardXp={handleAwardXp}
        />
      )}

      {/* Source Vault Modal (Strict Source Grounding & Flashcards) */}
      {sourceVaultTarget && (
        <SourceVaultModal
          moduleCode={sourceVaultTarget.code}
          moduleName={sourceVaultTarget.name}
          onClose={() => setSourceVaultTarget(null)}
          onAwardXp={handleAwardXp}
        />
      )}

      {/* Exam Simulator Modal (Timed 40/60 Assessment Paper) */}
      {examSimulatorTarget && (
        <ExamSimulatorModal
          moduleCode={examSimulatorTarget.code}
          moduleName={examSimulatorTarget.name}
          onClose={() => setExamSimulatorTarget(null)}
          onRecordScore={handleRecordExamScore}
          onAwardXp={handleAwardXp}
        />
      )}

      {/* Live Achievement Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 bg-[#14316B] text-white border border-[#3FA7B8]/40 rounded-xl shadow-2xl text-xs max-w-md animate-in fade-in slide-in-from-bottom-3 duration-300">
          <Sparkles className="w-5 h-5 text-[#3FA7B8] shrink-0" />
          <span className="flex-1 leading-snug font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 text-slate-300 hover:text-white rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
