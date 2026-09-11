import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface BadgeProps {
  children: React.ReactNode;
  icon?: string;
  variant?: 'primary' | 'neutral' | 'success' | 'warning' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  icon,
  variant = 'primary',
  className = '',
}) => {
  const { currentTheme, isDark } = useTheme();

  const getStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : `${currentTheme.primaryColor}15`,
          color: isDark ? '#C7D2FE' : currentTheme.accentColor,
          borderColor: isDark ? 'rgba(99, 102, 241, 0.3)' : `${currentTheme.primaryColor}30`,
        };
      case 'neutral':
        return {
          backgroundColor: isDark ? 'rgba(51, 65, 85, 0.5)' : '#F1F5F9',
          color: isDark ? '#94A3B8' : '#64748B',
          borderColor: 'transparent',
        };
      case 'success':
        return {
          backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5',
          color: isDark ? '#6EE7B7' : '#059669',
          borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : '#A7F3D0',
        };
      case 'warning':
        return {
          backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB',
          color: isDark ? '#FCD34D' : '#D97706',
          borderColor: isDark ? 'rgba(245, 158, 11, 0.3)' : '#FDE68A',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: isDark ? '#CBD5E1' : '#475569',
          borderColor: isDark ? '#334155' : '#E2E8F0',
        };
    }
  };

  const style = getStyles();

  return (
    <span
      style={style}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${className}`}
    >
      {icon && <span className="text-xs">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
