import React, { useState } from 'react';
import { Timer, X, Sparkles, Check, BookOpen, Laptop, Brain, Coffee } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { saveManualFocusLog } from '../../utils/analytics';
import { playGentleBellChime } from '../../utils/sound';

interface ManualFocusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionLogged: () => void;
}

export const ManualFocusModal: React.FC<ManualFocusModalProps> = ({
  isOpen,
  onClose,
  onSessionLogged,
}) => {
  const { currentTheme, isDark } = useTheme();

  const [minutes, setMinutes] = useState<number>(25);
  const [tag, setTag] = useState<string>('Placement Study');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const quickDurations = [15, 25, 45, 60, 90];
  const tags = [
    { label: 'Placement Study', icon: '💻' },
    { label: 'Web Dev & Coding', icon: '🚀' },
    { label: 'College Lecture', icon: '📚' },
    { label: 'Deep Reading', icon: '📖' },
    { label: 'Creative Work', icon: '🎨' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (minutes <= 0) return;

    const todayStr = new Date().toISOString().split('T')[0];
    saveManualFocusLog({
      date: todayStr,
      minutes,
      tag,
      notes: notes.trim() || undefined,
    });

    playGentleBellChime();
    onSessionLogged();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div
        className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl space-y-5 relative ${
          isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-pink-100 text-slate-800'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-xs"
            style={{
              backgroundColor: `${currentTheme.primaryColor}20`,
              color: currentTheme.accentColor,
            }}
          >
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
              Log Mindful Focus Session
            </h3>
            <p className="text-xs text-slate-400">
              Record dedicated offline or deep work study time.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Duration Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Focus Duration
            </label>
            <div className="grid grid-cols-5 gap-2">
              {quickDurations.map(d => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setMinutes(d)}
                  className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    minutes === d
                      ? 'bg-pink-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  style={minutes === d ? { backgroundColor: currentTheme.accentColor } : undefined}
                >
                  {d}m
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-slate-400">Custom minutes:</span>
              <input
                type="number"
                min="1"
                max="360"
                value={minutes}
                onChange={e => setMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Activity Tag */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Focus Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {tags.map(t => (
                <button
                  type="button"
                  key={t.label}
                  onClick={() => setTag(t.label)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    tag === t.label
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Practiced dynamic programming or revised system architecture..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-pink-400"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95 cursor-pointer"
              style={{ backgroundColor: currentTheme.accentColor }}
            >
              Record {minutes} Minutes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
