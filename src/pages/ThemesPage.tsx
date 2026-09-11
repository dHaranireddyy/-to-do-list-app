import React, { useState } from 'react';
import { Palette, Check, Sparkles, Moon, Sun, Monitor, Filter } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { THEMES } from '../data/themes';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ThemeId } from '../types';

type ThemeCategory = 'all' | 'soft' | 'cozy' | 'calm' | 'dark';

export const ThemesPage: React.FC = () => {
  const { currentTheme, themeId, setThemeId, isDark, themeSymbol } = useTheme();
  const [filterCategory, setFilterCategory] = useState<ThemeCategory>('all');

  const filteredThemes = THEMES.filter(theme => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'dark') return theme.isDark;
    if (filterCategory === 'soft') {
      return ['blush-garden', 'strawberry-milk', 'peach-sorbet'].includes(theme.id);
    }
    if (filterCategory === 'cozy') {
      return ['cozy', 'sage-garden', 'matcha-latte', 'warm-cocoa'].includes(theme.id);
    }
    if (filterCategory === 'calm') {
      return ['lavender-dream', 'ocean-breeze', 'honey-chamomile'].includes(theme.id);
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100">
              Aesthetic Themes & Atmosphere
            </h2>
            <Badge variant="primary" icon={themeSymbol}>
              {THEMES.length} Themes Available
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Choose a soothing aesthetic palette to envelop your private My Little World♡ sanctuary.
          </p>
        </div>
      </div>

      {/* Current Theme Highlight Bar */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
              style={{
                backgroundColor: `${currentTheme.primaryColor}20`,
                color: currentTheme.accentColor,
              }}
            >
              <span>{currentTheme.icon}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-serif">
                  {currentTheme.name}
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                  Active Theme
                </span>
                <span className="text-xs text-slate-400">
                  {currentTheme.isDark ? '🌙 Twilight Mode' : '☀️ Soft Daylight'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentTheme.description}
              </p>
            </div>
          </div>

          {/* Color preview dots */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 mr-1">Palette:</span>
            <span
              className="w-6 h-6 rounded-full border border-black/10 shadow-2xs"
              style={{ backgroundColor: currentTheme.primaryColor }}
              title="Primary"
            />
            <span
              className="w-6 h-6 rounded-full border border-black/10 shadow-2xs"
              style={{ backgroundColor: currentTheme.secondaryColor }}
              title="Secondary"
            />
            <span
              className="w-6 h-6 rounded-full border border-black/10 shadow-2xs"
              style={{ backgroundColor: currentTheme.accentColor }}
              title="Accent"
            />
            <span
              className="w-6 h-6 rounded-full border border-black/10 shadow-2xs"
              style={{ backgroundColor: currentTheme.pageBg }}
              title="Background"
            />
          </div>
        </div>
      </Card>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Themes', icon: '🎨', count: THEMES.length },
          { id: 'soft', label: 'Soft & Floral', icon: '🌸', count: 3 },
          { id: 'cozy', label: 'Warm & Earthy', icon: '🧸', count: 4 },
          { id: 'calm', label: 'Calm & Oceanic', icon: '🪻', count: 3 },
          { id: 'dark', label: 'Twilight & Dark', icon: '🌙', count: 3 },
        ].map(cat => {
          const isActive = filterCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id as ThemeCategory)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                isActive
                  ? 'shadow-xs font-semibold'
                  : isDark
                  ? 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-slate-200'
                  : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900'
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: `${currentTheme.primaryColor}20`,
                      borderColor: currentTheme.primaryColor,
                      color: currentTheme.accentColor,
                    }
                  : undefined
              }
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className="text-[10px] opacity-70 ml-0.5">({cat.count})</span>
            </button>
          );
        })}
      </div>

      {/* Themes Grid */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredThemes.map(theme => {
            const isSelected = themeId === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => setThemeId(theme.id as ThemeId)}
                className={`relative rounded-3xl p-5 cursor-pointer transition-all duration-300 border text-left flex flex-col justify-between group ${
                  isSelected
                    ? 'ring-2 shadow-lg scale-[1.02]'
                    : 'hover:shadow-md hover:-translate-y-1'
                } ${
                  theme.isDark
                    ? 'bg-slate-900 border-slate-700/80 text-white'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
                style={
                  isSelected
                    ? {
                        borderColor: theme.accentColor,
                        outlineColor: theme.accentColor,
                      }
                    : undefined
                }
              >
                <div>
                  {/* Top card header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{theme.icon}</span>
                      <div>
                        <h4 className="font-bold text-sm font-serif flex items-center gap-1">
                          <span>{theme.name}</span>
                        </h4>
                        <span className="text-[11px] opacity-70">
                          {theme.isDark ? '🌙 Dark Twilight' : '☀️ Soft Light'}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs shadow-xs"
                        style={{ backgroundColor: theme.accentColor }}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <p className="text-xs opacity-75 leading-relaxed mb-4">
                    {theme.description}
                  </p>

                  {/* Aesthetic Mini UI Preview inside the card */}
                  <div
                    className="p-3 rounded-2xl border mb-3 space-y-2"
                    style={{
                      backgroundColor: theme.pageBg,
                      borderColor: `${theme.primaryColor}30`,
                      color: theme.textColor,
                    }}
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span>My Little World♡</span>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] text-white"
                        style={{ backgroundColor: theme.accentColor }}
                      >
                        {theme.symbol}
                      </span>
                    </div>
                    <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: '75%',
                          backgroundColor: theme.primaryColor,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Color swatches strip */}
                <div className="flex items-center justify-between pt-3 border-t border-inherit/40 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded-full border border-black/10"
                      style={{ backgroundColor: theme.primaryColor }}
                      title="Primary"
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/10"
                      style={{ backgroundColor: theme.secondaryColor }}
                      title="Secondary"
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/10"
                      style={{ backgroundColor: theme.accentColor }}
                      title="Accent"
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/10"
                      style={{ backgroundColor: theme.pageBg }}
                      title="Background"
                    />
                  </div>
                  <span
                    className="font-semibold text-xs transition-transform group-hover:translate-x-0.5"
                    style={{ color: theme.accentColor }}
                  >
                    {isSelected ? 'Active ✓' : 'Click to Apply'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
