import React, { useState, useEffect } from 'react';
import { Sparkles, Globe, Sun, Moon, Sunrise, Sunset, Clock as ClockIcon } from 'lucide-react';
import { Card } from '../common/Card';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

export const LiveClock: React.FC = () => {
  const { currentTheme, isDark, themeSymbol } = useTheme();
  const { userProfile } = useApp();

  const [time, setTime] = useState(new Date());
  const [use24Hour, setUse24Hour] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour >= 5 && hour < 12) {
      return { text: 'Good Morning', icon: Sunrise, emoji: '☀️', color: '#F59E0B' };
    }
    if (hour >= 12 && hour < 17) {
      return { text: 'Good Afternoon', icon: Sun, emoji: '🌤️', color: '#EA580C' };
    }
    if (hour >= 17 && hour < 21) {
      return { text: 'Good Evening', icon: Sunset, emoji: '🌙', color: '#8B5CF6' };
    }
    return { text: 'Good Night', icon: Moon, emoji: '✨', color: '#6366F1' };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  // Format time strings
  const hours = use24Hour
    ? time.getHours().toString().padStart(2, '0')
    : time.toLocaleTimeString('en-US', { hour: '2-digit', hour12: true }).split(' ')[0];

  const minutes = time.toLocaleTimeString('en-US', { minute: '2-digit' }).padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const ampm = use24Hour ? '' : time.toLocaleTimeString('en-US', { hour12: true }).slice(-2);

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card className="text-center py-8 sm:py-10 px-6 relative overflow-hidden">
      {/* Top greeting badge and 12h/24h toggle */}
      <div className="flex items-center justify-between gap-2 max-w-lg mx-auto mb-3">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border shadow-2xs transition-colors"
          style={{
            backgroundColor: `${currentTheme.primaryColor}15`,
            borderColor: `${currentTheme.primaryColor}30`,
            color: currentTheme.accentColor,
          }}
        >
          <span>{greeting.emoji}</span>
          <span>
            {greeting.text}, {userProfile.name} ♡
          </span>
        </div>

        <button
          onClick={() => setUse24Hour(!use24Hour)}
          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
            isDark
              ? 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
              : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900'
          }`}
          title="Toggle 12h / 24h format"
        >
          {use24Hour ? '24-Hour' : '12-Hour'}
        </button>
      </div>

      {/* Main Big Digits */}
      <div className="flex items-baseline justify-center font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-slate-900 dark:text-white my-3 select-none">
        <span className="tabular-nums">{hours}</span>
        <span className="mx-1 sm:mx-2 animate-pulse" style={{ color: currentTheme.accentColor }}>
          :
        </span>
        <span className="tabular-nums">{minutes}</span>
        <span className="text-xl sm:text-3xl md:text-4xl font-sans text-slate-400 dark:text-slate-500 ml-2 font-mono tabular-nums">
          :{seconds}
        </span>
        {!use24Hour && (
          <span
            className="text-base sm:text-2xl font-sans font-bold px-2.5 sm:px-3 py-1 rounded-xl ml-2 sm:ml-4 border shadow-2xs align-middle"
            style={{
              backgroundColor: `${currentTheme.primaryColor}15`,
              color: currentTheme.accentColor,
              borderColor: `${currentTheme.primaryColor}30`,
            }}
          >
            {ampm}
          </span>
        )}
      </div>

      {/* Formatted Date */}
      <div className="flex items-center justify-center gap-2 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 mt-2">
        <span>{themeSymbol}</span>
        <span>{formattedDate}</span>
      </div>
    </Card>
  );
};
