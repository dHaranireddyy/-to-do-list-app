import React, { useState } from 'react';
import {
  Home,
  Clock,
  BookOpen,
  CheckSquare,
  Sparkles,
  BarChart3,
  Palette,
  Settings,
  Lock,
  ChevronLeft,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { NavigationTab } from '../../types';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, userProfile, setIsLocked } = useApp();
  const { currentTheme, isDark, themeSymbol, themeIcon } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  const mainNavItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'clock', label: 'Clock', icon: <Clock className="w-4 h-4" /> },
    { id: 'journal', label: 'Daily Journal', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'todo', label: 'To-Do List', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'dreams', label: 'Dreams & Goals', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'progress', label: 'Progress', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const secondaryNavItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'themes', label: 'Themes', icon: <Palette className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'lock', label: 'Lock World', icon: <Lock className="w-4 h-4" /> },
  ];

  const handleNavClick = (id: NavigationTab) => {
    if (id === 'lock') {
      setIsLocked(true);
    } else {
      setActiveTab(id);
    }
  };

  return (
    <aside
      className={`hidden md:flex flex-col border-r transition-all duration-300 select-none z-30 sticky top-0 h-screen ${
        collapsed ? 'w-20' : 'w-64'
      } ${
        isDark
          ? 'bg-slate-900/90 border-slate-800/80 text-slate-200'
          : 'bg-white/80 border-slate-200/70 text-slate-700 backdrop-blur-lg'
      }`}
    >
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-inherit">
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer overflow-hidden group"
          title="My Little World"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm transition-transform duration-300 group-hover:scale-105 shrink-0"
            style={{
              background: isDark
                ? 'rgba(99, 102, 241, 0.2)'
                : `linear-gradient(135deg, ${currentTheme.primaryColor}20, ${currentTheme.secondaryColor}30)`,
              color: currentTheme.accentColor,
            }}
          >
            <span>{themeIcon}</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-base tracking-tight flex items-center gap-0.5">
                <span className="font-serif">My Little World</span>
                <span style={{ color: currentTheme.accentColor }}>♡</span>
              </span>
              <span className={`text-[11px] font-medium tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Personal Sanctuary
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ${
            collapsed ? 'mx-auto mt-2' : ''
          }`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Daily Life
          </div>
        )}
        {mainNavItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? isDark
                    ? 'bg-indigo-600/20 text-indigo-300 font-semibold shadow-inner'
                    : 'font-semibold shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
              style={
                isActive && !isDark
                  ? {
                      backgroundColor: `${currentTheme.primaryColor}18`,
                      color: currentTheme.accentColor,
                    }
                  : undefined
              }
              title={collapsed ? item.label : undefined}
            >
              <div
                className={`transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'scale-110' : ''
                }`}
                style={isActive && !isDark ? { color: currentTheme.accentColor } : undefined}
              >
                {item.icon}
              </div>
              {!collapsed && <span>{item.label}</span>}
              {isActive && (
                <div
                  className="absolute right-2 w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: isDark ? '#A5B4FC' : currentTheme.accentColor,
                  }}
                />
              )}
            </button>
          );
        })}

        <div className="pt-4 pb-1">
          <div className="h-px bg-slate-200/60 dark:bg-slate-800/80 mx-2" />
        </div>

        {!collapsed && (
          <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Customize & Safety
          </div>
        )}
        {secondaryNavItems.map(item => {
          const isActive = activeTab === item.id && item.id !== 'lock';
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? isDark
                    ? 'bg-indigo-600/20 text-indigo-300 font-semibold'
                    : 'font-semibold shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
              style={
                isActive && !isDark
                  ? {
                      backgroundColor: `${currentTheme.primaryColor}18`,
                      color: currentTheme.accentColor,
                    }
                  : undefined
              }
              title={collapsed ? item.label : undefined}
            >
              <div
                className={`transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'scale-110' : ''
                }`}
                style={isActive && !isDark ? { color: currentTheme.accentColor } : undefined}
              >
                {item.icon}
              </div>
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </div>

      {/* User streak mini pill at bottom */}
      {!collapsed ? (
        <div className="p-4 border-t border-inherit">
          <div
            className={`p-3 rounded-xl flex items-center justify-between text-xs transition-colors ${
              isDark ? 'bg-slate-800/60 border border-slate-700/60' : 'bg-slate-50 border border-slate-200/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{userProfile.avatarIcon || '🌸'}</span>
              <div className="flex flex-col">
                <span className="font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                  {userProfile.name}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <Flame className="w-3 h-3 text-amber-500 fill-amber-500 inline" />
                  {userProfile.streakDays} Day Streak
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsLocked(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title="Lock Screen"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 border-t border-inherit flex flex-col items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-xs"
            title={`${userProfile.name} (${userProfile.streakDays} day streak)`}
          >
            {userProfile.avatarIcon}
          </div>
          <button
            onClick={() => setIsLocked(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200"
            title="Lock"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  );
};
