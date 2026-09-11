import React from 'react';
import {
  Home,
  Clock,
  BookOpen,
  CheckSquare,
  Sparkles,
  Menu,
  X,
  BarChart3,
  Palette,
  Settings,
  Lock,
  Flame,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { NavigationTab } from '../../types';

export const MobileNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    mobileMenuOpen,
    setMobileMenuOpen,
    setIsLocked,
    userProfile,
  } = useApp();
  const { currentTheme, isDark, themeSymbol, themeIcon } = useTheme();

  const primaryTabs: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'clock', label: 'Clock', icon: <Clock className="w-5 h-5" /> },
    { id: 'journal', label: 'Journal', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'todo', label: 'To-Do', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'dreams', label: 'Dreams', icon: <Sparkles className="w-5 h-5" /> },
  ];

  const handleSelectTab = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Top App Bar */}
      <header
        className={`md:hidden sticky top-0 z-20 px-4 py-3 flex items-center justify-between border-b backdrop-blur-md transition-colors ${
          isDark
            ? 'bg-slate-900/90 border-slate-800/80 text-slate-100'
            : 'bg-white/85 border-slate-200/70 text-slate-800'
        }`}
      >
        <div
          onClick={() => handleSelectTab('home')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="text-xl">{themeIcon}</span>
          <span className="font-semibold text-base font-serif flex items-center gap-0.5">
            <span>My Little World</span>
            <span style={{ color: currentTheme.accentColor }}>♡</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLocked(true)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
            aria-label="Lock screen"
          >
            <Lock className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile More Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs flex flex-col justify-end transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className={`w-full rounded-t-3xl p-6 pb-24 border-t transition-transform shadow-2xl ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-100'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-1 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto mb-5" />

            {/* Profile summary */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-inherit">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{userProfile.avatarIcon}</span>
                <div>
                  <h4 className="font-semibold text-sm">{userProfile.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                    {userProfile.streakDays} Day Streak
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsLocked(true);
                }}
                className="text-xs px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 text-slate-600 dark:text-slate-300"
              >
                <Lock className="w-3 h-3" />
                <span>Lock</span>
              </button>
            </div>

            {/* Navigation links in drawer */}
            <div className="grid grid-cols-2 gap-2 text-sm font-medium">
              <button
                onClick={() => handleSelectTab('progress')}
                className={`p-3 rounded-2xl flex items-center gap-3 text-left transition-colors ${
                  activeTab === 'progress'
                    ? isDark
                      ? 'bg-indigo-950/60 text-indigo-300'
                      : 'bg-slate-100 text-slate-900 font-semibold'
                    : isDark
                    ? 'hover:bg-slate-800/80 text-slate-300'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-emerald-500" />
                <span>Progress & Stats</span>
              </button>
              <button
                onClick={() => handleSelectTab('themes')}
                className={`p-3 rounded-2xl flex items-center gap-3 text-left transition-colors ${
                  activeTab === 'themes'
                    ? isDark
                      ? 'bg-indigo-950/60 text-indigo-300'
                      : 'bg-slate-100 text-slate-900 font-semibold'
                    : isDark
                    ? 'hover:bg-slate-800/80 text-slate-300'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Palette className="w-4 h-4 text-pink-500" />
                <span>Themes & Style</span>
              </button>
              <button
                onClick={() => handleSelectTab('settings')}
                className={`p-3 rounded-2xl flex items-center gap-3 text-left transition-colors ${
                  activeTab === 'settings'
                    ? isDark
                      ? 'bg-indigo-950/60 text-indigo-300'
                      : 'bg-slate-100 text-slate-900 font-semibold'
                    : isDark
                    ? 'hover:bg-slate-800/80 text-slate-300'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Settings</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsLocked(true);
                }}
                className={`p-3 rounded-2xl flex items-center gap-3 text-left transition-colors ${
                  isDark ? 'hover:bg-slate-800/80 text-slate-300' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Lock className="w-4 h-4 text-amber-500" />
                <span>Lock My World</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-30 px-3 py-2 border-t backdrop-blur-lg transition-colors flex items-center justify-around shadow-lg ${
          isDark
            ? 'bg-slate-900/95 border-slate-800 text-slate-400'
            : 'bg-white/95 border-slate-200/80 text-slate-500'
        }`}
      >
        {primaryTabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? isDark
                    ? 'text-indigo-300 scale-105'
                    : 'scale-105 font-semibold'
                  : 'hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              style={isActive && !isDark ? { color: currentTheme.accentColor } : undefined}
            >
              <div className="relative">
                {tab.icon}
                {isActive && (
                  <span
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: currentTheme.accentColor }}
                  />
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium tracking-tight">{tab.label}</span>
            </button>
          );
        })}

        {/* More button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
            ['progress', 'themes', 'settings'].includes(activeTab)
              ? isDark
                ? 'text-indigo-300 scale-105 font-semibold'
                : 'scale-105 font-semibold'
              : 'hover:text-slate-800 dark:hover:text-slate-200'
          }`}
          style={
            ['progress', 'themes', 'settings'].includes(activeTab) && !isDark
              ? { color: currentTheme.accentColor }
              : undefined
          }
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium tracking-tight">More</span>
        </button>
      </nav>
    </>
  );
};
