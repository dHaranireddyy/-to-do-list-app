import React from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Dashboard } from './pages/Dashboard';
import { ClockPage } from './pages/ClockPage';
import { JournalPage } from './pages/JournalPage';
import { TodoPage } from './pages/TodoPage';
import { DreamsPage } from './pages/DreamsPage';
import { ProgressPage } from './pages/ProgressPage';
import { ThemesPage } from './pages/ThemesPage';
import { SettingsPage } from './pages/SettingsPage';
import { LockModal } from './pages/LockModal';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();
  const { currentTheme, isDark } = useTheme();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard />;
      case 'clock':
        return <ClockPage />;
      case 'journal':
        return <JournalPage />;
      case 'todo':
        return <TodoPage />;
      case 'dreams':
        return <DreamsPage />;
      case 'progress':
        return <ProgressPage />;
      case 'themes':
        return <ThemesPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row relative transition-colors duration-500 selection:bg-pink-300 selection:text-pink-900 ${
        isDark ? 'dark text-slate-100' : 'text-slate-800'
      }`}
      style={{
        backgroundColor: currentTheme.pageBg,
      }}
    >
      {/* Subtle atmospheric backdrop gradients */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-20 transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 10% 20%, ${currentTheme.primaryColor}20 0%, transparent 40%), radial-gradient(circle at 90% 80%, ${currentTheme.secondaryColor}25 0%, transparent 40%)`,
        }}
      />

      {/* Desktop Left Sidebar */}
      <Sidebar />

      {/* Mobile Top & Bottom Nav */}
      <MobileNav />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 px-4 sm:px-8 py-4 sm:py-6 overflow-x-hidden relative z-10">
        <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col">
          <Header />
          <div className="flex-1 mt-2">
            {renderActivePage()}
          </div>
        </div>
      </main>

      {/* Privacy Lock Modal */}
      <LockModal />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </ThemeProvider>
  );
}
