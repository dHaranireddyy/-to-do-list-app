import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ProgressBarProps {
  progress: number; // 0 to 100
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = false,
  className = '',
  size = 'md',
}) => {
  const { currentTheme, isDark } = useTheme();
  const clamped = Math.min(100, Math.max(0, progress));

  const heightMap = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Progress</span>
          <span className="font-semibold" style={{ color: currentTheme.accentColor }}>
            {clamped}%
          </span>
        </div>
      )}
      <div
        className={`w-full rounded-full overflow-hidden ${heightMap[size]} ${
          isDark ? 'bg-slate-800' : 'bg-slate-100/90'
        }`}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${clamped}%`,
            background: `linear-gradient(90deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`,
          }}
        />
      </div>
    </div>
  );
};
