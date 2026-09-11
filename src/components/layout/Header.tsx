import React, { useState, useEffect } from 'react';
import { Lock, Sparkles, Flame, Moon, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

export const Header: React.FC = () => {
  const { userProfile, setIsLocked, setActiveTab } = useApp();
  const { currentTheme, isDark, themeSymbol } = useTheme();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return { text: 'Good Morning', icon: '☀️' };
    if (hour >= 12 && hour < 17) return { text: 'Good Afternoon', icon: '🌤️' };
    if (hour >= 17 && hour < 21) return { text: 'Good Evening', icon: '🌙' };
    return { text: 'Good Night', icon: '✨' };
  };

  const greeting = getGreeting();

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <header className="w-full pb-6 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Personalized Greeting and Date */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-serif text-slate-900 dark:text-slate-50">
              {greeting.text}, {userProfile.name} {themeSymbol}
            </h1>
            <span className="text-xl sm:text-2xl select-none">{greeting.icon}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium flex items-center gap-2">
            <span>{formattedDate}</span>
            <span className="inline-block w-1 h-1 rounded-full bg-slate-400" />
            <span className="font-mono text-xs">{formattedTime}</span>
          </p>
          {userProfile.greetingCustom && (
            <p className="text-xs text-slate-400 dark:text-slate-400 italic mt-0.5 font-serif">
              "{userProfile.greetingCustom}"
            </p>
          )}
        </div>

        {/* Quick controls bar */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Theme Quick Switcher Pill */}
          <button
            onClick={() => setActiveTab('themes')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-2xs ${
              isDark
                ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                : 'bg-white border-slate-200/80 text-slate-700'
            }`}
            title="Change aesthetic theme"
          >
            <span className="text-sm">{currentTheme.icon}</span>
            <span className="hidden sm:inline">{currentTheme.name}</span>
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: currentTheme.primaryColor }}
            />
          </button>

          {/* Streak indicator badge */}
          <div
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border shadow-2xs ${
              isDark
                ? 'bg-amber-950/30 border-amber-800/40 text-amber-300'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{userProfile.streakDays}d Streak</span>
          </div>

          {/* Quick Lock Button */}
          <button
            onClick={() => setIsLocked(true)}
            className={`p-2 rounded-full border transition-all hover:scale-105 active:scale-95 shadow-2xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}
            title="Lock My Little World"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
