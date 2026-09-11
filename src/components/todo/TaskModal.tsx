import React, { useState, useEffect } from 'react';
import { X, Sparkles, Calendar, Clock, Tag, Flag, AlertCircle, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { TaskCategory, TaskItem, TaskPriority } from '../../types';
import { TASK_CATEGORIES, PRIORITY_CONFIG } from '../../data/initialTasks';
import { playSoftTick } from '../../utils/sound';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<TaskItem, 'id' | 'createdAt'>, taskId?: string) => void;
  initialTask?: TaskItem | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
}) => {
  const { currentTheme, isDark, themeSymbol } = useTheme();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('learning');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [timeEstimate, setTimeEstimate] = useState('30 mins');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ title?: string }>({});

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setCategory(initialTask.category);
      setPriority(initialTask.priority);
      setDueDate(initialTask.dueDate || '');
      setDueTime(initialTask.dueTime || '');
      setTimeEstimate(initialTask.timeEstimate || '30 mins');
      setNotes(initialTask.notes || '');
    } else {
      // Default new task
      const todayIso = new Date().toISOString().split('T')[0];
      setTitle('');
      setCategory('learning');
      setPriority('medium');
      setDueDate(todayIso);
      setDueTime('');
      setTimeEstimate('30 mins');
      setNotes('');
    }
    setErrors({});
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrors({ title: 'Please give your task a gentle title ♡' });
      return;
    }

    onSave(
      {
        title: title.trim(),
        category,
        priority,
        dueDate: dueDate || undefined,
        dueTime: dueTime.trim() || undefined,
        timeEstimate: timeEstimate.trim() || undefined,
        notes: notes.trim() || undefined,
        completed: initialTask ? initialTask.completed : false,
      },
      initialTask?.id
    );
    onClose();
  };

  const quickEstimates = ['15 mins', '25 mins', '30 mins', '45 mins', '1 hr', '1.5 hrs'];
  const availableCategories = TASK_CATEGORIES.filter(c => c.id !== 'all');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className={`w-full max-w-lg rounded-3xl border p-6 sm:p-7 shadow-2xl transition-all relative max-h-[90vh] overflow-y-auto ${
          isDark
            ? 'bg-slate-900 border-slate-700/80 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-inherit">
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {initialTask ? '✏️' : '🌸'}
            </span>
            <div>
              <h3 className="font-bold text-lg font-serif">
                {initialTask ? 'Edit Task' : 'New Cute Task'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {initialTask ? 'Update your task details' : 'Add to your gentle daily flow ♡'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          {/* Task Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                if (errors.title) setErrors({});
              }}
              placeholder="e.g., Practice React hooks or solve 2 dynamic programming problems..."
              className={`w-full px-4 py-2.5 rounded-2xl border text-sm transition-all focus:outline-none ${
                errors.title
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                  : isDark
                  ? 'bg-slate-800/80 border-slate-700 text-white focus:border-purple-400'
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-pink-400'
              }`}
              autoFocus
            />
            {errors.title && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableCategories.map(cat => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      playSoftTick();
                      setCategory(cat.id as TaskCategory);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'font-bold ring-2 shadow-xs'
                        : isDark
                        ? 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
                        : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:text-slate-900'
                    }`}
                    style={
                      isSelected
                        ? {
                            borderColor: cat.color,
                            backgroundColor: isDark ? cat.bgDark : cat.bgLight,
                            color: cat.color,
                            outlineColor: cat.color,
                          }
                        : undefined
                    }
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Selection with Soft Coral / Pastel Peach / Soft Sage indicators */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['high', 'medium', 'low'] as TaskPriority[]).map(p => {
                const isSelected = priority === p;
                const meta = PRIORITY_CONFIG[p];
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      playSoftTick();
                      setPriority(p);
                    }}
                    className={`p-2.5 rounded-xl text-xs font-semibold border flex flex-col items-center justify-center gap-1 transition-all ${
                      isSelected
                        ? 'ring-2 shadow-xs scale-102'
                        : isDark
                        ? 'bg-slate-800/40 border-slate-700/60 text-slate-400'
                        : 'bg-slate-50 border-slate-200/80 text-slate-600'
                    }`}
                    style={
                      isSelected
                        ? {
                            color: meta.textColor,
                            backgroundColor: isDark ? meta.bgDark : meta.bgLight,
                            borderColor: meta.borderLight,
                            outlineColor: meta.textColor,
                          }
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{meta.icon}</span>
                      <span>{p.toUpperCase()}</span>
                    </div>
                    <span className="text-[10px] font-normal opacity-80">
                      {p === 'high' ? 'Soft Coral' : p === 'medium' ? 'Pastel Peach' : 'Soft Sage'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due Date & Due Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Due Date (optional)</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Due Time (optional)</span>
              </label>
              <input
                type="text"
                value={dueTime}
                onChange={e => setDueTime(e.target.value)}
                placeholder="e.g., 04:30 PM"
                className={`w-full px-3 py-2 rounded-xl border text-xs ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>
          </div>

          {/* Time Estimate Quick Chips */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Time Estimation (optional)</span>
              </label>
              <span className="text-[11px] font-medium text-slate-400">{timeEstimate || 'None'}</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {quickEstimates.map(est => (
                <button
                  key={est}
                  type="button"
                  onClick={() => {
                    playSoftTick();
                    setTimeEstimate(est);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                    timeEstimate === est
                      ? 'border-purple-400 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {est}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={timeEstimate}
              onChange={e => setTimeEstimate(e.target.value)}
              placeholder="Or type custom time (e.g. 20 mins)..."
              className={`w-full px-3 py-1.5 rounded-xl border text-xs ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notes & Sub-steps (optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add key notes, reminders, or warm little encouragements..."
              className={`w-full p-3 rounded-2xl border text-xs leading-relaxed resize-none focus:outline-none ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-inherit">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold text-white shadow-md hover:scale-102 active:scale-98 transition-all flex items-center gap-1.5"
              style={{ backgroundColor: currentTheme.accentColor }}
            >
              <Sparkles className="w-4 h-4" />
              <span>{initialTask ? 'Update Task ♡' : 'Save Task ♡'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
