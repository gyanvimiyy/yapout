/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { DiscoverView } from './views/DiscoverView';
import { LiveRadarView } from './views/LiveRadarView';
import { CirclesView } from './views/CirclesView';
import { MatchmakerView } from './views/MatchmakerView';
import { MyHangoutsView } from './views/MyHangoutsView';
import { ThemeModal } from './components/ThemeModal';
import { CreateHangoutModal } from './components/CreateHangoutModal';
import { HangoutDetailModal } from './components/HangoutDetailModal';
import { UserProfileModal } from './components/UserProfileModal';
import { GemmaAssistantModal } from './components/GemmaAssistantModal';
import { ToastContainer } from './components/ToastContainer';
import { Palette, Heart } from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    activeTab, 
    isThemeModalOpen, 
    setIsThemeModalOpen,
    isGemmaModalOpen,
    setIsGemmaModalOpen
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 md:pb-12">
        {activeTab === 'discover' && <DiscoverView />}
        {activeTab === 'radar' && <LiveRadarView />}
        {activeTab === 'circles' && <CirclesView />}
        {activeTab === 'matchmaker' && <MatchmakerView />}
        {activeTab === 'my-hangouts' && <MyHangoutsView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-6 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-[var(--text-primary)]">YapOut</span>
            <span>·</span>
            <span>Campus Hangouts, Communities & Spontaneous Activities</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Palette className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>Customize Appearance & Themes</span>
            </button>
            <span>·</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for campus life
            </span>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <ThemeModal 
        isOpen={isThemeModalOpen} 
        onClose={() => setIsThemeModalOpen(false)} 
      />
      <GemmaAssistantModal
        isOpen={isGemmaModalOpen}
        onClose={() => setIsGemmaModalOpen(false)}
      />
      <CreateHangoutModal />
      <HangoutDetailModal />
      <UserProfileModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ThemeProvider>
  );
}
