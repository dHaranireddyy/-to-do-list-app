import React, { useState } from 'react';
import { Award, Lock, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../common/Card';
import { HabitBadge } from '../../types';
import { playGentleBellChime } from '../../utils/sound';

interface MilestoneBadgesCardProps {
  badges: HabitBadge[];
}

export const MilestoneBadgesCard: React.FC<MilestoneBadgesCardProps> = ({ badges }) => {
  const { currentTheme, isDark, themeSymbol } = useTheme();
  const [selectedBadge, setSelectedBadge] = useState<HabitBadge | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'mindfulness' | 'focus' | 'growth' | 'dreams'>('all');

  const filteredBadges = badges.filter(b => {
    if (activeCategory === 'all') return true;
    return b.category === activeCategory;
  });

  const unlockedCount = badges.filter(b => b.unlocked).length;

  const handleOpenBadge = (b: HabitBadge) => {
    setSelectedBadge(b);
    playGentleBellChime();
  };

  return (
    <Card className="p-5 sm:p-6 border-slate-200/70 dark:border-slate-800/80 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>{themeSymbol}</span>
              <span>Sanctuary Milestone Badges</span>
            </h3>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{
                backgroundColor: `${currentTheme.primaryColor}25`,
                color: currentTheme.accentColor,
              }}
            >
              {unlockedCount} / {badges.length} Unlocked
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Collectible tokens honoring your quiet dedication and daily consistency.
          </p>
        </div>

        {/* Category switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 self-start sm:self-auto flex-wrap gap-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'mindfulness', label: 'Mindful' },
            { id: 'focus', label: 'Focus' },
            { id: 'growth', label: 'Growth' },
            { id: 'dreams', label: 'Dreams' },
          ].map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-700 shadow-xs text-slate-900 dark:text-white'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                style={isActive ? { color: currentTheme.accentColor } : undefined}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {filteredBadges.map(b => (
          <div
            key={b.id}
            onClick={() => handleOpenBadge(b)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
              b.unlocked
                ? isDark
                  ? 'bg-slate-800/60 border-slate-700/80 hover:border-pink-500 hover:shadow-xs'
                  : 'bg-white border-slate-200/90 hover:border-pink-300 hover:shadow-xs'
                : isDark
                ? 'bg-slate-900/30 border-slate-800/40 opacity-60'
                : 'bg-slate-50/50 border-slate-200/40 opacity-70'
            }`}
          >
            <div className="flex items-start justify-between">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-xs transition-transform group-hover:scale-110 ${
                  b.unlocked
                    ? 'bg-gradient-to-br from-pink-100 to-purple-100 dark:from-slate-700 dark:to-slate-800'
                    : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                {b.unlocked ? <span>{b.icon}</span> : <Lock className="w-4 h-4 text-slate-400" />}
              </div>

              {b.unlocked ? (
                <span className="text-emerald-500 text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-slate-400">
                  {b.progress}/{b.maxProgress}
                </span>
              )}
            </div>

            <div className="mt-3">
              <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 font-serif leading-tight">
                {b.title}
              </h4>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {b.description}
              </p>
            </div>

            {/* Subtle progress bar if locked */}
            {!b.unlocked && (
              <div className="mt-2.5 w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.round((b.progress / b.maxProgress) * 100)}%`,
                    backgroundColor: currentTheme.accentColor,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Badge Detail Celebration Dialog */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div
            className={`w-full max-w-sm rounded-3xl p-6 border shadow-2xl space-y-4 relative ${
              isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-pink-100 text-slate-800'
            }`}
          >
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div
                className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-md ${
                  selectedBadge.unlocked
                    ? 'bg-gradient-to-br from-pink-100 via-purple-100 to-amber-100 dark:from-slate-700 dark:to-slate-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {selectedBadge.unlocked ? (
                  <span>{selectedBadge.icon}</span>
                ) : (
                  <Lock className="w-6 h-6 text-slate-400" />
                )}
              </div>

              <div>
                <h4 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
                  {selectedBadge.title}
                </h4>
                <span
                  className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: selectedBadge.unlocked ? '#D1FAE5' : '#F1F5F9',
                    color: selectedBadge.unlocked ? '#047857' : '#64748B',
                  }}
                >
                  {selectedBadge.unlocked ? '✨ Badge Unlocked' : 'In Progress'}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
                {selectedBadge.description}
              </p>

              {/* Requirement Box */}
              <div className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-left space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Requirement
                </span>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {selectedBadge.requirement}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Progress</span>
                  <span className="font-bold">
                    {selectedBadge.progress} / {selectedBadge.maxProgress}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.round((selectedBadge.progress / selectedBadge.maxProgress) * 100))}%`,
                      backgroundColor: currentTheme.accentColor,
                    }}
                  />
                </div>
              </div>

              {selectedBadge.unlockedAt && (
                <span className="text-[11px] text-slate-400">
                  Unlocked on {selectedBadge.unlockedAt}
                </span>
              )}

              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full py-2.5 rounded-2xl text-xs font-semibold text-white shadow-sm transition-all hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: currentTheme.accentColor }}
              >
                Continue Flow
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
