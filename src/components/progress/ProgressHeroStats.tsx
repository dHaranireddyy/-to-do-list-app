import React from 'react';
import {
  CheckCircle2,
  Timer,
  Flame,
  Sparkles,
  Plus,
  TrendingUp,
  Award,
  HeartHandshake,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../common/Card';
import { ProgressSummaryStats } from '../../utils/analytics';

interface ProgressHeroStatsProps {
  stats: ProgressSummaryStats;
  userName: string;
  onOpenLogFocus: () => void;
}

export const ProgressHeroStats: React.FC<ProgressHeroStatsProps> = ({
  stats,
  userName,
  onOpenLogFocus,
}) => {
  const { currentTheme, isDark, themeSymbol } = useTheme();

  const hoursFocus = (stats.weeklyFocusMinutes / 60).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Aesthetic Banner Card */}
      <div
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-sm transition-all duration-300 ${
          isDark
            ? 'bg-gradient-to-br from-slate-900 via-slate-900/90 to-purple-950/20 border-slate-800'
            : 'bg-gradient-to-br from-pink-50/70 via-white to-purple-50/50 border-pink-200/60'
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌱</span>
              <span
                className="text-xs font-bold uppercase tracking-wider font-sans"
                style={{ color: currentTheme.accentColor }}
              >
                Personal Growth Sanctuary
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-slate-100 leading-tight">
              Gentle progress, {userName} ♡
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Every small action, journal reflection, and focus session is a quiet blossom.
              Honor your pace and celebrate the consistency you are nurturing every single day.
            </p>
          </div>

          {/* Quick Action Button & Composite Score Badge */}
          <div className="flex items-center gap-3 self-start md:self-auto shrink-0 flex-wrap">
            {/* Growth Score Badge */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shadow-xs"
                style={{
                  backgroundColor: `${currentTheme.primaryColor}25`,
                  color: currentTheme.accentColor,
                }}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Growth Index
                </div>
                <div className="text-sm font-bold font-serif text-slate-800 dark:text-slate-100 flex items-center gap-1">
                  <span>{stats.overallGrowthScore}%</span>
                  <span className="text-[10px] font-sans font-medium text-emerald-600 dark:text-emerald-400">
                    Strong Flow
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenLogFocus}
              className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-white shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 hover:brightness-105"
              style={{ backgroundColor: currentTheme.accentColor }}
            >
              <Plus className="w-4 h-4" />
              <span>Log Study Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Tasks Done */}
        <Card className="p-4 space-y-2 border-slate-200/70 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Tasks Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100 flex items-baseline gap-1.5">
            <span>
              {stats.completedTasks} <span className="text-xs text-slate-400 font-normal">/ {stats.totalTasks}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{stats.taskCompletionRate}% completion rate</span>
          </div>
        </Card>

        {/* Metric 2: Focus Time */}
        <Card className="p-4 space-y-2 border-slate-200/70 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Focus Time</span>
            <Timer className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100 flex items-baseline gap-1.5">
            <span>{hoursFocus}</span>
            <span className="text-xs text-slate-400 font-normal">Hours This Week</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-rose-600 dark:text-rose-400 font-medium">
            <span>⏱️ {stats.todayFocusSessions} Pomodoro sessions today</span>
          </div>
        </Card>

        {/* Metric 3: Journal Streak */}
        <Card className="p-4 space-y-2 border-slate-200/70 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Mindful Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100 flex items-baseline gap-1.5">
            <span>{stats.journalStreak}</span>
            <span className="text-xs text-slate-400 font-normal">Days In Rhythm</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            <span>📖 {stats.totalJournalEntries} reflections recorded</span>
          </div>
        </Card>

        {/* Metric 4: Dominant Mood */}
        <Card className="p-4 space-y-2 border-slate-200/70 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Emotional Balance</span>
            <span className="text-sm">{stats.dominantMood?.emoji || '😌'}</span>
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100">
            {stats.dominantMood?.label || 'Calm'}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-purple-600 dark:text-purple-400 font-medium">
            <span>✨ Peaceful heart space</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
