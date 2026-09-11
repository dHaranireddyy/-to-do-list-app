import React from 'react';
import { Sparkles, Heart, Trophy, Coffee, CheckCircle2, Music } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { playCelebrationChime } from '../../utils/sound';

interface CelebrationCardProps {
  onAddNewTask: () => void;
  totalCompleted: number;
}

export const CelebrationCard: React.FC<CelebrationCardProps> = ({ onAddNewTask, totalCompleted }) => {
  const { currentTheme, isDark, themeSymbol } = useTheme();
  const { userProfile } = useApp();

  return (
    <Card className="p-6 sm:p-8 relative overflow-hidden text-center border-2 border-dashed transition-all animate-fade-in shadow-sm"
      style={{
        borderColor: `${currentTheme.accentColor}60`,
        background: isDark
          ? `radial-gradient(circle at 50% 30%, ${currentTheme.primaryColor}20, rgba(15, 23, 42, 0.95))`
          : `radial-gradient(circle at 50% 30%, ${currentTheme.primaryColor}25, rgba(255, 255, 255, 0.95))`,
      }}
    >
      {/* Floating sparkles background accents */}
      <div className="absolute -top-4 -left-4 text-3xl opacity-40 animate-pulse">🌸</div>
      <div className="absolute top-2 right-4 text-2xl opacity-40 animate-bounce">✨</div>
      <div className="absolute bottom-2 left-8 text-2xl opacity-40 animate-pulse">💐</div>
      <div className="absolute -bottom-2 -right-2 text-3xl opacity-40 animate-bounce">💖</div>

      <div className="max-w-md mx-auto relative z-10 space-y-4">
        {/* Big cute animated trophy / flower icon */}
        <div
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl flex items-center justify-center text-3xl sm:text-4xl shadow-md transform hover:rotate-6 transition-transform cursor-pointer"
          onClick={() => playCelebrationChime()}
          title="Click for celebratory chime!"
          style={{
            backgroundColor: `${currentTheme.primaryColor}30`,
            border: `2px solid ${currentTheme.primaryColor}60`,
          }}
        >
          <span>🏆</span>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2"
            style={{
              backgroundColor: `${currentTheme.primaryColor}20`,
              color: currentTheme.accentColor,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All {totalCompleted} Tasks Accomplished!</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-slate-100">
            You're doing amazing, {userProfile.name} ♡
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Every single responsibility for today has been lovingly checked off. Your dedication and calm persistence are truly inspiring.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
          <span>☕</span>
          <span>Time to brew a sweet cup of tea, stretch, and relax peacefully.</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => playCelebrationChime()}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-slate-700 dark:text-slate-200"
          >
            <Music className="w-3.5 h-3.5 text-purple-500" />
            <span>Play Victory Chime 🔔</span>
          </button>

          <button
            onClick={onAddNewTask}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-xs hover:opacity-95 transition-all flex items-center gap-1.5"
            style={{ backgroundColor: currentTheme.accentColor }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Add Another Task</span>
          </button>
        </div>
      </div>
    </Card>
  );
};
