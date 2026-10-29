import React, { useRef } from 'react';
import {
  Code2,
  Trophy,
  User,
  BookOpen,
  Flame,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Calculator,
  Compass,
  GraduationCap,
  Shield,
  Layers,
  Youtube,
  Zap,
  Download,
  Upload
} from 'lucide-react';
import { UserProfileState, ProgrammeId } from '../types';
import { PROGRAMMES, CAMPUS_METADATA } from '../data/richfieldCurriculum';
import { exportProfileToJson, importProfileFromJson } from '../utils/storage';

export type ActiveNavTab = 'module_map' | 'challenges' | 'video_vault' | 'frameworks' | 'leaderboard' | 'profile';

interface NavigationProps {
  activeTab: ActiveNavTab;
  onTabChange: (tab: ActiveNavTab) => void;
  userProfile: UserProfileState;
  onProgrammeChange: (programme: ProgrammeId) => void;
  onOpenCalculator: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onProfileImported?: (profile: UserProfileState) => void;
  onToast?: (msg: string) => void;
}

export const TopBar: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  userProfile,
  onProgrammeChange,
  onOpenCalculator,
  mobileMenuOpen,
  onToggleMobileMenu,
  isDarkMode,
  onToggleDarkMode,
  onProfileImported,
  onToast
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    importProfileFromJson(
      file,
      (imported) => {
        if (onProfileImported) onProfileImported(imported);
        if (onToast) onToast('Progress backup imported successfully!');
      },
      (errMsg) => {
        if (onToast) onToast(`Import error: ${errMsg}`);
      }
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#14316B] text-white shadow-md border-b border-[#3FA7B8]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Richfield Shield Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => onTabChange('module_map')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-lg bg-white/10 border-2 border-[#3FA7B8] flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-[#3FA7B8] fill-[#3FA7B8]/20" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-heading uppercase text-lg font-bold tracking-wider text-white">
                  RICHFIELD
                </span>
                <span className="text-xs font-bold text-[#3FA7B8] tracking-widest font-heading">
                  DEVQUEST
                </span>
              </div>
              <span className="text-[10px] text-sky-200 block tracking-tight">
                Unofficial Student Study Tool
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Qualification Switcher (DIT vs BSc IT) */}
        <div className="hidden sm:flex items-center p-1 bg-black/20 rounded-xl border border-white/15 text-xs font-bold font-heading uppercase tracking-wider">
          <button
            onClick={() => onProgrammeChange('DIT')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              userProfile.programme === 'DIT'
                ? 'bg-[#3FA7B8] text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>DIT (NQF 6)</span>
          </button>
          <button
            onClick={() => onProgrammeChange('BSc_IT')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              userProfile.programme === 'BSc_IT'
                ? 'bg-[#3FA7B8] text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>BSc IT (NQF 7)</span>
          </button>
        </div>

        {/* Zone 3: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-heading uppercase font-bold tracking-wider text-slate-300">
          <button
            onClick={() => onTabChange('module_map')}
            className={`py-1 transition-colors ${
              activeTab === 'module_map' ? 'text-white border-b-2 border-[#3FA7B8]' : 'hover:text-white'
            }`}
          >
            Module Map
          </button>
          <button
            onClick={() => onTabChange('challenges')}
            className={`py-1 transition-colors ${
              activeTab === 'challenges' ? 'text-white border-b-2 border-[#3FA7B8]' : 'hover:text-white'
            }`}
          >
            Quests
          </button>
          <button
            onClick={() => onTabChange('video_vault')}
            className={`py-1 transition-colors flex items-center gap-1 ${
              activeTab === 'video_vault' ? 'text-white border-b-2 border-[#3FA7B8]' : 'hover:text-white'
            }`}
          >
            <Youtube className="w-3.5 h-3.5 text-rose-400" />
            <span>Video Vault</span>
          </button>
          <button
            onClick={() => onTabChange('frameworks')}
            className={`py-1 transition-colors ${
              activeTab === 'frameworks' ? 'text-white border-b-2 border-[#3FA7B8]' : 'hover:text-white'
            }`}
          >
            Badges
          </button>
          <button
            onClick={() => onTabChange('leaderboard')}
            className={`py-1 transition-colors ${
              activeTab === 'leaderboard' ? 'text-white border-b-2 border-[#3FA7B8]' : 'hover:text-white'
            }`}
          >
            Leaderboard
          </button>
          <button
            onClick={() => onTabChange('profile')}
            className={`py-1 transition-colors ${
              activeTab === 'profile' ? 'text-white border-b-2 border-[#3FA7B8]' : 'hover:text-white'
            }`}
          >
            Profile
          </button>
        </nav>

        {/* Zone 4: Generator Streak, Backup, Mark Calc, and Theme */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* "Keep the Lights On" Streak + Generator Freeze Badge */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-white/10 rounded-xl text-xs font-mono border border-white/10">
            <span
              className="flex items-center gap-1 text-orange-400 font-bold"
              title="Consecutive daily study streak"
            >
              <Flame className="w-3.5 h-3.5 fill-orange-400/30" />
              {userProfile.streakDays}d
            </span>
            <span className="text-white/30">|</span>
            <span
              className="flex items-center gap-1 text-amber-300 font-semibold"
              title="Keep the lights on: Generator fuel tokens protect your streak from load-shedding outages"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>{userProfile.generatorFuel || 2} Fuel</span>
            </span>
            <span className="text-white/30">|</span>
            <span className="text-[#3FA7B8] font-bold tabular-nums">
              {userProfile.totalPoints.toLocaleString()} XP
            </span>
          </div>

          {/* Export / Import Backup JSON */}
          <div className="hidden sm:flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => exportProfileToJson(userProfile)}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg transition-colors"
              title="Export Progress Backup (JSON)"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg transition-colors"
              title="Import Progress Backup (JSON)"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </div>

          {/* Mark Calculator Button */}
          <button
            onClick={onOpenCalculator}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E24B3C] hover:bg-[#c93f31] text-white rounded-xl text-xs font-heading uppercase font-bold tracking-wider shadow transition-colors"
            title="Richfield 40/60 Mark Calculator"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mark Calc</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-xs"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
};

export const Sidebar: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  userProfile,
  onProgrammeChange,
  onOpenCalculator,
  mobileMenuOpen,
  onToggleMobileMenu
}) => {
  const currentProg = PROGRAMMES[userProfile.programme];
  const campusMeta = CAMPUS_METADATA[userProfile.campus];

  const navItems = [
    { id: 'module_map' as ActiveNavTab, label: 'Curriculum & Module Map', icon: Compass, sub: 'Richfield 3-Year Matrix' },
    { id: 'challenges' as ActiveNavTab, label: 'Learn-Play-Prove Quests', icon: Code2, sub: 'Formative & Practical Labs' },
    { id: 'video_vault' as ActiveNavTab, label: 'Richfield Video Vault', icon: Youtube, sub: 'Curated Channel Hub & Checks' },
    { id: 'frameworks' as ActiveNavTab, label: 'Industry Badges', icon: BookOpen, sub: 'AWS, Cisco, IBM, Oracle' },
    { id: 'leaderboard' as ActiveNavTab, label: 'Global Leaderboard', icon: Trophy, sub: '8 Campuses + Distance' },
    { id: 'profile' as ActiveNavTab, label: 'Student Dossier', icon: User, sub: 'Credits & Readiness' }
  ];

  return (
    <>
      {mobileMenuOpen && (
        <div
          onClick={onToggleMobileMenu}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-[#0b1222] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-4 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="space-y-5">
          {/* Active Programme & Campus Status Card */}
          <div className="p-3.5 bg-[#DCEBF3]/60 dark:bg-slate-900 border border-[#3FA7B8]/30 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#1C56A8] dark:text-[#3FA7B8]">
                Registered Programme
              </span>
              <span className="font-mono text-[10px] text-slate-500">NQF {currentProg.nqfLevel}</span>
            </div>

            <div className="font-heading uppercase font-bold text-sm text-[#14316B] dark:text-white">
              {currentProg.name}
            </div>

            {/* Campus Chip with official color */}
            <div className="flex items-center gap-2 pt-1 border-t border-black/5 dark:border-white/10 text-xs">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: campusMeta.color }} />
              <span className="font-semibold text-slate-700 dark:text-slate-300">{userProfile.campus}</span>
              <span className="text-slate-400">·</span>
              <span className="text-[11px] text-slate-500 font-mono">SAQA {currentProg.saqaId}</span>
            </div>
          </div>

          {/* Quick Programme Switcher for Mobile Drawer */}
          <div className="sm:hidden grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg text-xs font-bold font-heading uppercase">
            <button
              onClick={() => onProgrammeChange('DIT')}
              className={`py-1.5 rounded text-center ${userProfile.programme === 'DIT' ? 'bg-[#1C56A8] text-white' : 'text-slate-600'}`}
            >
              DIT
            </button>
            <button
              onClick={() => onProgrammeChange('BSc_IT')}
              className={`py-1.5 rounded text-center ${userProfile.programme === 'BSc_IT' ? 'bg-[#1C56A8] text-white' : 'text-slate-600'}`}
            >
              BSc IT
            </button>
          </div>

          {/* Navigation Items */}
          <div className="space-y-1">
            <span className="text-[10px] font-heading uppercase font-bold tracking-wider text-slate-400 px-2 block mb-1">
              Academic Navigation
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    if (mobileMenuOpen) onToggleMobileMenu();
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors ${
                    isActive
                      ? 'bg-[#1C56A8] text-white font-bold shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-[#DCEBF3]/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#3FA7B8]' : 'text-slate-400'}`} />
                    <div className="text-left">
                      <span className="block">{item.label}</span>
                      <span className={`text-[10px] block ${isActive ? 'text-sky-200' : 'text-slate-400'}`}>
                        {item.sub}
                      </span>
                    </div>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Prospectus Badge & Institutional Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
          <p className="font-heading uppercase font-bold text-[#14316B] dark:text-slate-300">
            Richfield 2027 Prospectus
          </p>
          <p className="text-[10px]">Council on Higher Education Accredited</p>
          <p className="text-[10px] text-[#3FA7B8] font-semibold">
            &ldquo;More than just a degree.&rdquo;
          </p>
        </div>
      </aside>
    </>
  );
};
