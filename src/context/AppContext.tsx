import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AppNotification,
  CirclePost,
  CommunityCircle,
  Hangout,
  HangoutCategory,
  LiveBeacon,
  UserProfile,
  YapMessage
} from '../types';
import {
  DEMO_USERS,
  INITIAL_BEACONS,
  INITIAL_CHATS,
  INITIAL_CIRCLES,
  INITIAL_CIRCLE_POSTS,
  INITIAL_HANGOUTS,
  INITIAL_NOTIFICATIONS,
  OTHER_STUDENTS
} from '../data/mockData';

export type NavTab = 'discover' | 'radar' | 'circles' | 'matchmaker' | 'my-hangouts';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  switchUser: (userId: string) => void;
  updateCurrentUserProfile: (updates: Partial<UserProfile>) => void;
  
  // Navigation & Modals
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
  isCreateHangoutModalOpen: boolean;
  setIsCreateHangoutModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isGemmaModalOpen: boolean;
  setIsGemmaModalOpen: (open: boolean) => void;
  
  // Selected detail drawers
  selectedHangout: Hangout | null;
  setSelectedHangout: (hangout: Hangout | null) => void;
  selectedCircle: CommunityCircle | null;
  setSelectedCircle: (circle: CommunityCircle | null) => void;
  
  // Hangouts
  hangouts: Hangout[];
  toggleRSVP: (hangoutId: string) => void;
  createHangout: (newHangout: Omit<Hangout, 'id' | 'host' | 'attendees' | 'attendeeIds' | 'createdAt'>) => void;
  
  // Beacons
  beacons: LiveBeacon[];
  broadcastBeacon: (beacon: { message: string; campusSpot: string; category: HangoutCategory; expiresInMinutes: number }) => void;
  respondToBeacon: (beaconId: string) => void;
  
  // Circles
  circles: CommunityCircle[];
  circlePosts: Record<string, CirclePost[]>;
  toggleJoinCircle: (circleId: string) => void;
  addCirclePost: (circleId: string, content: string) => void;
  toggleLikePost: (circleId: string, postId: string) => void;
  
  // Yap Chats
  chats: Record<string, YapMessage[]>;
  sendChatMessage: (hangoutId: string, text: string) => void;
  
  // Notifications & Toasts
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
}

