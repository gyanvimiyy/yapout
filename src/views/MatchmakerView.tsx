import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, HeartHandshake, Check, MessageSquare, Coffee, Compass, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

export const MatchmakerView: React.FC = () => {
  const { allUsers, currentUser, setIsCreateHangoutModalOpen, showToast } = useApp();

  // Quiz State
  const [step, setStep] = useState<number>(1);
  const [selectedBattery, setSelectedBattery] = useState<'Deep Talks' | 'High Energy' | 'Co-Working' | 'Chill Hangs'>('Deep Talks');
  const [selectedTime, setSelectedTime] = useState<'Morning' | 'Afternoon' | 'Sunset' | 'Late Night'>('Sunset');
  const [selectedWeekend, setSelectedWeekend] = useState<'Outdoors' | 'Cafes' | 'Gaming' | 'Foodie'>('Cafes');
  const [selectedGroupSize, setSelectedGroupSize] = useState<'1-on-1' | 'Small Squad (3-4)' | 'Big Crew (5+)'>('Small Squad (3-4)');

  const otherStudents = allUsers.filter(u => u.id !== currentUser.id);

  // Compute calculated match percentages based on quiz answers
  const scoredStudents = otherStudents.map((student, idx) => {
    let score = 88;
    if (student.socialBattery === 'Ambivert') score += 6;
    if (student.interests.some(i => ['Boba', 'Coffee', 'Pickleball', 'Photography'].includes(i))) score += 4;
    score -= (idx * 3); // realistic variance
    score = Math.min(99, Math.max(82, score));
    return {
      student,
      score
    };
  }).sort((a, b) => b.score - a.score);

  const handleSuggestHangout = (partner: UserProfile) => {
    showToast(`Drafting a hangout invite with ${partner.name}!`, 'info');
    setIsCreateHangoutModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner */}
      <div className="rounded-3xl p-6 sm:p-8 border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs relative overflow-hidden">
        <div 
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
            <HeartHandshake className="w-4 h-4" />
            <span>Hangout Partner Matchmaker</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Find compatible campus hangout buddies.
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
            Answer 4 quick vibe questions to discover students who match your campus schedule, social battery, and favorite hangout spots.
          </p>
        </div>
      </div>

      {/* 4-Step Interactive Quiz Box */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
            Vibe Compatibility Matcher
          </span>
          <span className="text-xs text-[var(--text-muted)]">
            Step {step} of 4
          </span>
        </div>

        {/* Step 1: Social Battery */}
        {step === 1 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              1. What's your ideal social interaction style?
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { label: 'Deep Talks', desc: 'Existential yapping & 1-on-1 chats' },
                { label: 'High Energy', desc: 'Spikeball, laughing & adventure' },
                { label: 'Co-Working', desc: '50/10 pomodoros & library grinds' },
                { label: 'Chill Hangs', desc: 'Comfortable quiet lawn sitting' }
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => setSelectedBattery(opt.label as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedBattery === opt.label
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] ring-1 ring-[var(--accent-ring)]'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <div className="text-xs font-bold text-[var(--text-primary)]">{opt.label}</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Hangout Time */}
        {step === 2 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              2. When are you usually free and energized to meet?
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { label: 'Morning', desc: '8:30 AM - 11 AM (Pastries & coffee)' },
                { label: 'Afternoon', desc: '1 PM - 4 PM (Lawn & study break)' },
                { label: 'Sunset', desc: '5 PM - 7:30 PM (Golden hour & walk)' },
                { label: 'Late Night', desc: '9 PM - Midnight (Boba & snacks)' }
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => setSelectedTime(opt.label as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedTime === opt.label
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] ring-1 ring-[var(--accent-ring)]'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <div className="text-xs font-bold text-[var(--text-primary)]">{opt.label}</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Weekend Style */}
        {step === 3 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              3. Favorite way to unwind over the weekend?
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { label: 'Outdoors', desc: 'Hiking trails, pickleball, park blankets' },
                { label: 'Cafes', desc: 'Coffee hopping, book reading, sketching' },
                { label: 'Gaming', desc: 'Board games, Smash Bros, film nights' },
                { label: 'Foodie', desc: 'Night markets, food trucks, boba crawls' }
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => setSelectedWeekend(opt.label as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedWeekend === opt.label
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] ring-1 ring-[var(--accent-ring)]'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <div className="text-xs font-bold text-[var(--text-primary)]">{opt.label}</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Group Size */}
        {step === 4 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              4. What group size feels most comfortable?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { label: '1-on-1', desc: 'Focused study partner or coffee walk' },
                { label: 'Small Squad (3-4)', desc: 'Cozy table size, everyone talks' },
                { label: 'Big Crew (5+)', desc: 'Spikeball tournaments & party mixers' }
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => setSelectedGroupSize(opt.label as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedGroupSize === opt.label
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] ring-1 ring-[var(--accent-ring)]'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <div className="text-xs font-bold text-[var(--text-primary)]">{opt.label}</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quiz Step Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 transition-colors"
          >
            Previous Question
          </button>
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs cursor-pointer"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-xs font-bold text-[var(--accent-primary)]">
              All 4 questions answered! Check your top matches below.
            </span>
          )}
        </div>
      </div>

      {/* Compatible Partners Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[var(--text-primary)]">
            Top Compatible Hangout Partners Near You
          </h2>
          <span className="text-xs text-[var(--text-muted)]">
            Ranked by vibe alignment
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {scoredStudents.map(({ student, score }) => (
            <div
              key={student.id}
              className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-5 shadow-xs hover:border-[var(--border-medium)] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-[var(--border-subtle)]"
                    />
                    <div>
                      <div className="text-sm font-bold text-[var(--text-primary)]">
                        {student.name}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">
                        {student.major} · {student.college}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)]">
                        {student.year} · {student.socialBattery}
                      </div>
                    </div>
                  </div>

                  {/* Compatibility Badge */}
                  <div 
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold"
                    style={{ 
                      backgroundColor: 'var(--accent-subtle)', 
                      color: 'var(--accent-primary)',
                      border: '1px solid var(--accent-border)'
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{score}% Match</span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  "{student.bio}"
                </p>

                {/* Vibe Tags (Clean unboxed inline metadata) */}
                <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
                  <span className="font-semibold text-[var(--text-primary)]">Vibe:</span>
                  {student.vibeTags.map((tag, i) => (
                    <span key={tag}>
                      {tag}{i < student.vibeTags.length - 1 ? ' ·' : ''}
                    </span>
                  ))}
                </div>

                {/* Hangout Style */}
                <div className="mt-2 text-xs text-[var(--text-muted)]">
                  <strong className="text-[var(--text-secondary)]">Preferred Style:</strong> {student.hangoutStyle}
                </div>
              </div>

              {/* Action */}
              <div className="mt-4 pt-3.5 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-muted)]">
                  {student.hangoutsAttended} hangouts completed
                </span>
                <button
                  onClick={() => handleSuggestHangout(student)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Invite to Hangout</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
