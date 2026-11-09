export type ThemeMode = 'light' | 'dark' | 'system';

export type AccentColor = 'coral' | 'emerald' | 'violet' | 'amber' | 'ocean' | 'mint';

export interface AccentInfo {
  id: AccentColor;
  name: string;
  hex: string;
  description: string;
  mood: string;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  college: string;
  major: string;
  year: string;
  bio: string;
  vibeTags: string[];
  interests: string[];
  badges: string[];
  socialLinks: {
    instagram?: string;
    discord?: string;
  };
  hangoutsHosted: number;
  hangoutsAttended: number;
  socialBattery: 'Introvert' | 'Ambivert' | 'Extrovert';
  hangoutStyle: string;
}

export type HangoutCategory = 
  | 'coffee'
  | 'study'
  | 'boba'
  | 'sports'
  | 'food'
  | 'outdoors'
  | 'gaming'
  | 'arts'
  | 'nightout';

export interface Hangout {
  id: string;
  title: string;
  description: string;
  category: HangoutCategory;
  host: UserProfile;
  campusSpot: string;
  date: string;
  time: string;
  duration: string;
  maxSpots: number;
  attendeeIds: string[];
  attendees: UserProfile[];
  vibe: string;
  costNote: string;
  tags: string[];
  matchScore?: number;
  createdAt: string;
}

export interface LiveBeacon {
  id: string;
  user: UserProfile;
  message: string;
  campusSpot: string;
  category: HangoutCategory;
  expiresInMinutes: number;
  createdAt: number;
  respondingUserIds: string[];
}

export interface CommunityCircle {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  category: 'Clubs' | 'Interests' | 'Housing' | 'Majors';
  memberCount: number;
  isMember: boolean;
  upcomingMeetupCount: number;
}

export interface CirclePost {
  id: string;
  circleId: string;
  author: UserProfile;
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
}

export interface YapMessage {
  id: string;
  hangoutId: string;
  sender: UserProfile;
  text: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  type: 'rsvp' | 'beacon' | 'chat' | 'circle';
  read: boolean;
}
