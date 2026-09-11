import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Target } from 'lucide-react';
import { GoalPreview, GoalMilestone } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { playGentleBellChime } from '../../utils/sound';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goalData: Omit<GoalPreview, 'id' | 'createdAt'>, editingId?: string) => void;
  goalToEdit?: GoalPreview | null;
  defaultCategory?: 'short-term' | 'long-term';
}

const GOAL_ICONS = ['💻', '🪴', '🚀', '🌸', '✍️', '📚', '🎨', '🏃‍♀️', '🧘‍♀️', '💡', '🌟', '💼', '🏡', '🍵'];

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  goalToEdit,
  defaultCategory = 'short-term',
}) => {
  const { currentTheme, isDark } = useTheme();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'short-term' | 'long-term'>(defaultCategory);
  const [targetDate, setTargetDate] = useState('');
  const [icon, setIcon] = useState('✨');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [progress, setProgress] = useState(0);
  const [milestones, setMilestones] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newMilestoneText, setNewMilestoneText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title);
      setCategory(goalToEdit.category);
      setTargetDate(goalToEdit.targetDate);
      setIcon(goalToEdit.icon);
      setDesc(goalToEdit.desc || '');
      setPriority(goalToEdit.priority || 'medium');
      setProgress(goalToEdit.progress);
      setMilestones(goalToEdit.milestones || []);
    } else {
      setTitle('');
      setCategory(defaultCategory);
      setTargetDate(defaultCategory === 'short-term' ? 'Nov 15, 2026' : 'Dec 31, 2026');
      setIcon(defaultCategory === 'short-term' ? '💻' : '🚀');
      setDesc('');
      setPriority('medium');
      setProgress(0);
      setMilestones([
        { id: `m-${Date.now()}-1`, title: 'Define key learning scope or plan', completed: false },
        { id: `m-${Date.now()}-2`, title: 'Work consistently on execution', completed: false },
      ]);
    }
    setNewMilestoneText('');
    setError('');
  }, [goalToEdit, isOpen, defaultCategory]);

  if (!isOpen) return null;

  const handleAddMilestone = () => {
    if (!newMilestoneText.trim()) return;
    setMilestones(prev => [
      ...prev,
      { id: `m-${Date.now()}`, title: newMilestoneText.trim(), completed: false },
    ]);
    setNewMilestoneText('');
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestones(prev => prev.filter(m => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a goal title ♡');
      return;
    }
    if (!targetDate.trim()) {
      setError('Please provide a target date ♡');
      return;
    }

    playGentleBellChime();
    onSave(
      {
        title: title.trim(),
        category,
        targetDate: targetDate.trim(),
        icon,
        desc: desc.trim(),
        priority,
        progress: Number(progress),
        milestones,
      },
      goalToEdit ? goalToEdit.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-xl p-6 relative flex flex-col max-h-[90vh] overflow-y-auto ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <div>
              <h3 className="text-lg font-bold font-serif">
                {goalToEdit ? 'Edit Goal' : 'Create New Goal'}
              </h3>
              <p className="text-xs text-slate-400">
                Set milestones and track progress for your journey.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {error && (
            <div className="p-2.5 rounded-xl text-xs bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
              {error}
            </div>
          )}

          {/* Icon Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Goal Icon
            </label>
            <div className="flex flex-wrap gap-2 p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 max-h-20 overflow-y-auto">
              {GOAL_ICONS.map(i => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setIcon(i)}
                  className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-transform cursor-pointer ${
                    icon === i
                      ? 'scale-110 shadow-sm border border-purple-400'
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor:
                      icon === i
                        ? isDark
                          ? 'rgba(168, 85, 247, 0.25)'
                          : `${currentTheme.primaryColor}25`
                        : 'transparent',
                  }}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Goal Category Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setCategory('short-term')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                category === 'short-term'
                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-300'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              🌱 Short-Term Target
            </button>
            <button
              type="button"
              onClick={() => setCategory('long-term')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                category === 'long-term'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              🚀 Long-Term Ambition
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Goal Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Master Modern Web & AI Integrations"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-400/50"
            />
          </div>

          {/* Target Date & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Target Date / Timeline
              </label>
              <input
                type="text"
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
                placeholder="e.g., Nov 15, 2026 or Spring 2027"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-400/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-400/50"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Gentle / Low Priority</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Why this matters to you (Motivation / Notes)
            </label>
            <textarea
              rows={2}
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Brief encouraging note about what this unlocks..."
              className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-400/50 resize-none"
            />
          </div>

          {/* Progress Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              <span>Initial Progress</span>
              <span style={{ color: currentTheme.accentColor }}>{progress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={e => setProgress(Number(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer"
            />
          </div>

          {/* Milestones / Sub-steps */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Milestone Checklist ({milestones.length})
            </label>
            <div className="space-y-1.5 max-h-32 overflow-y-auto p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
              {milestones.map((m, idx) => (
                <div key={m.id} className="flex items-center justify-between gap-2 text-xs py-1 px-1.5 rounded-lg bg-white dark:bg-slate-800/80">
                  <span className="truncate text-slate-700 dark:text-slate-300">
                    {idx + 1}. {m.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMilestone(m.id)}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {milestones.length === 0 && (
                <div className="text-center py-2 text-[11px] text-slate-400">
                  No sub-milestones added yet.
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 mt-2">
              <input
                type="text"
                value={newMilestoneText}
                onChange={e => setNewMilestoneText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMilestone();
                  }
                }}
                placeholder="Add next action step..."
                className="flex-1 px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-400/50"
              />
              <button
                type="button"
                onClick={handleAddMilestone}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-md transition-transform active:scale-95 cursor-pointer hover:brightness-105"
              style={{ backgroundColor: currentTheme.accentColor }}
            >
              {goalToEdit ? 'Save Changes' : 'Create Goal ♡'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
