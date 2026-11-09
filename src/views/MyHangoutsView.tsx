import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HangoutCard } from '../components/HangoutCard';
import { CalendarDays, Plus, Compass } from 'lucide-react';

export const MyHangoutsView: React.FC = () => {
  const { hangouts, currentUser, setActiveTab, setIsCreateHangoutModalOpen } = useApp();

  const [subTab, setSubTab] = useState<'attending' | 'hosting'>('attending');

  const attendingHangouts = hangouts.filter(h => h.attendeeIds.includes(currentUser.id));
  const hostingHangouts = hangouts.filter(h => h.host.id === currentUser.id);

  const displayedHangouts = subTab === 'attending' ? attendingHangouts : hostingHangouts;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs relative overflow-hidden">
        <div 
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
            <CalendarDays className="w-4 h-4" />
            <span>Personal Social Calendar</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            My Campus Hangout Plans & RSVPs
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
            All your confirmed campus hangouts, study sprints, and meetups in one place. Access your active Yap Channels and coordinate with other attendees.
          </p>
        </div>
      </div>

      {/* Segmented Sub Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border-subtle)]">
          <button
            onClick={() => setSubTab('attending')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              subTab === 'attending'
                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Attending ({attendingHangouts.length})
          </button>
          <button
            onClick={() => setSubTab('hosting')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              subTab === 'hosting'
                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Hosting ({hostingHangouts.length})
          </button>
        </div>

        <button
          onClick={() => setIsCreateHangoutModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-xs cursor-pointer"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        >
          <Plus className="w-4 h-4" />
          <span>Post Hangout</span>
        </button>
      </div>

      {/* Hangouts List */}
      {displayedHangouts.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-12 text-center">
          <Compass className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3 opacity-60" />
          <h3 className="text-sm font-bold text-[var(--text-primary)]">
            {subTab === 'attending'
              ? 'No upcoming hangouts on your calendar yet'
              : 'You haven’t posted any hangouts yet'}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-sm mx-auto">
            {subTab === 'attending'
              ? 'Browse the Discover feed to find study sprints, boba runs, or spikeball lawn hangs!'
              : 'Take the initiative! Organize a quick coffee yap, study lock-in, or pickleball session.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            {subTab === 'attending' ? (
              <button
                onClick={() => setActiveTab('discover')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                Browse Campus Hangouts
              </button>
            ) : (
              <button
                onClick={() => setIsCreateHangoutModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                Create Your First Hangout
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedHangouts.map(hangout => (
            <HangoutCard key={hangout.id} hangout={hangout} />
          ))}
        </div>
      )}
    </div>
  );
};
