import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { HangoutCard } from '../components/HangoutCard';
import { HangoutCategory } from '../types';
import { Search, SlidersHorizontal, Sparkles, Plus, Compass } from 'lucide-react';

export const DiscoverView: React.FC = () => {
  const { hangouts, setIsCreateHangoutModalOpen } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'match' | 'recent' | 'spots'>('match');

  const filterTabs: { id: string; label: string; icon?: string }[] = [
    { id: 'all', label: 'All Hangouts' },
    { id: 'coffee', label: 'Coffee & Yap', icon: '☕' },
    { id: 'study', label: 'Study Sprints', icon: '📚' },
    { id: 'boba', label: 'Boba Runs', icon: '🧋' },
    { id: 'sports', label: 'Pickleball & Rec', icon: '🏓' },
    { id: 'food', label: 'Late Bites', icon: '🍕' },
    { id: 'outdoors', label: 'Sunset & Lawn', icon: '🌅' },
    { id: 'arts', label: 'Arts & Movies', icon: '🎬' },
    { id: 'gaming', label: 'Board Games', icon: '🎲' }
  ];

  const filteredHangouts = useMemo(() => {
    return hangouts
      .filter(h => {
        // Category filter
        if (selectedCategory !== 'all' && h.category !== selectedCategory) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = h.title.toLowerCase().includes(q);
          const matchSpot = h.campusSpot.toLowerCase().includes(q);
          const matchDesc = h.description.toLowerCase().includes(q);
          const matchHost = h.host.name.toLowerCase().includes(q);
          const matchTags = h.tags.some(t => t.toLowerCase().includes(q));
          if (!matchTitle && !matchSpot && !matchDesc && !matchHost && !matchTags) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'match') {
          return (b.matchScore || 80) - (a.matchScore || 80);
        }
        if (sortBy === 'spots') {
          const spotsA = a.maxSpots - a.attendeeIds.length;
          const spotsB = b.maxSpots - b.attendeeIds.length;
          return spotsB - spotsA;
        }
        return 0;
      });
  }, [hangouts, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner with Campus Vibe */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs">
        {/* Subtle accent glow */}
        <div 
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        />
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
            <Sparkles className="w-4 h-4" />
            <span>Turn Campus Plans Into Real Social Hangouts</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight">
            Find your people. Grab a coffee, lock in a study sprint, or catch the sunset.
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
            Real plans with verified students and young adults. No awkward dead chats—just set a spot, RSVP, coordinate in the Yap Channel, and show up.
          </p>

          {/* Quick CTA button */}
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => setIsCreateHangoutModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:opacity-95 active:scale-95 cursor-pointer"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              <Plus className="w-4 h-4" />
              <span>Create a Hangout</span>
            </button>
            <span className="text-xs text-[var(--text-muted)]">
              {hangouts.length} active hangouts happening this week
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search hangouts by activity, campus spot, or tags (e.g. boba, Strada, CS61B)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-ring)] shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <span className="text-[11px] font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as 'match' | 'recent' | 'spots')}
                className="bg-transparent text-xs font-bold text-[var(--text-primary)] focus:outline-none cursor-pointer"
              >
                <option value="match" className="bg-[var(--bg-surface)]">Vibe Match %</option>
                <option value="spots" className="bg-[var(--bg-surface)]">Open Spots</option>
                <option value="recent" className="bg-[var(--bg-surface)]">Most Recent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Buttons (Functional Segmented Tabs) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {filterTabs.map(tab => {
            const isSelected = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as HangoutCategory | 'all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'text-white shadow-xs'
                    : 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                }`}
                style={{
                  backgroundColor: isSelected ? 'var(--accent-primary)' : undefined
                }}
              >
                {tab.icon && <span>{tab.icon}</span>}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hangouts Grid */}
      {filteredHangouts.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-12 text-center">
          <Compass className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3 opacity-60" />
          <h3 className="text-sm font-bold text-[var(--text-primary)]">
            No hangouts matched your filter
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-sm mx-auto">
            Try resetting your search query or be the first to post a hangout in this category!
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[var(--text-secondary)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setIsCreateHangoutModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-xs"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              Post a Hangout
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHangouts.map(hangout => (
            <HangoutCard key={hangout.id} hangout={hangout} />
          ))}
        </div>
      )}
    </div>
  );
};
