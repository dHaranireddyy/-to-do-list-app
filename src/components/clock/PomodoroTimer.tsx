import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Settings2,
  Volume2,
  VolumeX,
  Sparkles,
  Coffee,
  Trees,
  CheckCircle2,
  BellRing,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { useTheme } from '../../context/ThemeContext';
import { playGentleBellChime } from '../../utils/sound';

type PomodoroMode = 'work' | 'shortBreak' | 'longBreak';

interface PomodoroSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  soundEnabled: boolean;
  autoStartBreaks: boolean;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  soundEnabled: true,
  autoStartBreaks: false,
};

export const PomodoroTimer: React.FC = () => {
  const { currentTheme, isDark } = useTheme();

  // Load saved settings & stats from localStorage
  const [settings, setSettings] = useState<PomodoroSettings>(() => {
    try {
      const saved = localStorage.getItem('mlw_pomodoro_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [mode, setMode] = useState<PomodoroMode>('work');
  const [timeLeft, setTimeLeft] = useState<number>(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mlw_pomodoro_sessions_today');
      return saved ? parseInt(saved, 10) : 4; // realistic starter count
    } catch {
      return 4;
    }
  });
  const [totalFocusMinutes, setTotalFocusMinutes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mlw_pomodoro_focus_mins');
      return saved ? parseInt(saved, 10) : 100;
    } catch {
      return 100;
    }
  });

  const [showSettings, setShowSettings] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Save settings on change
  useEffect(() => {
    try {
      localStorage.setItem('mlw_pomodoro_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Duration in seconds for active mode
  const getModeDurationSeconds = (m: PomodoroMode) => {
    switch (m) {
      case 'work':
        return settings.workDuration * 60;
      case 'shortBreak':
        return settings.shortBreakDuration * 60;
      case 'longBreak':
        return settings.longBreakDuration * 60;
    }
  };

  // Switch mode helper
  const switchMode = (newMode: PomodoroMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(getModeDurationSeconds(newMode));
  };

  // Timer tick effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer completed!
            if (settings.soundEnabled) {
              playGentleBellChime();
            }

            if (mode === 'work') {
              const newSessions = completedSessions + 1;
              setCompletedSessions(newSessions);
              const newMins = totalFocusMinutes + settings.workDuration;
              setTotalFocusMinutes(newMins);
              try {
                localStorage.setItem('mlw_pomodoro_sessions_today', newSessions.toString());
                localStorage.setItem('mlw_pomodoro_focus_mins', newMins.toString());
              } catch {
                // ignore
              }

              // After 4 work sessions, recommend long break
              const nextMode = newSessions % 4 === 0 ? 'longBreak' : 'shortBreak';
              setMode(nextMode);
              setIsRunning(settings.autoStartBreaks);
              return getModeDurationSeconds(nextMode);
            } else {
              // Break finished, back to work
              setMode('work');
              setIsRunning(false);
              return getModeDurationSeconds('work');
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, settings, completedSessions, totalFocusMinutes]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(getModeDurationSeconds(mode));
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (mode === 'work') {
      switchMode('shortBreak');
    } else {
      switchMode('work');
    }
  };

  const totalDuration = getModeDurationSeconds(mode);
  const progressPercent = Math.min(100, Math.max(0, ((totalDuration - timeLeft) / totalDuration) * 100));

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const modeConfig = {
    work: {
      title: 'Focus Time ✨',
      subtitle: 'Immerse yourself into gentle, dedicated study flow',
      icon: Sparkles,
      color: currentTheme.accentColor,
      badgeText: 'Study Session',
    },
    shortBreak: {
      title: 'Sweet Rest ☕',
      subtitle: 'Stretch, take a sip of water, and breathe softly',
      icon: Coffee,
      color: '#10B981',
      badgeText: 'Short Pause',
    },
    longBreak: {
      title: 'Deep Rejuvenation 🌿',
      subtitle: 'Rest your eyes, step outside, or enjoy fresh air',
      icon: Trees,
      color: '#0284C7',
      badgeText: 'Long Sanctuary',
    },
  }[mode];

  const ModeIcon = modeConfig.icon;

  return (
    <Card className="p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-xs transition-colors"
            style={{ backgroundColor: modeConfig.color }}
          >
            <ModeIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base font-serif text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>Pomodoro Study Sanctuary</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {completedSessions} sessions done today · {totalFocusMinutes}m focused
            </span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }));
              if (!settings.soundEnabled) playGentleBellChime();
            }}
            title={settings.soundEnabled ? 'Mute bell chime' : 'Enable bell chime'}
            className={`p-2 rounded-xl border transition-colors ${
              settings.soundEnabled
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                : 'border-slate-200 dark:border-slate-800 text-slate-400'
            }`}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            title="Custom Durations"
            className={`p-2 rounded-xl border transition-colors ${
              showSettings
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500'
                : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 mb-6">
        {[
          { id: 'work', label: 'Study Focus', icon: '✨', mins: settings.workDuration },
          { id: 'shortBreak', label: 'Short Rest', icon: '☕', mins: settings.shortBreakDuration },
          { id: 'longBreak', label: 'Long Rest', icon: '🌿', mins: settings.longBreakDuration },
        ].map(tab => {
          const isActive = mode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => switchMode(tab.id as PomodoroMode)}
              className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                isActive
                  ? 'bg-white dark:bg-slate-700 shadow-xs text-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              style={isActive ? { color: modeConfig.color } : undefined}
            >
              <span>{tab.icon}</span>
              <span className="whitespace-nowrap">{tab.label}</span>
              <span className="text-[10px] opacity-70 hidden sm:inline">({tab.mins}m)</span>
            </button>
          );
        })}
      </div>

      {/* Settings Panel (Collapsible) */}
      {showSettings && (
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/50 mb-6 space-y-3 animate-fade-in text-xs">
          <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
            <span>Customize Timer Durations (Minutes)</span>
            <button
              onClick={() => playGentleBellChime()}
              className="text-[11px] font-medium text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:underline"
            >
              <BellRing className="w-3 h-3" /> Test Chime
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-500 mb-1 text-[11px]">Focus (min)</label>
              <select
                value={settings.workDuration}
                onChange={e => {
                  const val = parseInt(e.target.value, 10);
                  setSettings(s => ({ ...s, workDuration: val }));
                  if (mode === 'work' && !isRunning) setTimeLeft(val * 60);
                }}
                className={`w-full p-1.5 rounded-xl border text-xs ${
                  isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200'
                }`}
              >
                {[15, 20, 25, 30, 45, 50, 60].map(v => (
                  <option key={v} value={v}>
                    {v} mins
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-500 mb-1 text-[11px]">Short Break</label>
              <select
                value={settings.shortBreakDuration}
                onChange={e => {
                  const val = parseInt(e.target.value, 10);
                  setSettings(s => ({ ...s, shortBreakDuration: val }));
                  if (mode === 'shortBreak' && !isRunning) setTimeLeft(val * 60);
                }}
                className={`w-full p-1.5 rounded-xl border text-xs ${
                  isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200'
                }`}
              >
                {[3, 5, 8, 10, 15].map(v => (
                  <option key={v} value={v}>
                    {v} mins
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-500 mb-1 text-[11px]">Long Break</label>
              <select
                value={settings.longBreakDuration}
                onChange={e => {
                  const val = parseInt(e.target.value, 10);
                  setSettings(s => ({ ...s, longBreakDuration: val }));
                  if (mode === 'longBreak' && !isRunning) setTimeLeft(val * 60);
                }}
                className={`w-full p-1.5 rounded-xl border text-xs ${
                  isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200'
                }`}
              >
                {[10, 15, 20, 25, 30].map(v => (
                  <option key={v} value={v}>
                    {v} mins
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Timer Display */}
      <div className="flex flex-col items-center justify-center py-4">
        {/* Circular Progress Display */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-slate-200 dark:stroke-slate-800"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Animated progress circle */}
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke={modeConfig.color}
              strokeWidth="6"
              strokeDasharray={276.46}
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500 ease-linear"
            />
          </svg>

          {/* Inner content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <span
              className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-1"
              style={{
                backgroundColor: `${modeConfig.color}15`,
                color: modeConfig.color,
              }}
            >
              {modeConfig.title}
            </span>

            <div className="font-serif text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums my-1">
              {formattedTime}
            </div>

            <span className="text-[11px] text-slate-400 dark:text-slate-500 max-w-[170px] leading-tight">
              {isRunning ? 'Breathe and stay in flow' : 'Ready when you are'}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex items-center justify-center gap-3 pt-6 border-t border-inherit">
        <button
          onClick={handleReset}
          title="Reset timer"
          className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-transform active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handleStartPause}
          className="px-8 py-3.5 rounded-2xl font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 text-sm"
          style={{ backgroundColor: modeConfig.color }}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause Focus</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>{timeLeft < totalDuration ? 'Resume Focus' : 'Start Focus ✨'}</span>
            </>
          )}
        </button>

        <button
          onClick={handleSkip}
          title="Skip session"
          className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-transform active:scale-95"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
};
