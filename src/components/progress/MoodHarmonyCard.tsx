import React from 'react';
import { Heart, Sparkles, BookHeart, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../common/Card';
import { JournalEntry, JournalMood } from '../../types';
import { MOOD_OPTIONS } from '../../data/initialJournal';
import { useApp } from '../../context/AppContext';

interface MoodHarmonyCardProps {
  entries: JournalEntry[];
}

export const MoodHarmonyCard: React.FC<MoodHarmonyCardProps> = ({ entries }) => {
  const { currentTheme, isDark, themeSymbol } = useTheme();
  const { setActiveTab } = useApp();

  // Aggregate mood counts
  const moodCounts: Record<JournalMood, number> = {
    happy: 0,
    loved: 0,
    calm: 0,
    okay: 0,
    sad: 0,
    stressed: 0,
    excited: 0,
  };

  entries.forEach(entry => {
    if (moodCounts[entry.mood] !== undefined) {
      moodCounts[entry.mood]++;
    }
  });

  const totalReflections = entries.length;

  return (
    <Card className="p-5 sm:p-6 border-slate-200/70 dark:border-slate-800/80 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>{themeSymbol}</span>
            <span>Mood & Emotional Harmony</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Emotional wellness distribution from your private journal reflections.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('journal')}
          className="text-xs font-semibold flex items-center gap-1 transition-all hover:gap-1.5 cursor-pointer"
          style={{ color: currentTheme.accentColor }}
        >
          <span>Open Journal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mood Pills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {MOOD_OPTIONS.map(mood => {
          const count = moodCounts[mood.id] || 0;
          const percentage = totalReflections > 0 ? Math.round((count / totalReflections) * 100) : 0;

          return (
            <div
              key={mood.id}
              className={`p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50/70 border-slate-200/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{mood.emoji}</span>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: isDark ? mood.bgDark : mood.bgLight,
                    color: mood.color,
                  }}
                >
                  {count} logs
                </span>
              </div>
              <div className="mt-2">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {mood.label}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">{percentage}% frequency</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comforting Affirmation Strip */}
      <div
        className="p-4 rounded-2xl border flex items-start gap-3 transition-colors"
        style={{
          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.4)' : `${currentTheme.primaryColor}10`,
          borderColor: isDark ? 'rgba(51, 65, 85, 0.5)' : `${currentTheme.primaryColor}30`,
        }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm shadow-xs"
          style={{
            backgroundColor: `${currentTheme.primaryColor}25`,
            color: currentTheme.accentColor,
          }}
        >
          <Heart className="w-4 h-4" />
        </div>
        <div className="space-y-0.5">
          <h5 className="font-semibold text-xs text-slate-800 dark:text-slate-200 font-serif">
            Mindful Affirmation
          </h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
            "Your emotions are gentle waves. Whether calm, tired, or celebratory, you are safe to feel
            them all and return to your peaceful center."
          </p>
        </div>
      </div>
    </Card>
  );
};
