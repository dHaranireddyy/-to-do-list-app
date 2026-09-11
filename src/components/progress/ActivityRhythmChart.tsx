import React, { useState } from 'react';
import { Calendar, CheckCircle2, Timer, BookOpen, Sparkles, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../common/Card';
import { DailyActivityRecord } from '../../types';

interface ActivityRhythmChartProps {
  records: DailyActivityRecord[];
  activeDaysRange: number;
  onChangeRange: (range: number) => void;
}

export const ActivityRhythmChart: React.FC<ActivityRhythmChartProps> = ({
  records,
  activeDaysRange,
  onChangeRange,
}) => {
  const { currentTheme, isDark, themeSymbol } = useTheme();
  const [selectedDay, setSelectedDay] = useState<DailyActivityRecord>(records[0]);

  // Reverse so oldest is left and latest (today) is right
  const chronologicalRecords = [...records].reverse();

  const totalTasksPeriod = chronologicalRecords.reduce((s, r) => s + r.tasksTotal, 0);
  const completedTasksPeriod = chronologicalRecords.reduce((s, r) => s + r.tasksDone, 0);
  const totalFocusPeriod = chronologicalRecords.reduce((s, r) => s + r.focusMinutes, 0);
  const avgCompletionRate =
    totalTasksPeriod > 0 ? Math.round((completedTasksPeriod / totalTasksPeriod) * 100) : 0;

  return (
    <Card className="p-5 sm:p-6 border-slate-200/70 dark:border-slate-800/80 space-y-5">
      {/* Header & Range Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>{themeSymbol}</span>
            <span>Daily Activity & Habit Rhythm</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualize your consistency across tasks, study focus, and mindful journaling.
          </p>
        </div>

        {/* Range Buttons */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 self-start sm:self-auto">
          {[
            { range: 7, label: '7 Days' },
            { range: 14, label: '14 Days' },
            { range: 30, label: '30 Days' },
          ].map(opt => {
            const isActive = activeDaysRange === opt.range;
            return (
              <button
                key={opt.range}
                onClick={() => {
                  onChangeRange(opt.range);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-700 shadow-xs text-slate-900 dark:text-white'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                style={isActive ? { color: currentTheme.accentColor } : undefined}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Bar Chart Strip */}
      <div className="space-y-2">
        <div
          className={`grid gap-1.5 sm:gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar`}
          style={{
            gridTemplateColumns: `repeat(${chronologicalRecords.length}, minmax(36px, 1fr))`,
          }}
        >
          {chronologicalRecords.map(r => {
            const isSelected = selectedDay.date === r.date;
            const completionPct =
              r.tasksTotal > 0 ? Math.round((r.tasksDone / r.tasksTotal) * 100) : 0;

            return (
              <div
                key={r.date}
                onClick={() => setSelectedDay(r)}
                className={`flex flex-col items-center p-2 rounded-2xl border transition-all cursor-pointer group ${
                  isSelected
                    ? isDark
                      ? 'bg-slate-800 border-pink-500 shadow-sm scale-102'
                      : 'bg-pink-50/50 border-pink-400 shadow-sm scale-102'
                    : isDark
                    ? 'bg-slate-900/50 border-slate-800/60 hover:bg-slate-800/40'
                    : 'bg-slate-50/70 border-slate-200/60 hover:bg-slate-100/60'
                }`}
              >
                {/* Day label */}
                <span
                  className={`text-[10px] font-semibold mb-1.5 transition-colors ${
                    isSelected
                      ? 'text-pink-600 dark:text-pink-400'
                      : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  }`}
                >
                  {r.dayLabel}
                </span>

                {/* Progress Bar Column */}
                <div
                  className="w-full h-24 rounded-xl flex items-end justify-center p-1 relative overflow-hidden"
                  style={{
                    backgroundColor: isDark
                      ? 'rgba(51, 65, 85, 0.25)'
                      : `${currentTheme.primaryColor}15`,
                  }}
                >
                  <div
                    className="w-full rounded-lg transition-all duration-500 relative"
                    style={{
                      height: `${Math.max(12, completionPct)}%`,
                      backgroundColor: isSelected
                        ? currentTheme.accentColor
                        : isDark
                        ? `${currentTheme.accentColor}cc`
                        : currentTheme.accentColor,
                    }}
                  />
                </div>

                {/* Task Fraction */}
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-2">
                  {r.tasksDone}/{r.tasksTotal}
                </span>

                {/* Journal / Focus indicator pills */}
                <div className="flex items-center gap-0.5 mt-1.5 min-h-[16px]">
                  {r.journalLogged ? (
                    <span className="text-[11px]" title="Journal written">
                      🌸
                    </span>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Inspector Card */}
      {selectedDay && (
        <div
          className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            isDark
              ? 'bg-slate-900/70 border-slate-800'
              : 'bg-slate-50/90 border-slate-200/80'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-xs shrink-0"
              style={{
                backgroundColor: `${currentTheme.primaryColor}20`,
                color: currentTheme.accentColor,
              }}
            >
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 font-serif">
                  {selectedDay.fullDate} ({selectedDay.dayLabel})
                </h4>
                {selectedDay.tasksDone === selectedDay.tasksTotal && selectedDay.tasksTotal > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
                    100% Flow
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Detailed day rhythm breakdown & reflections.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {selectedDay.tasksDone} of {selectedDay.tasksTotal} Tasks
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-rose-500" />
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {selectedDay.focusMinutes} Focus Mins
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-purple-500" />
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {selectedDay.journalLogged
                  ? `Journal: ${selectedDay.journalMood || 'Reflected'}`
                  : 'No entry logged'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Period Summary Footnotes */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span>
            Period Average:{' '}
            <strong className="text-slate-700 dark:text-slate-300">{avgCompletionRate}%</strong>
          </span>
          <span>•</span>
          <span>
            Total Focus:{' '}
            <strong className="text-slate-700 dark:text-slate-300">
              {(totalFocusPeriod / 60).toFixed(1)} Hours
            </strong>
          </span>
        </div>
        <div className="text-[11px]">Tap any date column to inspect specific achievements</div>
      </div>
    </Card>
  );
};
