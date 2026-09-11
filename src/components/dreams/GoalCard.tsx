import React from 'react';
import { Calendar, CheckCircle2, Circle, Edit3, Trash2, Plus, Minus, Check, Sparkles } from 'lucide-react';
import { GoalPreview } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { playGentleBellChime, playCelebrationChime } from '../../utils/sound';

interface GoalCardProps {
  goal: GoalPreview;
  onEdit: (goal: GoalPreview) => void;
  onDelete: (id: string) => void;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onAdjustProgress: (goal: GoalPreview, delta: number) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDelete,
  onToggleMilestone,
  onAdjustProgress,
}) => {
  const { currentTheme, isDark } = useTheme();

  const handleMilestoneClick = (milestoneId: string, isCurrentlyCompleted: boolean) => {
    if (!isCurrentlyCompleted) {
      playCelebrationChime();
    } else {
      playGentleBellChime();
    }
    onToggleMilestone(goal.id, milestoneId);
  };

  const getPriorityColor = () => {
    switch (goal.priority) {
      case 'high':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300';
      case 'medium':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300';
      default:
        return 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300';
    }
  };

  return (
    <Card hoverable className="p-5 flex flex-col justify-between space-y-4 border border-slate-200/70 dark:border-slate-800/80 group">
      <div className="space-y-3">
        {/* Top bar: Icon, Title, Priority, Actions */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-3xl select-none shrink-0 transform transition-transform group-hover:scale-110">
              {goal.icon}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                <Badge variant="outline">{goal.category === 'short-term' ? 'Short-Term' : 'Long-Term'}</Badge>
                {goal.priority && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getPriorityColor()}`}>
                    {goal.priority}
                  </span>
                )}
              </div>
              <h4 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 font-serif leading-snug truncate">
                {goal.title}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(goal)}
              title="Edit goal"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(goal.id)}
              title="Delete goal"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Description */}
        {goal.desc && (
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
            {goal.desc}
          </p>
        )}

        {/* Milestones Checklist */}
        {goal.milestones && goal.milestones.length > 0 && (
          <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              <span>Steps & Milestones</span>
              <span>
                {goal.milestones.filter(m => m.completed).length}/{goal.milestones.length} Done
              </span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {goal.milestones.map(m => (
                <div
                  key={m.id}
                  onClick={() => handleMilestoneClick(m.id, m.completed)}
                  className="flex items-center gap-2 text-xs py-1 px-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800/70 cursor-pointer transition-colors"
                >
                  {m.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                  )}
                  <span
                    className={`text-xs transition-all ${
                      m.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {m.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Target Deadline Tag */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Target: <strong className="font-medium text-slate-700 dark:text-slate-300">{goal.targetDate}</strong></span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 dark:text-slate-400">Progress</span>
            {goal.progress >= 100 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-0.5">
                <Check className="w-2.5 h-2.5" /> Achieved!
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Quick Adjust Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onAdjustProgress(goal, -10)}
                disabled={goal.progress <= 0}
                className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                title="Decrease 10%"
              >
                <Minus className="w-3 h-3" />
              </button>
              <button
                onClick={() => onAdjustProgress(goal, 10)}
                disabled={goal.progress >= 100}
                className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                title="Increase 10%"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <span className="font-bold text-xs" style={{ color: currentTheme.accentColor }}>
              {goal.progress}%
            </span>
          </div>
        </div>

        <ProgressBar progress={goal.progress} size="md" />
      </div>
    </Card>
  );
};
