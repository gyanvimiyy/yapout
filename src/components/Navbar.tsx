import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Compass, 
  Zap, 
  Users, 
  HeartHandshake, 
  CalendarDays, 
  Palette, 
  Sun, 
  Moon, 
  Bell, 
  Plus, 
  CheckCheck,
  ChevronDown,
  UserCheck,
  Bot,
  Sparkles
} from 'lucide-react';
import { NavTab } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    allUsers,
    switchUser,
    activeTab, 
    setActiveTab, 
    setIsThemeModalOpen, 
    setIsCreateHangoutModalOpen, 
    setIsProfileModalOpen,
    setIsGemmaModalOpen,
    beacons,
    notifications,
    markNotificationAsRead,
    clearNotifications
  } = useApp();

  const { effectiveMode, toggleQuickMode, currentAccentInfo } = useTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close popups on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'discover', label: 'Discover', icon: <Compass className="w-4 h-4" /> },
    { id: 'radar', label: 'Live Radar', icon: <Zap className="w-4 h-4" />, badge: beacons.length },
    { id: 'circles', label: 'Circles', icon: <Users className="w-4 h-4" /> },
    { id: 'matchmaker', label: 'Matchmaker', icon: <HeartHandshake className="w-4 h-4" /> },
    { id: 'my-hangouts', label: 'My Plans', icon: <CalendarDays className="w-4 h-4" /> }
  ];

  return (
    <>
      {/* Desktop & Main Header */}
      <header className="sticky top-0 z-40 w-full bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] shadow-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('discover')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-sm transition-transform group-hover:scale-105"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                <span>Y</span>
                <span className="text-xs font-black">!</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-[var(--text-primary)] leading-none flex items-center gap-1">
                  YapOut
                  <span 
                    className="w-2 h-2 rounded-full inline-block" 
                    style={{ backgroundColor: 'var(--accent-primary)' }} 
                  />
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-medium tracking-wide uppercase mt-0.5">
                  Campus Hangouts & Circles
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                      isActive
                        ? 'text-[var(--accent-primary)] bg-[var(--accent-subtle)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span 
                        className="text-[10px] px-1.5 py-0.2 rounded-full text-white font-bold"
                        style={{ backgroundColor: 'var(--accent-primary)' }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Quick Dark/Light Toggle */}
            <button
              onClick={toggleQuickMode}
              className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] transition-colors"
              title={`Switch to ${effectiveMode === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle dark/light theme"
            >
              {effectiveMode === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Gemma 4 AI Assistant Button */}
            <button
              onClick={() => setIsGemmaModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border border-[var(--accent-border)] bg-[var(--accent-subtle)] text-[var(--accent-primary)] hover:opacity-95 shadow-2xs cursor-pointer"
              title="Open Gemma 4 AI Campus Social Copilot"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="hidden sm:inline">Gemma 4 AI</span>
            </button>

            {/* Theme & Appearance Customizer Button */}
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] transition-colors"
              title="Change theme mode & accent palette"
            >
              <Palette className="w-4 h-4 text-[var(--accent-primary)]" />
              <span className="hidden lg:inline text-xs">Themes</span>
              <span 
                className="w-2.5 h-2.5 rounded-full inline-block border border-white/40 shadow-xs"
                style={{ backgroundColor: currentAccentInfo.hex }}
              />
            </button>

            {/* Notifications Menu */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center animate-pulse"
                    style={{ backgroundColor: 'var(--accent-primary)' }}
                  >
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                    <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                      Notifications & Updates
                    </span>
                    {unreadNotifs > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-[11px] text-[var(--accent-primary)] hover:underline flex items-center gap-1"
                      >
                        <CheckCheck className="w-3 h-3" />
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-[var(--border-subtle)] max-h-72 overflow-y-auto mt-2">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-[var(--text-muted)]">
                        No notifications yet. You're all caught up!
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationAsRead(notif.id)}
                          className={`py-2.5 px-1 flex flex-col gap-1 cursor-pointer hover:bg-[var(--bg-surface-hover)] rounded-lg transition-colors ${
                            !notif.read ? 'bg-[var(--accent-subtle)]/50' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[var(--text-primary)]">
                              {notif.title}
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)]">
                              {notif.timeAgo}
                            </span>
                          </div>
                          <p className="text-[11px] text-[var(--text-secondary)] leading-snug">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Post Hangout CTA Button */}
            <button
              onClick={() => setIsCreateHangoutModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:opacity-95 active:scale-95 cursor-pointer"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Post Hangout</span>
            </button>

            {/* Active User Switcher / Profile Button */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] transition-colors"
                aria-label="User profile and switcher"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-[var(--border-medium)]"
                />
                <span className="text-xs font-semibold text-[var(--text-primary)] hidden lg:inline max-w-[90px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              </button>

              {/* User Switcher Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl z-50 p-3 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center gap-3 p-2 bg-[var(--bg-subtle)] rounded-xl mb-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[var(--text-primary)] truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)] truncate">
                        {currentUser.major} · {currentUser.college}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 mb-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setIsProfileModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] rounded-xl transition-colors flex items-center justify-between"
                    >
                      <span>View & Edit My Profile</span>
                      <span className="text-[10px] text-[var(--accent-primary)] font-semibold">Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setIsThemeModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] rounded-xl transition-colors flex items-center justify-between"
                    >
                      <span>Themes & Appearance</span>
                      <Palette className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                    </button>
                  </div>

                  <div className="pt-2 border-t border-[var(--border-subtle)]">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] px-3 mb-1">
                      Switch Demo Student Profile
                    </div>
                    {allUsers.slice(0, 3).map(user => {
                      const isActive = user.id === currentUser.id;
                      return (
                        <button
                          key={user.id}
                          onClick={() => {
                            switchUser(user.id);
                            setShowUserMenu(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                            isActive
                              ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-semibold'
                              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-6 h-6 rounded-md object-cover"
                          />
                          <div className="flex-1 truncate">
                            <span className="truncate block font-medium">{user.name}</span>
                            <span className="text-[10px] text-[var(--text-muted)] block truncate">{user.major}</span>
                          </div>
                          {isActive && <UserCheck className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] px-2 py-1.5 shadow-lg flex items-center justify-around">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-semibold transition-all relative ${
                isActive
                  ? 'text-[var(--accent-primary)]'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && item.badge > 0 && (
                  <span 
                    className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                    style={{ backgroundColor: 'var(--accent-primary)' }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-1">{item.label}</span>
              {isActive && (
                <div 
                  className="w-1 h-1 rounded-full mt-0.5" 
                  style={{ backgroundColor: 'var(--accent-primary)' }} 
                />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
