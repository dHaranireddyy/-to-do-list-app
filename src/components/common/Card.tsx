import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  ...props
}) => {
  const { isDark } = useTheme();

  return (
    <div
      {...props}
      className={`relative rounded-2xl p-5 sm:p-6 transition-all duration-300 ${
        isDark
          ? 'bg-slate-900/80 border border-slate-800/80 text-slate-100 shadow-lg shadow-black/20'
          : 'bg-white/85 border border-white/60 text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md'
      } ${
        hoverable
          ? isDark
            ? 'hover:border-indigo-500/40 hover:shadow-indigo-950/30'
            : 'hover:shadow-[0_12px_35px_rgb(0,0,0,0.08)] hover:-translate-y-0.5'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
