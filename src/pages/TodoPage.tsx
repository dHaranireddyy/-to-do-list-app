import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Circle,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowUpDown,
  Tag,
  Sparkles,
  SlidersHorizontal,
  X,
  ListTodo,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { TASK_CATEGORIES } from '../data/initialTasks';
import { TaskCategory, TaskItem, TaskPriority } from '../types';
import { TaskItemCard } from '../components/todo/TaskItemCard';
import { TaskModal } from '../components/todo/TaskModal';
import { CelebrationCard } from '../components/todo/CelebrationCard';
import { playSoftTick, playGentleBellChime } from '../utils/sound';

type StatusFilter = 'all' | 'active' | 'completed';
type SortOption = 'dueDate' | 'priority' | 'recentlyAdded';

export const TodoPage: React.FC = () => {
  const { currentTheme, isDark, themeSymbol } = useTheme();
  const {
    tasks,
    addTask,
    updateTask,
    toggleTaskCompleted,
    deleteTask,
    userProfile,
  } = useApp();

  // Filters & Search State
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('recentlyAdded');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Open modal for new task
  const handleOpenNewTask = () => {
    playSoftTick();
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEditTask = (task: TaskItem) => {
    playSoftTick();
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Save task (create or edit)
  const handleSaveTask = (
    taskData: Omit<TaskItem, 'id' | 'createdAt'>,
    taskId?: string
  ) => {
    if (taskId && editingTask) {
      updateTask({
        ...editingTask,
        ...taskData,
      });
      playGentleBellChime();
      showToast('Task updated gracefully ♡');
    } else {
      addTask(taskData);
      playGentleBellChime();
      showToast('New task added to your flow ✨');
    }
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    playSoftTick();
    showToast('Task removed');
  };

  // Counts
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isAllTasksCompleted = totalCount > 0 && completedCount === totalCount;

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // 1. Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory);
    }

    // 2. Filter by status
    if (statusFilter === 'active') {
      result = result.filter(t => !t.completed);
    } else if (statusFilter === 'completed') {
      result = result.filter(t => t.completed);
    }

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          (t.notes && t.notes.toLowerCase().includes(q)) ||
          t.category.toLowerCase().includes(q)
      );
    }

    // 4. Sorting
    result.sort((a, b) => {
      // Completed items naturally drop to bottom within list unless filtered
      if (statusFilter === 'all' && a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      if (sortBy === 'priority') {
        const priorityScore: Record<TaskPriority, number> = { high: 3, medium: 2, low: 1 };
        return priorityScore[b.priority] - priorityScore[a.priority];
      }

      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }

      // Default: recently added (newest createdAt first)
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });

    return result;
  }, [tasks, selectedCategory, statusFilter, searchQuery, sortBy]);

  // Category task count helper
  const getCategoryCount = (categoryId: TaskCategory | 'all') => {
    if (categoryId === 'all') return tasks.length;
    return tasks.filter(t => t.category === categoryId).length;
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-5xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in">
          <div
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold text-white border border-white/20 backdrop-blur-md"
            style={{ backgroundColor: currentTheme.accentColor }}
          >
            <Sparkles className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100">
              To-Do & Cute Responsibilities
            </h2>
            <Badge variant="primary" icon={themeSymbol}>
              Stage 4 Active
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize study, placement prep, health, and personal goals gracefully.
          </p>
        </div>

        <button
          onClick={handleOpenNewTask}
          className="px-4.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold text-white shadow-md hover:scale-102 active:scale-98 transition-all flex items-center gap-2 self-start sm:self-auto"
          style={{ backgroundColor: currentTheme.accentColor }}
        >
          <Plus className="w-4 h-4" />
          <span>New Task ♡</span>
        </button>
      </div>

      {/* Progress Card Banner */}
      <Card className="p-5 sm:p-6 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h4 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>{themeSymbol}</span>
              <span>Today's Task Progress</span>
            </h4>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {completedCount} of {totalCount} completed tasks
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 self-start sm:self-auto">
            <span
              className="font-serif font-bold text-2xl sm:text-3xl tracking-tight"
              style={{ color: currentTheme.accentColor }}
            >
              {progressPercent}%
            </span>
            <span className="text-xs text-slate-400 font-medium">accomplished</span>
          </div>
        </div>

        <ProgressBar progress={progressPercent} size="md" />

        <div className="flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400">
          <span>
            {totalCount - completedCount === 0
              ? '✨ All daily tasks completed!'
              : `${totalCount - completedCount} tasks gently awaiting your attention`}
          </span>
          <span className="font-medium">
            {completedCount >= 4 ? '🌸 Wonderful flow today!' : 'Take it one step at a time ♡'}
          </span>
        </div>
      </Card>

      {/* Celebratory State when ALL tasks are completed! */}
      {isAllTasksCompleted && (
        <CelebrationCard
          onAddNewTask={handleOpenNewTask}
          totalCompleted={completedCount}
        />
      )}

      {/* Category Pills Slider */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 max-w-full scrollbar-none">
          {TASK_CATEGORIES.map(c => {
            const isSelected = selectedCategory === c.id;
            const count = getCategoryCount(c.id);
            return (
              <button
                key={c.id}
                onClick={() => {
                  playSoftTick();
                  setSelectedCategory(c.id);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'shadow-xs font-semibold'
                    : isDark
                    ? 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-slate-200'
                    : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900'
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: `${currentTheme.primaryColor}20`,
                        borderColor: currentTheme.primaryColor,
                        color: currentTheme.accentColor,
                      }
                    : undefined
                }
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search, Status Filter & Sort Toolbar */}
      <Card className="p-3 sm:p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs: All, Active, Completed */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 self-start sm:self-auto">
            {[
              { id: 'all', label: 'All' },
              { id: 'active', label: `Active (${tasks.filter(t => !t.completed).length})` },
              { id: 'completed', label: `Done (${completedCount})` },
            ].map(tab => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playSoftTick();
                    setStatusFilter(tab.id as StatusFilter);
                  }}
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

          {/* Search bar & Sort selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1 md:justify-end">
            {/* Search bar */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search tasks or notes..."
                className={`w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border transition-colors ${
                  isDark
                    ? 'bg-slate-800/60 border-slate-700 text-slate-200 placeholder-slate-500'
                    : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 shrink-0 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={e => {
                  playSoftTick();
                  setSortBy(e.target.value as SortOption);
                }}
                className={`px-2.5 py-1.5 text-xs rounded-xl border font-medium ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-200'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <option value="recentlyAdded">Recently Added</option>
                <option value="priority">Priority (High to Low)</option>
                <option value="dueDate">Due Date</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <Card className="py-12 px-6 text-center">
            <div className="max-w-sm mx-auto space-y-3">
              <div className="text-4xl">🌷</div>
              <h3 className="font-serif font-bold text-base text-slate-800 dark:text-slate-200">
                {searchQuery
                  ? 'No tasks matched your search'
                  : statusFilter === 'completed'
                  ? 'No completed tasks in this section yet'
                  : 'No tasks here yet ♡'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {searchQuery
                  ? 'Try looking for another keyword or clear the search query.'
                  : 'Add a gentle task to nurture your goals step-by-step.'}
              </p>
              <div className="pt-2">
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-semibold underline text-purple-600 dark:text-purple-400"
                  >
                    Clear Search
                  </button>
                ) : (
                  <button
                    onClick={handleOpenNewTask}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs"
                    style={{ backgroundColor: currentTheme.accentColor }}
                  >
                    + Add Your First Task
                  </button>
                )}
              </div>
            </div>
          </Card>
        ) : (
          filteredTasks.map(task => (
            <TaskItemCard
              key={task.id}
              task={task}
              onToggleComplete={toggleTaskCompleted}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))
        )}
      </div>

      {/* Task Modal (Create & Edit) */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
      />
    </div>
  );
};
