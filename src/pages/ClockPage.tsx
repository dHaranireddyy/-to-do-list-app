import React, { useState } from 'react';
import { Sparkles, Timer, Clock as ClockIcon, BookOpen, Coffee, Headphones } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { LiveClock } from '../components/clock/LiveClock';
import { PomodoroTimer } from '../components/clock/PomodoroTimer';
import { Stopwatch } from '../components/clock/Stopwatch';

export const ClockPage: React.FC = () => {
  const { currentTheme, isDark, themeSymbol } = useTheme();
  const [activeSubTab, setActiveSubTab] = useState<'both' | 'pomodoro' | 'stopwatch'>('both');

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100">
              Clock & Focus Sanctuary
            </h2>
            <Badge variant="primary" icon={themeSymbol}>
              Stage 2 Complete
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Live time, customizable Pomodoro study cycles, and precision stopwatch.
          </p>
        </div>

        {/* View switcher buttons */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 self-start sm:self-auto">
          {[
            { id: 'both', label: 'All Tools' },
            { id: 'pomodoro', label: 'Pomodoro Only' },
            { id: 'stopwatch', label: 'Stopwatch Only' },
          ].map(tab => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as 'both' | 'pomodoro' | 'stopwatch')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-700 shadow-xs text-slate-900 dark:text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                style={isActive ? { color: currentTheme.accentColor } : undefined}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Large Aesthetic Live Clock */}
      <LiveClock />

      {/* 2. Focus Tools Grid */}
      <div
        className={`grid gap-6 ${
          activeSubTab === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {(activeSubTab === 'both' || activeSubTab === 'pomodoro') && (
          <div className="flex flex-col">
            <PomodoroTimer />
          </div>
        )}

        {(activeSubTab === 'both' || activeSubTab === 'stopwatch') && (
          <div className="flex flex-col">
            <Stopwatch />
          </div>
        )}
      </div>

      {/* 3. Study Focus Guidance & Tips Card */}
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-lg shadow-xs"
              style={{
                backgroundColor: `${currentTheme.primaryColor}20`,
                color: currentTheme.accentColor,
              }}
            >
              <span>☕</span>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 font-serif flex items-center gap-1.5">
                <span>The Gentle Flow Technique</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed max-w-xl">
                Dedicate 25 uninterrupted minutes to a single task without multitasking. When the bell sounds, stand up, stretch your shoulders, drink water, and let your mind softly reset.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-full border border-inherit">
              Bell Chimes Enabled 🔔
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
