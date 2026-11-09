import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HangoutCategory } from '../types';
import { Zap, MapPin, Clock, Plus, Users, Check, AlertCircle, Compass, Sparkles, Wand2 } from 'lucide-react';
import { gemmaService } from '../services/gemmaService';

export const LiveRadarView: React.FC = () => {
  const { beacons, broadcastBeacon, respondToBeacon, currentUser, showToast } = useApp();

  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [message, setMessage] = useState('');
  const [campusSpot, setCampusSpot] = useState('');
  const [category, setCategory] = useState<HangoutCategory>('coffee');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [zoneFilter, setZoneFilter] = useState('all');

  const campusSpots = [
    'Moffitt Library 3rd Floor Terrace',
    'Caffe Strada Outdoor Tables',
    'Hearst Gymnasium Tennis Courts',
    'Memorial Glade Lawn',
    'Golden Bear Cafe Plaza',
    'MLK Student Union Living Room'
  ];

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !campusSpot.trim()) {
      showToast('Please provide a message and location', 'error');
      return;
    }

    broadcastBeacon({
      message: message.trim(),
      campusSpot: campusSpot.trim(),
      category,
      expiresInMinutes: durationMinutes
    });

    setMessage('');
    setCampusSpot('');
    setIsBroadcasting(false);
  };

  const filteredBeacons = beacons.filter(b => {
    if (zoneFilter === 'all') return true;
    return b.campusSpot.toLowerCase().includes(zoneFilter.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs relative overflow-hidden">
        <div 
          className="absolute -right-16 -top-16 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
            <Zap className="w-4 h-4" />
            <span>Spontaneous Hangout Radar</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Live Campus Beacons · Free right now?
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
            Spontaneous, real-time mini-hangouts happening right now. Drop a beacon when you have an hour free between classes, or jump in when someone nearby needs company.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => setIsBroadcasting(!isBroadcasting)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:opacity-95 active:scale-95 cursor-pointer"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              <Plus className="w-4 h-4" />
              <span>{isBroadcasting ? 'Cancel Beacon' : 'Drop a Campus Beacon'}</span>
            </button>
            <span className="text-xs text-[var(--text-muted)]">
              Beacons expire automatically after 30-60 mins
            </span>
          </div>
        </div>
      </div>

      {/* Broadcast Form Drawer */}
      {isBroadcasting && (
        <form
          onSubmit={handleBroadcast}
          className="rounded-2xl border border-[var(--accent-border)] bg-[var(--bg-surface)] p-5 shadow-lg animate-in slide-in-from-top-3 duration-200 space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
              <Zap className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>Broadcast a Live Campus Beacon</span>
            </div>
            <span className="text-[11px] text-[var(--text-muted)]">
              Visible to nearby campus students
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[var(--text-primary)]">
                What are you up to right now? *
              </label>
              <button
                type="button"
                onClick={async () => {
                  try {
                    showToast('Generating spontaneous beacon with Gemma 4...', 'info');
                    const generated = await gemmaService.generateBeacon(
                      campusSpot || 'campus commons',
                      durationMinutes,
                      'coffee and casual yap'
                    );
                    setMessage(generated);
                    showToast('Gemma 4 drafted your beacon!', 'success');
                  } catch (err: any) {
                    showToast(err.message || 'Failed to draft beacon', 'error');
                  }
                }}
                className="text-[10px] font-bold text-[var(--accent-primary)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>AI Draft with Gemma 4</span>
              </button>
            </div>
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="e.g. Free for next 45 min at Caffe Strada, craving a quick yap!"
              className="w-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                Where are you located? *
              </label>
              <input
                type="text"
                value={campusSpot}
                onChange={e => setCampusSpot(e.target.value)}
                placeholder="e.g. Moffitt 3rd floor terrace corner table"
                className="w-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {campusSpots.slice(0, 3).map(spot => (
                  <button
                    key={spot}
                    type="button"
                    onClick={() => setCampusSpot(spot)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    {spot.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                Active For: {durationMinutes} Minutes
              </label>
              <input
                type="range"
                min={15}
                max={90}
                step={15}
                value={durationMinutes}
                onChange={e => setDurationMinutes(parseInt(e.target.value))}
                className="w-full accent-[var(--accent-primary)] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1">
                <span>15 min</span>
                <span>30 min</span>
                <span>45 min</span>
                <span>60 min</span>
                <span>90 min</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsBroadcasting(false)}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              Broadcast Now ⚡
            </button>
          </div>
        </form>
      )}

      {/* Campus Zone Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'Moffitt', 'Strada', 'Hearst', 'Glade'].map(zone => (
          <button
            key={zone}
            onClick={() => setZoneFilter(zone)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              zoneFilter === zone
                ? 'bg-[var(--accent-primary)] text-white shadow-xs'
                : 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            {zone === 'all' ? 'All Campus Zones' : `${zone} Spot`}
          </button>
        ))}
      </div>

      {/* Beacons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBeacons.map(beacon => {
          const isUser = beacon.user.id === currentUser.id;
          const hasResponded = beacon.respondingUserIds.includes(currentUser.id);
          return (
            <div
              key={beacon.id}
              className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-5 shadow-xs hover:border-[var(--border-medium)] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={beacon.user.avatar}
                      alt={beacon.user.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-[var(--border-subtle)]"
                    />
                    <div>
                      <div className="text-xs font-bold text-[var(--text-primary)]">
                        {beacon.user.name} {isUser && '(You)'}
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)]">
                        {beacon.user.major} · {beacon.user.college}
                      </div>
                    </div>
                  </div>

                  {/* Countdown indicator */}
                  <div 
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold"
                    style={{ 
                      backgroundColor: 'var(--accent-subtle)', 
                      color: 'var(--accent-primary)',
                      border: '1px solid var(--accent-border)'
                    }}
                  >
                    <Clock className="w-3.5 h-3.5 animate-pulse" />
                    <span>~{beacon.expiresInMinutes}m left</span>
                  </div>
                </div>

                {/* Beacon Message */}
                <p className="text-sm font-semibold text-[var(--text-primary)] leading-snug">
                  "{beacon.message}"
                </p>

                {/* Location */}
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mt-3">
                  <MapPin className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                  <span className="font-medium">{beacon.campusSpot}</span>
                </div>
              </div>

              {/* Footer response action */}
              <div className="mt-4 pt-3.5 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                  <Users className="w-3.5 h-3.5" />
                  <span>
                    {beacon.respondingUserIds.length > 0
                      ? `${beacon.respondingUserIds.length} heading over`
                      : 'Be the first to join!'}
                  </span>
                </div>

                {!isUser ? (
                  <button
                    onClick={() => respondToBeacon(beacon.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      hasResponded
                        ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] border border-[var(--accent-border)]'
                        : 'text-white shadow-xs hover:opacity-95'
                    }`}
                    style={{
                      backgroundColor: !hasResponded ? 'var(--accent-primary)' : undefined
                    }}
                  >
                    {hasResponded ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>I'm on my way!</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>+1 I'm in!</span>
                      </>
                    )}
                  </button>
                ) : (
                  <span className="text-[11px] text-[var(--text-muted)] font-medium">
                    Your active broadcast
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
