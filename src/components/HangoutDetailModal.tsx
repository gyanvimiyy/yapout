import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  MapPin, 
  Clock, 
  Users, 
  MessageSquare, 
  Send, 
  Share2, 
  Check, 
  Sparkles,
  DollarSign,
  Wand2
} from 'lucide-react';
import { gemmaService } from '../services/gemmaService';

export const HangoutDetailModal: React.FC = () => {
  const { 
    selectedHangout, 
    setSelectedHangout, 
    currentUser, 
    toggleRSVP, 
    chats, 
    sendChatMessage,
    showToast
  } = useApp();

  const [messageText, setMessageText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedHangout) {
        setSelectedHangout(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedHangout, setSelectedHangout]);

  // Scroll to bottom of chat when new message arrives
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats, selectedHangout]);

  if (!selectedHangout) return null;

  const isAttending = selectedHangout.attendeeIds.includes(currentUser.id);
  const isFull = selectedHangout.attendeeIds.length >= selectedHangout.maxSpots && !isAttending;
  const hangoutMessages = chats[selectedHangout.id] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    sendChatMessage(selectedHangout.id, messageText.trim());
    setMessageText('');
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      showToast('Hangout link copied to clipboard! Share it with friends.', 'success');
    } catch {
      showToast('Hangout details ready to share!', 'info');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setSelectedHangout(null)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-3xl rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}
      >
        {/* Left Side: Hangout Info & Attendee list */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[var(--border-subtle)] overflow-y-auto">
          <div>
            {/* Header / Host Info */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-3">
                <img
                  src={selectedHangout.host.avatar}
                  alt={selectedHangout.host.name}
                  className="w-11 h-11 rounded-xl object-cover ring-1 ring-[var(--border-subtle)]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[var(--text-primary)]">
                      {selectedHangout.host.name}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)] font-normal">
                      · Host
                    </span>
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {selectedHangout.host.major} · {selectedHangout.host.college}
                  </div>
                </div>
              </div>

              {selectedHangout.matchScore && (
                <div 
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold"
                  style={{ 
                    backgroundColor: 'var(--accent-subtle)', 
                    color: 'var(--accent-primary)',
                    border: '1px solid var(--accent-border)'
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{selectedHangout.matchScore}% Match</span>
                </div>
              )}
            </div>

            {/* Hangout Title & Agenda */}
            <div className="mt-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)] leading-snug">
                {selectedHangout.title}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                {selectedHangout.description}
              </p>
            </div>

            {/* Logistics & Location Details */}
            <div className="mt-4 p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[var(--text-primary)] font-medium">
                <Clock className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                <span>{selectedHangout.date} · {selectedHangout.time} ({selectedHangout.duration})</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--text-primary)] font-medium">
                <MapPin className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                <span>{selectedHangout.campusSpot}</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <DollarSign className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                <span>{selectedHangout.costNote} · {selectedHangout.vibe}</span>
              </div>
            </div>

            {/* Attendees Section */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  Attendees ({selectedHangout.attendeeIds.length} / {selectedHangout.maxSpots})
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {selectedHangout.maxSpots - selectedHangout.attendeeIds.length} spots open
                </span>
              </div>

              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {selectedHangout.attendees.map(attendee => {
                  const isUser = attendee.id === currentUser.id;
                  const isHost = attendee.id === selectedHangout.host.id;
                  return (
                    <div 
                      key={attendee.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={attendee.avatar}
                          alt={attendee.name}
                          className="w-6 h-6 rounded-md object-cover"
                        />
                        <span className="font-semibold text-[var(--text-primary)]">
                          {attendee.name} {isUser && '(You)'}
                        </span>
                      </div>
                      <span className="text-[11px] text-[var(--text-muted)]">
                        {isHost ? 'Host' : attendee.major}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 mt-4 border-t border-[var(--border-subtle)] flex items-center gap-2.5">
            <button
              onClick={() => toggleRSVP(selectedHangout.id)}
              disabled={isFull && !isAttending}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                isAttending
                  ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] border border-[var(--accent-border)] hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600'
                  : isFull
                  ? 'bg-[var(--bg-surface-hover)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-subtle)]'
                  : 'text-white shadow-xs hover:opacity-95'
              }`}
              style={{
                backgroundColor: !isAttending && !isFull ? 'var(--accent-primary)' : undefined
              }}
            >
              {isAttending ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>You're Going (Click to Leave)</span>
                </>
              ) : isFull ? (
                <span>Hangout is Full</span>
              ) : (
                <span>RSVP for Hangout</span>
              )}
            </button>

            <button
              onClick={handleCopyLink}
              className="p-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
              title="Share hangout"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Side: Live Group Yap Channel */}
        <div className="w-full md:w-1/2 flex flex-col bg-[var(--bg-subtle)]/50 h-80 md:h-[500px]">
          {/* Yap Channel Header */}
          <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[var(--text-primary)]">
                  Yap Channel
                </h3>
                <span className="text-[10px] text-[var(--text-muted)]">
                  Live chat with attendees
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedHangout(null)}
              className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-surface-hover)] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {hangoutMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <MessageSquare className="w-8 h-8 text-[var(--text-muted)] opacity-50 mb-2" />
                <p className="text-xs font-semibold text-[var(--text-primary)]">
                  No messages yet
                </p>
                <p className="text-[11px] text-[var(--text-secondary)] mt-1 max-w-xs">
                  Say hi to everyone going, coordinate parking or seats, and kick off the hangout!
                </p>
              </div>
            ) : (
              hangoutMessages.map(msg => {
                const isMe = msg.sender.id === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 ${isMe ? 'flex-row-reverse' : ''}`}
                  >
                    <img
                      src={msg.sender.avatar}
                      alt={msg.sender.name}
                      className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className={`max-w-[80%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] mb-0.5">
                        <span className="font-semibold text-[var(--text-secondary)]">
                          {isMe ? 'You' : msg.sender.name}
                        </span>
                        <span>·</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <div
                        className={`py-2 px-3 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'text-white rounded-tr-xs'
                            : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-tl-xs shadow-xs'
                        }`}
                        style={{
                          backgroundColor: isMe ? 'var(--accent-primary)' : undefined
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input Box with Gemma 4 Icebreaker Bar */}
          <div className="p-3 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[var(--accent-primary)]" />
                <span>Gemma 4 Social AI</span>
              </span>
              <button
                type="button"
                onClick={async () => {
                  try {
                    showToast('Asking Gemma 4 for an icebreaker...', 'info');
                    const icebreaker = await gemmaService.generateIcebreakers(
                      selectedHangout.title,
                      selectedHangout.vibe,
                      1
                    );
                    const clean = icebreaker.replace(/^1\.\s*|^\*\s*|^"/, '').replace(/"$/, '').trim();
                    setMessageText(clean);
                    showToast('Gemma 4 icebreaker ready! Hit send to share.', 'success');
                  } catch (err: any) {
                    showToast(err.message || 'Failed to get icebreaker', 'error');
                  }
                }}
                className="text-[10px] font-bold text-[var(--accent-primary)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Wand2 className="w-3 h-3" />
                <span>Get Icebreaker</span>
              </button>
            </div>

            <form 
              onSubmit={handleSendMessage}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                placeholder="Drop a message in the Yap Channel..."
                className="flex-1 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-ring)]"
              />
              <button
                type="submit"
                disabled={!messageText.trim()}
                className="p-2 rounded-xl text-white disabled:opacity-40 transition-opacity cursor-pointer shrink-0"
                style={{ backgroundColor: 'var(--accent-primary)' }}
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
