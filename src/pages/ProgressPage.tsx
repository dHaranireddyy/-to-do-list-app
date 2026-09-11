import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Target,
  ShoppingBag,
  ArrowRight,
  Heart,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { ProgressHeroStats } from '../components/progress/ProgressHeroStats';
import { ActivityRhythmChart } from '../components/progress/ActivityRhythmChart';
import { CategoryBreakdownCard } from '../components/progress/CategoryBreakdownCard';
import { MoodHarmonyCard } from '../components/progress/MoodHarmonyCard';
import { MilestoneBadgesCard } from '../components/progress/MilestoneBadgesCard';
import { ManualFocusModal } from '../components/progress/ManualFocusModal';
import {
  computeProgressStats,
  computeCategoryProgress,
  getMergedActivityRecords,
  computeLiveBadges,
} from '../utils/analytics';
import { playCoinChime } from '../utils/sound';

export const ProgressPage: React.FC = () => {
  const { currentTheme, isDark, themeSymbol } = useTheme();
  const { tasks, journalEntries, goals, wishlist, userProfile, setActiveTab } = useApp();

  const [activeDaysRange, setActiveDaysRange] = useState<number>(7);
  const [isFocusModalOpen, setIsFocusModalOpen] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Re-compute stats
  const stats = computeProgressStats(
    tasks,
    journalEntries,
    goals,
    wishlist,
    userProfile.streakDays
  );

  const categoryProgress = computeCategoryProgress(tasks);
  const activityRecords = getMergedActivityRecords(activeDaysRange, tasks, journalEntries);
  const badges = computeLiveBadges(
    tasks,
    journalEntries,
    goals,
    wishlist,
    userProfile.streakDays
  );

  // Compute goals & wishlist summary
  const totalGoals = goals.length;
  const avgGoalProgress =
    totalGoals > 0 ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / totalGoals) : 0;
  const totalWishlistSaved = wishlist.reduce((s, w) => s + (w.savedAmount || 0), 0);
  const totalWishlistTarget = wishlist.reduce((s, w) => s + (w.targetPrice || 0), 0);
  const wishlistProgress =
    totalWishlistTarget > 0 ? Math.round((totalWishlistSaved / totalWishlistTarget) * 100) : 0;

  const handleSessionLogged = () => {
    setRefreshKey(prev => prev + 1);
    playCoinChime();
  };

  return (
    <div key={refreshKey} className="space-y-6 pb-16 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100">
              Personal Growth & Analytics
            </h2>
            <Badge variant="primary" icon={themeSymbol}>
              Stage 6 Complete
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gentle reflections on your habits, consistency, Pomodoro focus, and goals journey.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              setRefreshKey(prev => prev + 1);
              playCoinChime();
            }}
            className="p-2 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-2xs"
            title="Refresh analytics data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. Hero Overview Metric Ribbon */}
      <ProgressHeroStats
        stats={stats}
        userName={userProfile.name}
        onOpenLogFocus={() => setIsFocusModalOpen(true)}
      />

      {/* 2. Interactive Activity Rhythm Bar Chart */}
      <ActivityRhythmChart
        records={activityRecords}
        activeDaysRange={activeDaysRange}
        onChangeRange={setActiveDaysRange}
      />

      {/* 3. Two-Column Analytical Deep Dives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Domain Breakdown & Dreams Momentum */}
        <div className="space-y-6">
          <CategoryBreakdownCard categories={categoryProgress} />

          {/* Dreams & Wishlist Momentum Card */}
          <Card className="p-5 sm:p-6 border-slate-200/70 dark:border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>{themeSymbol}</span>
                  <span>Aspirations & Savings Momentum</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  High-level milestones across active dreams and wishlist items.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('dreams')}
                className="text-xs font-semibold flex items-center gap-1 transition-all hover:gap-1.5 cursor-pointer"
                style={{ color: currentTheme.accentColor }}
              >
                <span>Open Dreams</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-medium">Active Goals</span>
                  <Target className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100">
                  {avgGoalProgress}% <span className="text-xs text-slate-400 font-normal">avg</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-purple-500 transition-all"
                    style={{ width: `${avgGoalProgress}%` }}
                  />
                </div>
                <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium block">
                  {totalGoals} aspirations tracked
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-medium">Wishlist Saved</span>
                  <ShoppingBag className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100">
                  ₹{totalWishlistSaved.toLocaleString()}
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${wishlistProgress}%` }}
                  />
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block">
                  {wishlistProgress}% of ₹{totalWishlistTarget.toLocaleString()} goal
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Mood Harmony & Emotional Balance */}
        <div className="space-y-6">
          <MoodHarmonyCard entries={journalEntries} />

          {/* Gentle Consistency Reflection Card */}
          <Card className="p-5 sm:p-6 border-slate-200/70 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-base">☕</span>
              <h4 className="font-serif font-bold text-sm text-slate-900 dark:text-slate-100">
                Weekly Sanctuary Reflection
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              You have completed <strong className="text-slate-900 dark:text-slate-100">{stats.completedTasks} tasks</strong> and logged{' '}
              <strong className="text-slate-900 dark:text-slate-100">{(stats.weeklyFocusMinutes / 60).toFixed(1)} hours</strong> of
              gentle study focus. Your mind is building sustainable habits without burnout.
            </p>
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
              <span>Rhythm state: Blooming 🌱</span>
              <span>Keep shining, Dharani ♡</span>
            </div>
          </Card>
        </div>
      </div>

      {/* 4. Milestone Badges Sanctuary (Aesthetic Pins) */}
      <MilestoneBadgesCard badges={badges} />

      {/* 5. Manual Focus Logging Modal */}
      <ManualFocusModal
        isOpen={isFocusModalOpen}
        onClose={() => setIsFocusModalOpen(false)}
        onSessionLogged={handleSessionLogged}
      />
    </div>
  );
};