const STORAGE_KEYS = {
  USER_ID: 'yapout_active_user_id',
  USER_PROFILES: 'yapout_user_profiles_v1',
  HANGOUTS: 'yapout_hangouts_v1',
  BEACONS: 'yapout_beacons_v1',
  CIRCLES: 'yapout_circles_v1',
  CIRCLE_POSTS: 'yapout_circle_posts_v1',
  CHATS: 'yapout_chats_v1'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Users state
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEMO_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_ID);
      if (saved && DEMO_USERS.some(u => u.id === saved)) return saved;
    } catch {}
    return DEMO_USERS[0].id;
  });

  const currentUser = userProfiles.find(u => u.id === currentUserId) || userProfiles[0];
  const allUsers = [...userProfiles, ...OTHER_STUDENTS];

  // Modals & Navigation
  const [activeTab, setActiveTab] = useState<NavTab>('discover');
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isCreateHangoutModalOpen, setIsCreateHangoutModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGemmaModalOpen, setIsGemmaModalOpen] = useState(false);
  
  const [selectedHangoutId, setSelectedHangoutId] = useState<string | null>(null);
  const [selectedCircleId, setSelectedCircleId] = useState<string | null>(null);

  // Hangouts
  const [hangouts, setHangouts] = useState<Hangout[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HANGOUTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_HANGOUTS;
  });

  // Beacons
  const [beacons, setBeacons] = useState<LiveBeacon[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BEACONS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_BEACONS;
  });

  // Circles
  const [circles, setCircles] = useState<CommunityCircle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CIRCLES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CIRCLES;
  });

  // Circle Posts
  const [circlePosts, setCirclePosts] = useState<Record<string, CirclePost[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CIRCLE_POSTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CIRCLE_POSTS;
  });

  // Chats
  const [chats, setChats] = useState<Record<string, YapMessage[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHATS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CHATS;
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_ID, currentUserId);
      localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(userProfiles));
      localStorage.setItem(STORAGE_KEYS.HANGOUTS, JSON.stringify(hangouts));
      localStorage.setItem(STORAGE_KEYS.BEACONS, JSON.stringify(beacons));
      localStorage.setItem(STORAGE_KEYS.CIRCLES, JSON.stringify(circles));
      localStorage.setItem(STORAGE_KEYS.CIRCLE_POSTS, JSON.stringify(circlePosts));
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }, [currentUserId, userProfiles, hangouts, beacons, circles, circlePosts, chats]);

  // Switch demo user
  const switchUser = (userId: string) => {
    const target = userProfiles.find(u => u.id === userId);
    if (target) {
      setCurrentUserId(userId);
      showToast(`Switched active profile to ${target.name}`, 'info');
    }
  };

  const updateCurrentUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfiles(prev =>
      prev.map(u => (u.id === currentUserId ? { ...u, ...updates } : u))
    );
    showToast('Profile updated successfully!', 'success');
  };

  // RSVP toggle
  const toggleRSVP = (hangoutId: string) => {
    setHangouts(prev =>
      prev.map(h => {
        if (h.id !== hangoutId) return h;

        const isAttending = h.attendeeIds.includes(currentUser.id);
        if (isAttending) {
          // Leave hangout
          const newAttendeeIds = h.attendeeIds.filter(id => id !== currentUser.id);
          const newAttendees = h.attendees.filter(a => a.id !== currentUser.id);
          showToast(`Left hangout: "${h.title}"`, 'info');
          return {
            ...h,
            attendeeIds: newAttendeeIds,
            attendees: newAttendees
          };
        } else {
          // Check if full
          if (h.attendeeIds.length >= h.maxSpots) {
            showToast('Sorry, this hangout is currently full!', 'error');
            return h;
          }
          // Join hangout
          const newAttendeeIds = [...h.attendeeIds, currentUser.id];
          const newAttendees = [...h.attendees, currentUser];
          showToast(`🎉 RSVP Confirmed for "${h.title}"! Added to your schedule.`, 'success');
          return {
            ...h,
            attendeeIds: newAttendeeIds,
            attendees: newAttendees
          };
        }
      })
    );
  };

  // Create hangout
  const createHangout = (
    newHangoutData: Omit<Hangout, 'id' | 'host' | 'attendees' | 'attendeeIds' | 'createdAt'>
  ) => {
    const newId = `hangout-${Date.now()}`;
    const hangout: Hangout = {
      ...newHangoutData,
      id: newId,
      host: currentUser,
      attendees: [currentUser],
      attendeeIds: [currentUser.id],
      createdAt: 'Just now'
    };

    setHangouts(prev => [hangout, ...prev]);
    setIsCreateHangoutModalOpen(false);
    showToast('✨ Hangout posted successfully! Friends can now RSVP.', 'success');
  };

  // Broadcast Beacon
  const broadcastBeacon = (beaconData: {
    message: string;
    campusSpot: string;
    category: HangoutCategory;
    expiresInMinutes: number;
  }) => {
    const newBeacon: LiveBeacon = {
      id: `beacon-${Date.now()}`,
      user: currentUser,
      message: beaconData.message,
      campusSpot: beaconData.campusSpot,
      category: beaconData.category,
      expiresInMinutes: beaconData.expiresInMinutes,
      createdAt: Date.now(),
      respondingUserIds: []
    };

    setBeacons(prev => [newBeacon, ...prev]);
    showToast('⚡ Beacon broadcasted to the Campus Radar!', 'success');
  };

  // Respond to Beacon
  const respondToBeacon = (beaconId: string) => {
    setBeacons(prev =>
      prev.map(b => {
        if (b.id !== beaconId) return b;
        const alreadyIn = b.respondingUserIds.includes(currentUser.id);
        const newResponding = alreadyIn
          ? b.respondingUserIds.filter(id => id !== currentUser.id)
          : [...b.respondingUserIds, currentUser.id];

        if (alreadyIn) {
          showToast('Cancelled response to beacon', 'info');
        } else {
          showToast(`🙌 You let ${b.user.name} know you're heading over!`, 'success');
        }

        return { ...b, respondingUserIds: newResponding };
      })
    );
  };

  // Toggle Join Circle
  const toggleJoinCircle = (circleId: string) => {
    setCircles(prev =>
      prev.map(c => {
        if (c.id !== circleId) return c;
        const nextState = !c.isMember;
        const nextCount = nextState ? c.memberCount + 1 : c.memberCount - 1;
        showToast(nextState ? `Joined ${c.name}!` : `Left ${c.name}`, 'info');
        return {
          ...c,
          isMember: nextState,
          memberCount: Math.max(0, nextCount)
        };
      })
    );
  };

  // Add circle discussion post
  const addCirclePost = (circleId: string, content: string) => {
    const newPost: CirclePost = {
      id: `post-${Date.now()}`,
      circleId,
      author: currentUser,
      content,
      timestamp: 'Just now',
      likes: 1,
      isLiked: true,
      commentsCount: 0
    };

    setCirclePosts(prev => ({
      ...prev,
      [circleId]: [newPost, ...(prev[circleId] || [])]
    }));
    showToast('Post shared to circle!', 'success');
  };

  const toggleLikePost = (circleId: string, postId: string) => {
    setCirclePosts(prev => {
      const posts = prev[circleId] || [];
      const updated = posts.map(p => {
        if (p.id !== postId) return p;
        const liked = !p.isLiked;
        return {
          ...p,
          isLiked: liked,
          likes: liked ? p.likes + 1 : Math.max(0, p.likes - 1)
        };
      });
      return { ...prev, [circleId]: updated };
    });
  };

  // Send message in hangout chat
  const sendChatMessage = (hangoutId: string, text: string) => {
    if (!text.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const newMsg: YapMessage = {
      id: `msg-${Date.now()}`,
      hangoutId,
      sender: currentUser,
      text: text.trim(),
      timestamp: timeStr
    };

    setChats(prev => ({
      ...prev,
      [hangoutId]: [...(prev[hangoutId] || []), newMsg]
    }));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const selectedHangout = hangouts.find(h => h.id === selectedHangoutId) || null;
  const selectedCircle = circles.find(c => c.id === selectedCircleId) || null;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        switchUser,
        updateCurrentUserProfile,
        activeTab,
        setActiveTab,
        isThemeModalOpen,
        setIsThemeModalOpen,
        isCreateHangoutModalOpen,
        setIsCreateHangoutModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isGemmaModalOpen,
        setIsGemmaModalOpen,
        selectedHangout,
        setSelectedHangout: (h) => setSelectedHangoutId(h ? h.id : null),
        selectedCircle,
        setSelectedCircle: (c) => setSelectedCircleId(c ? c.id : null),
        hangouts,
        toggleRSVP,
        createHangout,
        beacons,
        broadcastBeacon,
        respondToBeacon,
        circles,
        circlePosts,
        toggleJoinCircle,
        addCirclePost,
        toggleLikePost,
        chats,
        sendChatMessage,
        notifications,
        markNotificationAsRead,
        clearNotifications,
        toasts,
        showToast,
        dismissToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
