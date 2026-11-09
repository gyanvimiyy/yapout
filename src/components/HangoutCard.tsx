import React from 'react';
import { Hangout } from '../types';
import { useApp } from '../context/AppContext';
import { MapPin, Clock, Users, MessageSquare, Check, Sparkles } from 'lucide-react';

interface HangoutCardProps {
  hangout: Hangout;
}

export const HangoutCard: React.FC<HangoutCardProps> = ({ hangout }) => {
  const { currentUser, toggleRSVP, setSelectedHangout } = useApp();

  const isAttending = hangout.attendeeIds.includes(currentUser.id);
  const isFull = hangout.attendeeIds.length >= hangout.maxSpots && !isAttending;
  const spotsLeft = Math.max(0, hangout.maxSpots - hangout.attendeeIds.length);
  const percentFilled = Math.min(100, Math.round((hangout.attendeeIds.length / hangout.maxSpots) * 100));

  return (
    <div className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top Host & Vibe Match Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <img
              src={hangout.host.avatar}
              alt={hangout.host.name}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-[var(--border-subtle)]"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  {hangout.host.name}
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">
                  {hangout.host.year}
                </span>
              </div>
              <div className="text-[11px] text-[var(--text-secondary)]">
                {hangout.host.major} · {hangout.host.college}
              </div>
            </div>
          </div>

          {/* Vibe Match Indicator */}
          {hangout.matchScore && (
            <div 
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold"
              style={{ 
                backgroundColor: 'var(--accent-subtle)', 
                color: 'var(--accent-primary)',
                border: '1px solid var(--accent-border)'
              }}
              title="Calculated compatibility based on shared vibe, interests, and campus schedule"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{hangout.matchScore}% Match</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 
          onClick={() => setSelectedHangout(hangout)}
          className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors cursor-pointer leading-snug line-clamp-2"
        >
          {hangout.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-[var(--text-secondary)] mt-2 line-clamp-2 leading-relaxed">
          {hangout.description}
        </p>

        {/* Clean Unboxed Metadata with dividers */}
        <div className="mt-3.5 pt-3 border-t border-[var(--border-subtle)] space-y-1.5 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
            <span className="font-semibold text-[var(--text-primary)]">{hangout.date}</span>
            <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
            <span>{hangout.time}</span>
            <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
            <span className="text-[var(--text-muted)]">{hangout.duration}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
            <span className="truncate">{hangout.campusSpot}</span>
          </div>
        </div>

        {/* Cost & Vibe Tagline */}
        <div className="mt-3 flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
          <span className="font-medium text-[var(--text-secondary)]">{hangout.vibe}</span>
          <span aria-hidden="true">·</span>
          <span>{hangout.costNote}</span>
        </div>
      </div>

      {/* Footer Area: Attendee progress + Actions */}
      <div className="mt-5 pt-3.5 border-t border-[var(--border-subtle)]">
        {/* Spots & Attendees Row */}
        <div className="flex items-center justify-between text-xs mb-2.5">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span className="font-semibold text-[var(--text-primary)]">
              {hangout.attendeeIds.length} of {hangout.maxSpots} spots filled
            </span>
          </div>

          <span className="text-[11px] font-medium text-[var(--text-muted)]">
            {isFull ? (
              <span className="text-rose-500 font-bold">Filled</span>
            ) : (
              `${spotsLeft} spot${spotsLeft === 1 ? '' : 's'} open`
            )}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-[var(--bg-surface-hover)] overflow-hidden mb-4">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${percentFilled}%`,
              backgroundColor: isFull ? '#EF4444' : 'var(--accent-primary)'
            }}
          />
        </div>

        {/* Attendee Avatars Stack */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center -space-x-2 overflow-hidden">
            {hangout.attendees.slice(0, 5).map((att) => (
              <img
                key={att.id}
                src={att.avatar}
                alt={att.name}
                title={`${att.name} (${att.major})`}
                className="inline-block w-6 h-6 rounded-full ring-2 ring-[var(--bg-surface)] object-cover"
              />
            ))}
            {hangout.attendees.length > 5 && (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--bg-subtle)] text-[9px] font-bold text-[var(--text-secondary)] ring-2 ring-[var(--bg-surface)]">
                +{hangout.attendees.length - 5}
              </span>
            )}
          </div>

          {/* Details / Chat Button */}
          <button
            type="button"
            onClick={() => setSelectedHangout(hangout)}
            className="flex items-center gap-1 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Yap Channel</span>
          </button>
        </div>

        {/* Action Button: RSVP or Leave */}
        <button
          type="button"
          onClick={() => toggleRSVP(hangout.id)}
          disabled={isFull && !isAttending}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isAttending
              ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] border border-[var(--accent-border)] hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600'
              : isFull
              ? 'bg-[var(--bg-surface-hover)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-subtle)]'
              : 'text-white shadow-xs hover:opacity-95 active:scale-[0.98]'
          }`}
          style={{
            backgroundColor: !isAttending && !isFull ? 'var(--accent-primary)' : undefined
          }}
        >
          {isAttending ? (
            <>
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>You're In! (Click to Leave)</span>
            </>
          ) : isFull ? (
            <span>Hangout is Full</span>
          ) : (
            <span>RSVP for Hangout</span>
          )}
        </button>
      </div>
    </div>
  );
};
