import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-16 md:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let icon = <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
        if (toast.type === 'error') {
          icon = <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />;
        } else if (toast.type === 'info') {
          icon = <Info className="w-4 h-4 text-sky-500 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-2.5 p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl animate-in slide-in-from-bottom-2 duration-150"
          >
            <div className="mt-0.5">{icon}</div>
            <p className="flex-1 text-xs font-semibold text-[var(--text-primary)] leading-snug">
              {toast.message}
            </p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-0.5"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
