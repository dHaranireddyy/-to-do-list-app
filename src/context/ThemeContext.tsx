import React, { createContext, useContext, useEffect, useState } from 'react';
import { THEMES } from '../data/themes';
import { ThemeDefinition, ThemeId } from '../types';

interface ThemeContextType {
  currentTheme: ThemeDefinition;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  isDark: boolean;
  themeSymbol: string;
  themeIcon: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'my_little_world_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && THEMES.some(t => t.id === saved)) {
      return saved as ThemeId;
    }
    return 'blush-garden';
  });

  const currentTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

  const setThemeId = (id: ThemeId) => {
    setThemeIdState(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', themeId);
    if (currentTheme.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply CSS variables
    root.style.setProperty('--theme-primary', currentTheme.primaryColor);
    root.style.setProperty('--theme-secondary', currentTheme.secondaryColor);
    root.style.setProperty('--theme-accent', currentTheme.accentColor);
    root.style.setProperty('--theme-bg-page', currentTheme.pageBg);
    root.style.setProperty('--theme-bg-card', currentTheme.cardBg);
    root.style.setProperty('--theme-text-primary', currentTheme.textColor);
  }, [themeId, currentTheme]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themeId,
        setThemeId,
        isDark: !!currentTheme.isDark,
        themeSymbol: currentTheme.symbol,
        themeIcon: currentTheme.icon,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
