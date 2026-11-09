import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { HangoutCategory } from '../types';
import { gemmaService } from '../services/gemmaService';
import { X, Sparkles, MapPin, Calendar, Clock, DollarSign, Users, AlertCircle, Wand2 } from 'lucide-react';

export const CreateHangoutModal: React.FC = () => {
  const { isCreateHangoutModalOpen, setIsCreateHangoutModalOpen, createHangout, showToast, currentUser } = useApp();

  const [aiIdeaPrompt, setAiIdeaPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HangoutCategory>('coffee');
  const [date, setDate] = useState('Today');
  const [time, setTime] = useState('4:30 PM - 6:00 PM');
  const [duration, setDuration] = useState('1.5 hours');
  const [campusSpot, setCampusSpot] = useState('');
  const [maxSpots, setMaxSpots] = useState(5);
  const [vibe, setVibe] = useState('Chill & Friendly');
  const [costNote, setCostNote] = useState('Free / Buy your own');
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleGemmaAutoPlan = async () => {
    if (!aiIdeaPrompt.trim() || isAiGenerating) return;
    setIsAiGenerating(true);
    try {
      const plan = await gemmaService.planHangout(aiIdeaPrompt.trim(), currentUser.college);
      if (plan.title) setTitle(plan.title);
      if (plan.category) setCategory(plan.category);
      if (plan.description) setDescription(plan.description);
      if (plan.campusSpot) setCampusSpot(plan.campusSpot);
      if (plan.vibe) setVibe(plan.vibe);
      if (plan.costNote) setCostNote(plan.costNote);
      if (plan.duration) setDuration(plan.duration);
      if (plan.maxSpots) setMaxSpots(plan.maxSpots);
      if (plan.tags) setTagInput(plan.tags.join(', '));
      showToast('✨ Gemma 4 generated your hangout plan!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gemma 4 planning failed', 'error');
    } finally {
      setIsAiGenerating(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCreateHangoutModalOpen) {
        setIsCreateHangoutModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCreateHangoutModalOpen, setIsCreateHangoutModalOpen]);

  if (!isCreateHangoutModalOpen) return null;

  const categories: { id: HangoutCategory; label: string; icon: string }[] = [
    { id: 'coffee', label: 'Coffee & Yap', icon: '☕' },
    { id: 'study', label: 'Study Sprint', icon: '📚' },
    { id: 'boba', label: 'Boba Run', icon: '🧋' },
    { id: 'sports', label: 'Pickleball / Sports', icon: '🏓' },
    { id: 'food', label: 'Food & Late Bites', icon: '🍕' },
    { id: 'outdoors', label: 'Sunset & Outdoors', icon: '🌅' },
    { id: 'gaming', label: 'Board Games / LAN', icon: '🎲' },
    { id: 'arts', label: 'Arts & Movies', icon: '🎬' },
    { id: 'nightout', label: 'Social & Night Out', icon: '✨' }
  ];

  const campusPresets = [
    'Caffe Strada (Outdoor Patio)',
    'Memorial Glade (Upper Lawn)',
    'Moffitt Library (3rd Floor Common Area)',
    'Hearst Gymnasium Tennis & Pickleball Courts',
    'MLK Jr. Student Union (Living Room)',
    'Sweetheart Cafe / Telegraph Ave',
    'Doe Memorial Library Steps'
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Please provide a hangout title';
    if (!campusSpot.trim()) errs.campusSpot = 'Please specify where on or around campus you will meet';
    if (!description.trim()) errs.description = 'Please add a brief description of what you will be doing';
    if (maxSpots < 2 || maxSpots > 30) errs.maxSpots = 'Spots must be between 2 and 30';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fill out the required fields', 'error');
      return;
    }

    const tags = tagInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    createHangout({
      title: title.trim(),
      description: description.trim(),
      category,
      campusSpot: campusSpot.trim(),
      date,
      time,
      duration,
      maxSpots,
      vibe,
      costNote,
      tags: tags.length > 0 ? tags : ['CampusHangout', 'YapOut'],
      matchScore: 95
    });

    // Reset form
    setTitle('');
    setDescription('');
    setCampusSpot('');
    setTagInput('');
    setErrors({});
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setIsCreateHangoutModalOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl p-6 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-base font-bold"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
                Post a Campus Hangout
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Gather a study sprint, grab boba, play pickleball, or organize a sunset lawn hangout.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateHangoutModalOpen(false)}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="py-5 overflow-y-auto space-y-5 flex-1 pr-1">
          {/* Gemma 4 Auto-Plan Assistant Card */}
          <div className="rounded-xl p-3.5 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
                <span>Auto-Plan with Gemma 4</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold">
                  AI Model
                </span>
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">
                Type an idea & Gemma fills the rest
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={aiIdeaPrompt}
                onChange={e => setAiIdeaPrompt(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleGemmaAutoPlan();
                  }
                }}
                placeholder="e.g. Late night boba run & CS project debrief after library closes"
                className="flex-1 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
              <button
                type="button"
                onClick={handleGemmaAutoPlan}
                disabled={!aiIdeaPrompt.trim() || isAiGenerating}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-xs disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shrink-0"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                {isAiGenerating ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Planning...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Generate Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Hangout Title */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
              Hangout Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
              }}
              placeholder="e.g. Afternoon Boba & Study Sprints at Caffe Strada"
              className={`w-full bg-[var(--bg-subtle)] border rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-ring)] ${
                errors.title ? 'border-rose-500' : 'border-[var(--border-subtle)] focus:border-[var(--accent-primary)]'
              }`}
            />
            {errors.title && (
              <span className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.title}
              </span>
            )}
          </div>

          {/* Activity Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
              Activity Category
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
              {categories.map(c => {
                const isSelected = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] font-bold text-[var(--accent-primary)] shadow-xs'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
                    }`}
                  >
                    <span>{c.icon}</span>
                    <span className="truncate">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date, Time, Duration Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                Date
              </label>
              <select
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              >
                <option value="Today">Today</option>
                <option value="Tonight">Tonight</option>
                <option value="Tomorrow">Tomorrow</option>
                <option value="This Friday">This Friday</option>
                <option value="This Saturday">This Saturday</option>
                <option value="This Sunday">This Sunday</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                Time
              </label>
              <input
                type="text"
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="4:00 PM - 5:30 PM"
                className="w-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="1.5 hours"
                className="w-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>

          {/* Campus Spot / Location */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              Campus Spot / Meeting Location *
            </label>
            <input
              type="text"
              value={campusSpot}
              onChange={e => {
                setCampusSpot(e.target.value);
                if (errors.campusSpot) setErrors(prev => ({ ...prev, campusSpot: '' }));
              }}
              placeholder="e.g. Caffe Strada Outdoor Patio, under the oak tree"
              className={`w-full bg-[var(--bg-subtle)] border rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-ring)] ${
                errors.campusSpot ? 'border-rose-500' : 'border-[var(--border-subtle)] focus:border-[var(--accent-primary)]'
              }`}
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[10px] text-[var(--text-muted)] self-center mr-1">Suggested:</span>
              {campusPresets.slice(0, 4).map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setCampusSpot(preset)}
                  className="px-2 py-0.5 rounded-md text-[10px] bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {preset.split('(')[0].trim()}
                </button>
              ))}
            </div>
            {errors.campusSpot && (
              <span className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.campusSpot}
              </span>
            )}
          </div>

          {/* Description & Vibe Details */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
              Hangout Agenda & Details *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => {
                setDescription(e.target.value);
                if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
              }}
              placeholder="What are you doing? What should people bring? Any vibe notes (e.g. beginner-friendly, silent focus, music)?"
              className={`w-full bg-[var(--bg-subtle)] border rounded-xl p-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-ring)] ${
                errors.description ? 'border-rose-500' : 'border-[var(--border-subtle)] focus:border-[var(--accent-primary)]'
              }`}
            />
            {errors.description && (
              <span className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.description}
              </span>
            )}
          </div>

          {/* Max Spots, Cost & Vibe tag */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                Max Attendees
              </label>
              <input
                type="number"
                min={2}
                max={30}
                value={maxSpots}
                onChange={e => setMaxSpots(parseInt(e.target.value) || 4)}
                className="w-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                Cost Note
              </label>
              <input
                type="text"
                value={costNote}
                onChange={e => setCostNote(e.target.value)}
                placeholder="Free / $5-10"
                className="w-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                Vibe Tone
              </label>
              <input
                type="text"
                value={vibe}
                onChange={e => setVibe(e.target.value)}
                placeholder="Cozy & Relaxed"
                className="w-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
              Search Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              placeholder="e.g. StudySprint, Boba, CS61B, FreshAir"
              className="w-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          {/* Form Submit */}
          <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateHangoutModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:opacity-95 active:scale-95 cursor-pointer"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              Publish Hangout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
