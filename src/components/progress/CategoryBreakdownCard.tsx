import React from 'react';
import { Layers, ArrowRight, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../common/Card';
import { CategoryProgress } from '../../utils/analytics';
import { useApp } from '../../context/AppContext';

interface CategoryBreakdownCardProps {
  categories: CategoryProgress[];
}

export const CategoryBreakdownCard: React.FC<CategoryBreakdownCardProps> = ({ categories }) => {
  const { currentTheme, isDark, themeSymbol } = useTheme();
  const { setActiveTab } = useApp();

  return (
    <Card className="p-5 sm:p-6 border-slate-200/70 dark:border-slate-800/80 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>{themeSymbol}</span>
            <span>Task Domain Distribution</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            How your actions are distributed across college, placement, and personal areas.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('todo')}
          className="text-xs font-semibold flex items-center gap-1 transition-all hover:gap-1.5 cursor-pointer"
          style={{ color: currentTheme.accentColor }}
        >
          <span>Open Tasks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-4">
        {categories.map(cat => (
          <div key={cat.category} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                <span className="text-sm">{cat.emoji}</span>
                <span>{cat.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {cat.completed}/{cat.total}
                </span>
                <span
                  className="px-1.5 py-0.5 rounded-md text-[10px] font-bold"
                  style={{
                    backgroundColor: `${cat.color}20`,
                    color: cat.color,
                  }}
                >
                  {cat.percentage}%
                </span>
              </div>
            </div>

            {/* Custom Progress Bar */}
            <div
              className="w-full h-2 rounded-full overflow-hidden"
              style={{
                backgroundColor: isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)',
              }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${cat.percentage}%`,
                  backgroundColor: cat.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
