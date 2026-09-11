import React, { useState } from 'react';
import {
  Circle,
  CheckCircle2,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Tag,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { TaskItem } from '../../types';
import { Card } from '../common/Card';
import { TASK_CATEGORIES, PRIORITY_CONFIG } from '../../data/initialTasks';
import { playSoftTick, playGentleBellChime, playCelebrationChime } from '../../utils/sound';

interface TaskItemCardProps {
  task: TaskItem;
  onToggleComplete: (id: string) => void;
  onEdit: (task: TaskItem) => void;
  onDelete: (id: string) => void;
}

export const TaskItemCard: React.FC<TaskItemCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const { currentTheme, isDark } = useTheme();
  const [showNotes, setShowNotes] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const categoryMeta = TASK_CATEGORIES.find(c => c.id === task.category) || TASK_CATEGORIES[1];
  const priorityMeta = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  const handleToggle = () => {
    if (!task.completed) {
      playCelebrationChime();
    } else {
      playSoftTick();
    }
    onToggleComplete(task.id);
  };

  return (
    <Card
      hoverable
      className={`p-4 sm:p-4.5 transition-all duration-300 border ${
        task.completed
          ? 'opacity-70 bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50'
          : isDark
          ? 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600'
          : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-3.5">
        {/* Cute completion checkbox button */}
        <button
          type="button"
          onClick={handleToggle}
          className="mt-0.5 shrink-0 transition-transform active:scale-90 text-slate-400 hover:text-emerald-500 focus:outline-none"
          title={task.completed ? 'Mark as active' : 'Mark as completed'}
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950/50 transition-all" />
          ) : (
            <Circle className="w-5 h-5 hover:text-emerald-400 transition-colors" />
          )}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div>
              <h4
                onClick={handleToggle}
                className={`font-semibold text-sm cursor-pointer transition-colors ${
                  task.completed
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-900 dark:text-slate-100 hover:text-purple-600 dark:hover:text-purple-300'
                }`}
              >
                {task.title}
              </h4>
            </div>

            {/* Badges: Category & Priority */}
            <div className="flex items-center gap-1.5 shrink-0 flex-wrap self-start">
              {/* Category Pill */}
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 border"
                style={{
                  backgroundColor: isDark ? categoryMeta.bgDark : categoryMeta.bgLight,
                  color: categoryMeta.color,
                  borderColor: isDark ? 'transparent' : `${categoryMeta.color}30`,
                }}
              >
                <span>{categoryMeta.icon}</span>
                <span>{categoryMeta.label}</span>
              </span>

              {/* Priority Pill (Soft coral, pastel peach, soft sage) */}
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 border"
                style={{
                  backgroundColor: isDark ? priorityMeta.bgDark : priorityMeta.bgLight,
                  color: priorityMeta.textColor,
                  borderColor: isDark ? priorityMeta.borderDark : priorityMeta.borderLight,
                }}
              >
                <span>{priorityMeta.icon}</span>
                <span>{priorityMeta.id.toUpperCase()}</span>
              </span>
            </div>
          </div>

          {/* Due date, Time estimate & Notes preview */}
          <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-400 dark:text-slate-500">
            {task.dueDate && (
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{task.dueDate}</span>
                {task.dueTime && <span>at {task.dueTime}</span>}
              </span>
            )}

            {task.timeEstimate && (
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{task.timeEstimate}</span>
              </span>
            )}

            {task.notes && (
              <button
                type="button"
                onClick={() => setShowNotes(!showNotes)}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-0.5 text-[11px] underline underline-offset-2 transition-colors"
              >
                <span>{showNotes ? 'Hide notes' : 'View notes'}</span>
                {showNotes ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>

          {/* Expanded Notes */}
          {showNotes && task.notes && (
            <div className="mt-2.5 p-2.5 rounded-xl text-xs leading-relaxed bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 animate-fade-in">
              {task.notes}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0 ml-1">
          {isConfirmingDelete ? (
            <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 p-1 rounded-xl border border-rose-200 dark:border-rose-900 animate-fade-in">
              <button
                type="button"
                onClick={() => onDelete(task.id)}
                className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-500 text-white hover:bg-rose-600"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                className="px-1.5 py-0.5 text-[10px] text-slate-500 dark:text-slate-400"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onEdit(task)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Edit task"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
