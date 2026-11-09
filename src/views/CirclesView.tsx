import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CommunityCircle } from '../types';
import { Users, MessageSquare, Heart, Plus, Sparkles, ArrowLeft, Send } from 'lucide-react';

export const CirclesView: React.FC = () => {
  const {
    circles,
    circlePosts,
    toggleJoinCircle,
    addCirclePost,
    toggleLikePost,
    currentUser,
    selectedCircle,
    setSelectedCircle
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [newPostContent, setNewPostContent] = useState('');

  const categories = ['All', 'Interests', 'Clubs', 'Housing', 'Majors'];

  const filteredCircles = circles.filter(c => {
    if (activeCategory === 'All') return true;
    return c.category === activeCategory;
  });

  const handlePostSubmit = (e: React.FormEvent, circleId: string) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    addCirclePost(circleId, newPostContent.trim());
    setNewPostContent('');
  };

  // If a circle is selected, show Circle Details & Discussion Feed
  if (selectedCircle) {
    const posts = circlePosts[selectedCircle.id] || [];

    return (
      <div className="space-y-6 pb-12 animate-in fade-in duration-150">
        {/* Back Button */}
        <button
          onClick={() => setSelectedCircle(null)}
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Circles</span>
        </button>

        {/* Circle Banner */}
        <div className="rounded-3xl p-6 sm:p-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl p-3 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-2xl">
              {selectedCircle.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                  {selectedCircle.name}
                </h1>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-secondary)] font-medium">
                  {selectedCircle.category}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-lg">
                {selectedCircle.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mt-2">
                <span>{selectedCircle.memberCount} members</span>
                <span>·</span>
                <span>{selectedCircle.upcomingMeetupCount} upcoming meetups</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => toggleJoinCircle(selectedCircle.id)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
              selectedCircle.isMember
                ? 'bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-rose-500'
                : 'text-white'
            }`}
            style={{
              backgroundColor: !selectedCircle.isMember ? 'var(--accent-primary)' : undefined
            }}
          >
            {selectedCircle.isMember ? 'Joined (Click to Leave)' : 'Join Circle'}
          </button>
        </div>

        {/* Discussion Feed */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--text-primary)]">
              Circle Discussion & Yaps
            </h2>
            <span className="text-xs text-[var(--text-muted)]">
              {posts.length} discussions
            </span>
          </div>

          {/* New Post Form */}
          <form
            onSubmit={e => handlePostSubmit(e, selectedCircle.id)}
            className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-4 shadow-2xs space-y-3"
          >
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                Share a thought or meetup idea with {selectedCircle.name}...
              </span>
            </div>
            <textarea
              rows={2}
              value={newPostContent}
              onChange={e => setNewPostContent(e.target.value)}
              placeholder="What's happening on campus or in this circle today?"
              className="w-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newPostContent.trim()}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white disabled:opacity-40 shadow-xs cursor-pointer"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Yap</span>
              </button>
            </div>
          </form>

          {/* Posts List */}
          {posts.length === 0 ? (
            <div className="text-center py-10 text-xs text-[var(--text-muted)]">
              No yaps yet in this circle. Be the first to start the conversation!
            </div>
          ) : (
            posts.map(post => (
              <div
                key={post.id}
                className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-4 shadow-2xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-7 h-7 rounded-lg object-cover"
                    />
                    <div>
                      <span className="text-xs font-bold text-[var(--text-primary)]">
                        {post.author.name}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] ml-2">
                        {post.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                  {post.content}
                </p>

                <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center gap-4 text-xs">
                  <button
                    onClick={() => toggleLikePost(selectedCircle.id, post.id)}
                    className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                      post.isLiked
                        ? 'text-rose-500 font-bold'
                        : 'text-[var(--text-muted)] hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-rose-500' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                  <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.commentsCount} replies</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

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
            <Users className="w-4 h-4" />
            <span>Campus Tribes & Communities</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Find your campus crew & niche circles.
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
            Join interest clubs, housing dorm floors, and department circles. Stay plugged into ongoing campus conversations and circle-hosted meetups.
          </p>
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-[var(--accent-primary)] text-white shadow-xs'
                : 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Circles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCircles.map(circle => (
          <div
            key={circle.id}
            className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-5 shadow-xs hover:border-[var(--border-medium)] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="text-3xl p-2.5 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-xl">
                  {circle.icon}
                </div>
                <span className="text-[10px] font-semibold text-[var(--text-muted)] bg-[var(--bg-subtle)] px-2 py-0.5 rounded-md">
                  {circle.category}
                </span>
              </div>

              <h3 
                onClick={() => setSelectedCircle(circle)}
                className="text-base font-bold text-[var(--text-primary)] hover:text-[var(--accent-primary)] cursor-pointer transition-colors leading-snug"
              >
                {circle.name}
              </h3>

              <p className="text-xs text-[var(--text-secondary)] mt-1.5 line-clamp-2 leading-relaxed">
                {circle.tagline}
              </p>

              <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>{circle.memberCount} members</span>
                <span>{circle.upcomingMeetupCount} meetups</span>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-[var(--border-subtle)] flex items-center gap-2">
              <button
                onClick={() => setSelectedCircle(circle)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] transition-colors"
              >
                View Feed
              </button>
              <button
                onClick={() => toggleJoinCircle(circle.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  circle.isMember
                    ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] border border-[var(--accent-border)]'
                    : 'text-white shadow-xs hover:opacity-95'
                }`}
                style={{
                  backgroundColor: !circle.isMember ? 'var(--accent-primary)' : undefined
                }}
              >
                {circle.isMember ? 'Joined' : 'Join'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
