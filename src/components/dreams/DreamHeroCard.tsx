import React from 'react';
import { Sparkles, Plus, Heart, Target, ShoppingBag, ListChecks } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface DreamHeroProps {
  fantasiesCount: number;
  goalsCount: number;
  wishlistSaved: number;
  wishlistTotal: number;
  needsPendingCount: number;
  onOpenAddModal: () => void;
  activeSectionLabel: string;
}

export const DreamHeroCard: React.FC<DreamHeroProps> = ({
  fantasiesCount,
  goalsCount,
  wishlistSaved,
  wishlistTotal,
  needsPendingCount,
  onOpenAddModal,
  activeSectionLabel,
}) => {
  const { currentTheme, isDark } = useTheme();

  const savingsPercentage =
    wishlistTotal > 0 ? Math.min(100, Math.round((wishlistSaved / wishlistTotal) * 100)) : 0;

  return (
    <Card
      className="p-5 sm:p-6 relative overflow-hidden border transition-all duration-300"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)'
          : `linear-gradient(135deg, ${currentTheme.primaryColor}15 0%, ${currentTheme.secondaryColor}25 50%, #FFF 100%)`,
        borderColor: isDark ? 'rgba(51, 65, 85, 0.5)' : `${currentTheme.primaryColor}30`,
      }}
    >
      {/* Background soft ambient glowing circles */}
      <div
        className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: currentTheme.accentColor }}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 shadow-sm"
              style={{
                backgroundColor: isDark ? 'rgba(168, 85, 247, 0.2)' : `${currentTheme.primaryColor}25`,
                color: currentTheme.accentColor,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" /> Stage 5 Active ♡
            </span>
            <Badge variant="primary" icon="✨">
              Dreams & Goals Sanctuary
            </Badge>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-slate-100 leading-tight">
            Your Sweet Ambitions & Vision Board
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
            "Your dreams are gentle seeds waiting for loving consistency. Nurture what brings you peace,
            growth, and quiet joy."
          </p>
        </div>

        {/* Quick Add Action Button */}
        <div className="flex sm:shrink-0 items-center gap-2">
          <button
            id="add-dream-hero-btn"
            onClick={onOpenAddModal}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-md flex items-center justify-center gap-2 transition-transform duration-200 active:scale-95 hover:brightness-105 cursor-pointer"
            style={{ backgroundColor: currentTheme.accentColor }}
          >
            <Plus className="w-4 h-4" />
            <span>Add to {activeSectionLabel}</span>
          </button>
        </div>
      </div>

      {/* Mini Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-800/80">
        <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-pink-100 dark:bg-pink-950/50 text-pink-500 text-sm shrink-0">
            <Heart className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-slate-400 font-medium truncate">Fantasies</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 font-serif">
              {fantasiesCount} visions
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-100 dark:bg-purple-950/50 text-purple-500 text-sm shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-slate-400 font-medium truncate">Goals Active</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 font-serif">
              {goalsCount} targets
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500 text-sm shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-slate-400 font-medium truncate">Wishlist Fund</div>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-serif">
              {savingsPercentage}% saved
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-100 dark:bg-amber-950/50 text-amber-500 text-sm shrink-0">
            <ListChecks className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-slate-400 font-medium truncate">Needs Pending</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 font-serif">
              {needsPendingCount} items
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
