import React, { useEffect } from 'react';
import { useTheme, ACCENT_PALETTES } from '../context/ThemeContext';
import { AccentColor, ThemeMode } from '../types';
import { Sun, Moon, Laptop, Check, Sparkles, X, RotateCcw, Palette, ShieldCheck } from 'lucide-react';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({ isOpen, onClose }) => {
  const { mode, effectiveMode, accent, currentAccentInfo, setMode, setAccent } = useTheme();

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modeOptions: { id: ThemeMode; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'light',
      label: 'Light Mode',
      icon: <Sun className="w-5 h-5 text-amber-500" />,
      desc: 'Clean, bright, modern campus aesthetic'
    },
    {
      id: 'dark',
      label: 'Dark Mode',
      icon: <Moon className="w-5 h-5 text-indigo-400" />,
      desc: 'Comfortable dark surfaces with crisp contrast'
    },
    {
      id: 'system',
      label: 'System Mode',
      icon: <Laptop className="w-5 h-5 text-slate-400" />,
      desc: 'Automatically matches your device OS preference'
    }
  ];

  const handleReset = () => {
    setMode('system');
    setAccent('coral');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-modal-title"
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 id="theme-modal-title" className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
                Appearance & Theme Customization
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Personalize YapOut with light/dark surface modes and custom vibrant accent tones.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-surface-hover)] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="py-5 overflow-y-auto space-y-6 flex-1 pr-1">
          {/* Surface Mode Selection */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                1. Interface Surface Mode
              </label>
              <span className="text-xs text-[var(--text-muted)]">
                Active: <strong className="capitalize text-[var(--text-primary)]">{effectiveMode} ({mode})</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {modeOptions.map(opt => {
                const isSelected = mode === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setMode(opt.id)}
                    className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] shadow-sm'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                        {opt.icon}
                      </div>
                      {isSelected && (
                        <span 
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
                          style={{ backgroundColor: 'var(--accent-primary)' }}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{opt.label}</span>
                    <span className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Accent Palettes Selection */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                2. Coordinated Accent Color
              </label>
              <span className="text-xs text-[var(--text-muted)]">
                {currentAccentInfo.mood}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {ACCENT_PALETTES.map(p => {
                const isSelected = accent === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setAccent(p.id)}
                    className={`group p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] ring-2 ring-[var(--accent-ring)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-surface-hover)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div 
                        className="w-6 h-6 rounded-lg shadow-sm border border-white/20 transition-transform group-hover:scale-105"
                        style={{ backgroundColor: p.hex }}
                      />
                      {isSelected && (
                        <div 
                          className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px]"
                          style={{ backgroundColor: p.hex }}
                        >
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)] leading-tight mt-0.5">
                        {p.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Live Preview Sandbox */}
          <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)]">
                <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
                Live Theme Preview
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                WCAG AA Compliant
              </div>
            </div>

            {/* Mini preview component */}
            <div className="rounded-xl bg-[var(--bg-surface)] p-3.5 border border-[var(--border-subtle)] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: 'var(--accent-primary)' }}
                  >
                    YO
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)]">
                      Sunset Spikeball & Chill Lawn Hang
                    </h4>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      Memorial Glade · Today 5:45 PM
                    </p>
                  </div>
                </div>
                <span 
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                  style={{ 
                    backgroundColor: 'var(--accent-subtle)', 
                    color: 'var(--accent-primary)',
                    border: '1px solid var(--accent-border)'
                  }}
                >
                  98% Vibe Match
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-[var(--text-muted)]">
                  3 of 8 spots filled
                </span>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity shadow-sm"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                >
                  RSVP for Hangout
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-2 rounded-lg hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Defaults
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95 active:scale-95"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
