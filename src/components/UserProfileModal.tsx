import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme, ACCENT_PALETTES } from '../context/ThemeContext';
import { X, Sparkles, User, Palette, Check, ShieldCheck, Sun, Moon, Laptop, Edit3 } from 'lucide-react';
import { ThemeMode } from '../types';

export const UserProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    currentUser,
    allUsers,
    switchUser,
    updateCurrentUserProfile,
    showToast
  } = useApp();

  const { mode, effectiveMode, accent, currentAccentInfo, setMode, setAccent } = useTheme();

  const [activeTab, setActiveTab] = useState<'profile' | 'themes'>('profile');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(currentUser.bio);
  const [vibeTagInput, setVibeTagInput] = useState(currentUser.vibeTags.join(', '));
  const [hangoutStyleInput, setHangoutStyleInput] = useState(currentUser.hangoutStyle);

  useEffect(() => {
    setBioInput(currentUser.bio);
    setVibeTagInput(currentUser.vibeTags.join(', '));
    setHangoutStyleInput(currentUser.hangoutStyle);
  }, [currentUser]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isProfileModalOpen) {
        setIsProfileModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProfileModalOpen, setIsProfileModalOpen]);

  if (!isProfileModalOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = vibeTagInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    updateCurrentUserProfile({
      bio: bioInput.trim(),
      vibeTags: tags,
      hangoutStyle: hangoutStyleInput.trim()
    });
    setIsEditingBio(false);
  };

  const modeOptions: { id: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { id: 'light', label: 'Light', icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { id: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4 text-indigo-400" /> },
    { id: 'system', label: 'System', icon: <Laptop className="w-4 h-4 text-slate-400" /> }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setIsProfileModalOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl p-6 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'profile'
                  ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Student Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('themes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'themes'
                  ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>Appearance & Themes</span>
            </button>
          </div>

          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-4 overflow-y-auto space-y-5 flex-1 pr-1">
          {activeTab === 'profile' ? (
            <div className="space-y-5">
              {/* Profile Card Summary */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[var(--border-medium)]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[var(--text-primary)]">
                        {currentUser.name}
                      </h3>
                      <span className="text-xs text-[var(--text-muted)] font-medium">
                        {currentUser.handle} · {currentUser.year}
                      </span>
                    </div>
                    <span 
                      className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                      style={{ 
                        backgroundColor: 'var(--accent-subtle)', 
                        color: 'var(--accent-primary)',
                        border: '1px solid var(--accent-border)'
                      }}
                    >
                      {currentUser.socialBattery}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    {currentUser.major} at {currentUser.college}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)] mt-2">
                    <span>{currentUser.hangoutsHosted} hosted</span>
                    <span>·</span>
                    <span>{currentUser.hangoutsAttended} attended</span>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                  Campus Badges & Recognition
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentUser.badges.map(b => (
                    <span
                      key={b}
                      className="text-xs px-2.5 py-1 rounded-lg bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium"
                    >
                      🏅 {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bio & Vibe Edit */}
              {!isEditingBio ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                      Bio & Campus Vibe
                    </span>
                    <button
                      onClick={() => setIsEditingBio(true)}
                      className="text-xs text-[var(--accent-primary)] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit Bio
                    </button>
                  </div>
                  <p className="text-xs text-[var(--text-primary)] leading-relaxed p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                    "{currentUser.bio}"
                  </p>
                  <div className="text-xs text-[var(--text-muted)]">
                    <strong className="text-[var(--text-secondary)]">Vibe Tags:</strong>{' '}
                    {currentUser.vibeTags.join(' · ')}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    <strong className="text-[var(--text-secondary)]">Hangout Preference:</strong>{' '}
                    {currentUser.hangoutStyle}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-3 p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                      Bio
                    </label>
                    <textarea
                      rows={2}
                      value={bioInput}
                      onChange={e => setBioInput(e.target.value)}
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                      Vibe Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={vibeTagInput}
                      onChange={e => setVibeTagInput(e.target.value)}
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                      Hangout Style
                    </label>
                    <input
                      type="text"
                      value={hangoutStyleInput}
                      onChange={e => setHangoutStyleInput(e.target.value)}
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditingBio(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs"
                      style={{ backgroundColor: 'var(--accent-primary)' }}
                    >
                      Save Profile
                    </button>
                  </div>
                </form>
              )}

              {/* Switch Demo Accounts */}
              <div className="pt-3 border-t border-[var(--border-subtle)]">
                <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                  Switch Active Demo Student Account
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {allUsers.slice(0, 3).map(u => {
                    const isSelected = u.id === currentUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => switchUser(u.id)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)]'
                        }`}
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-7 h-7 rounded-lg object-cover"
                        />
                        <div className="truncate">
                          <div className="text-xs truncate">{u.name}</div>
                          <div className="text-[10px] text-[var(--text-muted)] truncate">{u.major.split(' ')[0]}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Theme Settings Tab */
            <div className="space-y-5">
              {/* Mode Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                  Surface Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {modeOptions.map(opt => {
                    const isSelected = mode === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setMode(opt.id)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                          isSelected
                            ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] font-bold text-[var(--text-primary)] shadow-xs'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
                        }`}
                      >
                        {opt.icon}
                        <span className="text-xs">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accent Palette Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                  Accent Color ({currentAccentInfo.name})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ACCENT_PALETTES.map(p => {
                    const isSelected = accent === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setAccent(p.id)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] ring-1 ring-[var(--accent-ring)]'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface-hover)]'
                        }`}
                      >
                        <div
                          className="w-5 h-5 rounded-md shrink-0 shadow-xs"
                          style={{ backgroundColor: p.hex }}
                        />
                        <div className="text-left truncate">
                          <div className="text-xs font-semibold text-[var(--text-primary)] truncate">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-[var(--text-muted)] truncate">
                            {p.mood}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-center justify-between text-xs">
                <span className="text-[var(--text-secondary)]">Saved automatically in browser storage</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Active
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[var(--border-subtle)] flex justify-end">
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
