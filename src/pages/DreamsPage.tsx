import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Target,
  Rocket,
  ShoppingBag,
  ShoppingCart,
  Plus,
  Heart,
  Search,
  Filter,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { FantasyItem, GoalPreview, WishlistItem, NeedItem } from '../types';
import { DreamHeroCard } from '../components/dreams/DreamHeroCard';
import { FantasyCard } from '../components/dreams/FantasyCard';
import { FantasyModal } from '../components/dreams/FantasyModal';
import { GoalCard } from '../components/dreams/GoalCard';
import { GoalModal } from '../components/dreams/GoalModal';
import { WishlistCard } from '../components/dreams/WishlistCard';
import { WishlistModal } from '../components/dreams/WishlistModal';
import { NeedsCard } from '../components/dreams/NeedsCard';
import { NeedModal } from '../components/dreams/NeedModal';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { playGentleBellChime } from '../utils/sound';

type DreamSubSection = 'fantasies' | 'short-term' | 'long-term' | 'wishlist' | 'needs';

export const DreamsPage: React.FC = () => {
  const { currentTheme, isDark } = useTheme();
  const {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleMilestone,
    fantasies,
    addFantasy,
    updateFantasy,
    deleteFantasy,
    togglePinFantasy,
    wishlist,
    addWishlistItem,
    updateWishlistItem,
    deleteWishlistItem,
    addSavingsToWishlist,
    needs,
    addNeedItem,
    updateNeedItem,
    deleteNeedItem,
    toggleNeedItem,
  } = useApp();

  const [activeSubSection, setActiveSubSection] = useState<DreamSubSection>('fantasies');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal states
  const [isFantasyModalOpen, setIsFantasyModalOpen] = useState(false);
  const [editingFantasy, setEditingFantasy] = useState<FantasyItem | null>(null);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalPreview | null>(null);

  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [editingWishlistItem, setEditingWishlistItem] = useState<WishlistItem | null>(null);

  const [isNeedModalOpen, setIsNeedModalOpen] = useState(false);
  const [editingNeedItem, setEditingNeedItem] = useState<NeedItem | null>(null);

  // Filtered lists
  const shortTermGoals = useMemo(
    () => goals.filter(g => g.category === 'short-term'),
    [goals]
  );
  const longTermGoals = useMemo(
    () => goals.filter(g => g.category === 'long-term'),
    [goals]
  );

  // Sorted Fantasies (pinned first)
  const sortedFantasies = useMemo(() => {
    return [...fantasies].sort((a, b) => {
      if (a.pinned === b.pinned) return 0;
      return a.pinned ? -1 : 1;
    });
  }, [fantasies]);

  // Wishlist calculations
  const wishlistSavedTotal = useMemo(
    () => wishlist.reduce((sum, item) => sum + (item.savedAmount || 0), 0),
    [wishlist]
  );
  const wishlistCostTotal = useMemo(
    () => wishlist.reduce((sum, item) => sum + (item.targetPrice || 0), 0),
    [wishlist]
  );

  // Needs calculations
  const needsPendingCount = useMemo(
    () => needs.filter(n => !n.checked).length,
    [needs]
  );

  // Subsections metadata
  const subSections: { id: DreamSubSection; label: string; icon: string; count: number }[] = [
    { id: 'fantasies', label: 'My Fantasies', icon: '💭', count: fantasies.length },
    { id: 'short-term', label: 'Short-Term Goals', icon: '🎯', count: shortTermGoals.length },
    { id: 'long-term', label: 'Long-Term Goals', icon: '🚀', count: longTermGoals.length },
    { id: 'wishlist', label: 'Things I Want to Buy', icon: '🛍️', count: wishlist.length },
    { id: 'needs', label: 'Things I Need to Buy', icon: '🛒', count: needsPendingCount },
  ];

  const handleOpenAddModal = () => {
    playGentleBellChime();
    switch (activeSubSection) {
      case 'fantasies':
        setEditingFantasy(null);
        setIsFantasyModalOpen(true);
        break;
      case 'short-term':
      case 'long-term':
        setEditingGoal(null);
        setIsGoalModalOpen(true);
        break;
      case 'wishlist':
        setEditingWishlistItem(null);
        setIsWishlistModalOpen(true);
        break;
      case 'needs':
        setEditingNeedItem(null);
        setIsNeedModalOpen(true);
        break;
    }
  };

  // Adjust progress on goal +/- 10%
  const handleAdjustGoalProgress = (goal: GoalPreview, delta: number) => {
    const newProgress = Math.max(0, Math.min(100, goal.progress + delta));
    updateGoal({ ...goal, progress: newProgress });
  };

  // Toggle wishlist purchased status
  const handleToggleWishlistPurchased = (item: WishlistItem) => {
    const isPurchased = item.status === 'Purchased';
    const newStatus = isPurchased ? 'Saving' : 'Purchased';
    const newSaved = isPurchased ? item.savedAmount : item.targetPrice;
    updateWishlistItem({
      ...item,
      status: newStatus,
      savedAmount: newSaved,
    });
  };

  const getActiveLabel = () => {
    switch (activeSubSection) {
      case 'fantasies':
        return 'Visions';
      case 'short-term':
        return 'Short-Term';
      case 'long-term':
        return 'Long-Term';
      case 'wishlist':
        return 'Wishlist';
      case 'needs':
        return 'Needs';
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-5xl mx-auto">
      {/* 1. Hero Summary Card */}
      <DreamHeroCard
        fantasiesCount={fantasies.length}
        goalsCount={goals.length}
        wishlistSaved={wishlistSavedTotal}
        wishlistTotal={wishlistCostTotal}
        needsPendingCount={needsPendingCount}
        onOpenAddModal={handleOpenAddModal}
        activeSectionLabel={getActiveLabel()}
      />

      {/* 2. Sub-section Navigation Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 border-b border-slate-200/80 dark:border-slate-800 no-scrollbar">
        {subSections.map(sub => {
          const isActive = activeSubSection === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => {
                setActiveSubSection(sub.id);
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 relative cursor-pointer ${
                isActive
                  ? 'font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              style={isActive ? { color: currentTheme.accentColor } : undefined}
            >
              <span>{sub.icon}</span>
              <span>{sub.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isActive
                    ? 'bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {sub.count}
              </span>
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: currentTheme.accentColor }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Search & Filter Bar (for Fantasies, Goals, Wishlist) */}
      {activeSubSection !== 'needs' && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search in ${getActiveLabel()}...`}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-400/50"
            />
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-transform active:scale-95 shrink-0"
            style={{ backgroundColor: currentTheme.accentColor }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New {getActiveLabel()}</span>
          </button>
        </div>
      )}

      {/* 4. Tab Content: MY FANTASIES */}
      {activeSubSection === 'fantasies' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3">
            <div>
              ✨ <strong>My Fantasies</strong> is your personal free-form vision board. No deadlines,
              no pressure. Pin your favorite dreams to keep them glowing near your heart.
            </div>
            <Badge variant="warning">
              {fantasies.filter(f => f.pinned).length} Pinned
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sortedFantasies
              .filter(
                f =>
                  f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  f.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  f.category.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(fantasy => (
                <FantasyCard
                  key={fantasy.id}
                  fantasy={fantasy}
                  onTogglePin={togglePinFantasy}
                  onEdit={item => {
                    setEditingFantasy(item);
                    setIsFantasyModalOpen(true);
                  }}
                  onDelete={deleteFantasy}
                />
              ))}
          </div>

          {fantasies.length === 0 && (
            <Card className="p-10 text-center border-dashed">
              <Heart className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <h3 className="font-serif font-semibold text-slate-800 dark:text-slate-200">
                Your vision board is empty
              </h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                What soothing sights, cozy memories, or travels are you daydreaming about?
              </p>
              <button
                onClick={() => {
                  setEditingFantasy(null);
                  setIsFantasyModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm"
                style={{ backgroundColor: currentTheme.accentColor }}
              >
                Create First Vision ♡
              </button>
            </Card>
          )}
        </div>
      )}

      {/* 5. Tab Content: SHORT-TERM GOALS */}
      {activeSubSection === 'short-term' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-pink-50/60 dark:bg-pink-950/20 border border-pink-200/50 text-xs text-pink-900 dark:text-pink-200 flex items-center justify-between gap-3">
            <div>
              🎯 <strong>Short-Term Targets</strong> help you build daily momentum. Tap individual
              milestones to automatically advance your completion percentage!
            </div>
            <Badge variant="primary">{shortTermGoals.length} Active</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shortTermGoals
              .filter(
                g =>
                  g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (g.desc && g.desc.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={item => {
                    setEditingGoal(item);
                    setIsGoalModalOpen(true);
                  }}
                  onDelete={deleteGoal}
                  onToggleMilestone={toggleMilestone}
                  onAdjustProgress={handleAdjustGoalProgress}
                />
              ))}
          </div>

          {shortTermGoals.length === 0 && (
            <Card className="p-10 text-center border-dashed">
              <Target className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <h3 className="font-serif font-semibold text-slate-800 dark:text-slate-200">
                No short-term targets logged
              </h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Add an actionable focus goal with clear milestone steps.
              </p>
              <button
                onClick={() => {
                  setEditingGoal(null);
                  setIsGoalModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm"
                style={{ backgroundColor: currentTheme.accentColor }}
              >
                Add Short-Term Goal ♡
              </button>
            </Card>
          )}
        </div>
      )}

      {/* 6. Tab Content: LONG-TERM GOALS */}
      {activeSubSection === 'long-term' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/50 text-xs text-purple-900 dark:text-purple-200 flex items-center justify-between gap-3">
            <div>
              🚀 <strong>Long-Term Ambitions</strong> anchor your bigger life horizon: tech career
              milestones, dream travels to Kyoto and Seoul, and creative mastery.
            </div>
            <Badge variant="primary">{longTermGoals.length} Ambitions</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {longTermGoals
              .filter(
                g =>
                  g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (g.desc && g.desc.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={item => {
                    setEditingGoal(item);
                    setIsGoalModalOpen(true);
                  }}
                  onDelete={deleteGoal}
                  onToggleMilestone={toggleMilestone}
                  onAdjustProgress={handleAdjustGoalProgress}
                />
              ))}
          </div>

          {longTermGoals.length === 0 && (
            <Card className="p-10 text-center border-dashed">
              <Rocket className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <h3 className="font-serif font-semibold text-slate-800 dark:text-slate-200">
                No long-term ambitions logged yet
              </h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                What meaningful accomplishments are you pacing toward over the coming years?
              </p>
              <button
                onClick={() => {
                  setEditingGoal(null);
                  setIsGoalModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm"
                style={{ backgroundColor: currentTheme.accentColor }}
              >
                Add Long-Term Ambition ♡
              </button>
            </Card>
          )}
        </div>
      )}

      {/* 7. Tab Content: WISHLIST (THINGS I WANT TO BUY) */}
      {activeSubSection === 'wishlist' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/50 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-3">
            <div>
              🛍️ <strong>Things I Want to Buy</strong> lets you intentionally save for joyful desk
              upgrades and reading tools without impulsive shopping.
            </div>
            <div className="text-right shrink-0">
              <span className="font-bold text-emerald-700 dark:text-emerald-300">
                ₹{wishlistSavedTotal.toLocaleString()}
              </span>
              <span className="text-slate-400 text-[11px]"> / ₹{wishlistCostTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {wishlist
              .filter(
                item =>
                  item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  item.category.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(item => (
                <WishlistCard
                  key={item.id}
                  item={item}
                  onEdit={w => {
                    setEditingWishlistItem(w);
                    setIsWishlistModalOpen(true);
                  }}
                  onDelete={deleteWishlistItem}
                  onAddSavings={addSavingsToWishlist}
                  onTogglePurchased={handleToggleWishlistPurchased}
                />
              ))}
          </div>

          {wishlist.length === 0 && (
            <Card className="p-10 text-center border-dashed">
              <ShoppingBag className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <h3 className="font-serif font-semibold text-slate-800 dark:text-slate-200">
                Wishlist is empty
              </h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Add an aesthetic item you're excited to save towards!
              </p>
              <button
                onClick={() => {
                  setEditingWishlistItem(null);
                  setIsWishlistModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm"
                style={{ backgroundColor: currentTheme.accentColor }}
              >
                Add Wishlist Item ♡
              </button>
            </Card>
          )}
        </div>
      )}

      {/* 8. Tab Content: NEEDS (THINGS I NEED TO BUY) */}
      {activeSubSection === 'needs' && (
        <NeedsCard
          needs={needs}
          onToggleCheck={toggleNeedItem}
          onEdit={item => {
            setEditingNeedItem(item);
            setIsNeedModalOpen(true);
          }}
          onDelete={deleteNeedItem}
          onOpenAddModal={() => {
            setEditingNeedItem(null);
            setIsNeedModalOpen(true);
          }}
          onQuickAdd={(name, price, qty, category) => {
            addNeedItem({
              name,
              estimatedPrice: price,
              qty,
              category,
              checked: false,
            });
          }}
        />
      )}

      {/* 9. Modals */}
      <FantasyModal
        isOpen={isFantasyModalOpen}
        onClose={() => setIsFantasyModalOpen(false)}
        onSave={(data, editingId) => {
          if (editingId) {
            updateFantasy({
              ...data,
              id: editingId,
              createdAt: editingFantasy?.createdAt || new Date().toISOString(),
            });
          } else {
            addFantasy(data);
          }
        }}
        fantasyToEdit={editingFantasy}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        defaultCategory={activeSubSection === 'long-term' ? 'long-term' : 'short-term'}
        onSave={(data, editingId) => {
          if (editingId) {
            updateGoal({
              ...data,
              id: editingId,
              createdAt: editingGoal?.createdAt || new Date().toISOString(),
            });
          } else {
            addGoal(data);
          }
        }}
        goalToEdit={editingGoal}
      />

      <WishlistModal
        isOpen={isWishlistModalOpen}
        onClose={() => setIsWishlistModalOpen(false)}
        onSave={(data, editingId) => {
          if (editingId) {
            updateWishlistItem({
              ...data,
              id: editingId,
              createdAt: editingWishlistItem?.createdAt || new Date().toISOString(),
            });
          } else {
            addWishlistItem(data);
          }
        }}
        itemToEdit={editingWishlistItem}
      />

      <NeedModal
        isOpen={isNeedModalOpen}
        onClose={() => setIsNeedModalOpen(false)}
        onSave={(data, editingId) => {
          if (editingId) {
            updateNeedItem({
              ...data,
              id: editingId,
              createdAt: editingNeedItem?.createdAt || new Date().toISOString(),
            });
          } else {
            addNeedItem(data);
          }
        }}
        itemToEdit={editingNeedItem}
      />
    </div>
  );
};
