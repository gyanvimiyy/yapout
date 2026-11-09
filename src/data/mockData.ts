import { AppNotification, CirclePost, CommunityCircle, Hangout, LiveBeacon, UserProfile, YapMessage } from '../types';

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user-maya',
    name: 'Maya Chen',
    handle: '@mayacodes',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    college: 'UC Berkeley',
    major: 'EECS & CogSci',
    year: 'Class of 2027',
    bio: 'Always down for late-night boba runs, Figma sprints, and sunset walks. Looking for study buddies who actually lock in for 50 mins then yap for 10.',
    vibeTags: ['Low-key extrovert', 'Golden hour lover', 'Fast walker', 'Tea > Coffee'],
    interests: ['UI/UX Design', 'Indie Rock', 'Pickleball', 'Boba', 'Hackathons'],
    badges: ['Campus Host (5+)', 'Boba Connoisseur', 'Early Bird Runner'],
    socialLinks: {
      instagram: 'maya.creates',
      discord: 'mayacodes#2024'
    },
    hangoutsHosted: 6,
    hangoutsAttended: 19,
    socialBattery: 'Ambivert',
    hangoutStyle: 'Small squads (3-4), cozy vibes, good food'
  },
  {
    id: 'user-alex',
    name: 'Alex Rivera',
    handle: '@alexfilms',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    college: 'UC Berkeley',
    major: 'Media Studies & Art Practice',
    year: 'Class of 2026',
    bio: '35mm film shooter, pickleball player, and seeker of the crispiest croissants. Let’s explore hidden spots around campus and shoot some portraits.',
    vibeTags: ['Spontaneous', 'A24 fan', 'Iced Americano', 'Night owl'],
    interests: ['Photography', 'Film Critiques', 'Pickleball', 'Vinyl Records', 'Coffee'],
    badges: ['Photo Walk Lead', 'Super Reliable', 'Spot Finder'],
    socialLinks: {
      instagram: 'alexrivera_photos',
      discord: 'arivera#4012'
    },
    hangoutsHosted: 9,
    hangoutsAttended: 24,
    socialBattery: 'Extrovert',
    hangoutStyle: 'Active outdoor adventures and lively discussions'
  },
  {
    id: 'user-jordan',
    name: 'Jordan Lee',
    handle: '@jordan_vibes',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    college: 'UC Berkeley',
    major: 'Business Administration',
    year: 'Class of 2025',
    bio: 'Board games aficionado, spikeball on the Glade, and late-night taco runs. Let us turn casual campus hours into unforgettable memories.',
    vibeTags: ['High energy', 'Spikeball captain', 'Board game master', 'Foodie'],
    interests: ['Strategy Games', 'Spikeball', 'Street Food', 'Acoustic Guitar', 'Bouldering'],
    badges: ['Social Catalyst', 'Tournament Host', 'Midnight Baker'],
    socialLinks: {
      instagram: 'jordanlee_biz',
      discord: 'jordan_l#9920'
    },
    hangoutsHosted: 12,
    hangoutsAttended: 38,
    socialBattery: 'Extrovert',
    hangoutStyle: 'High-energy game nights and spontaneous road trips'
  }
];

export const OTHER_STUDENTS: UserProfile[] = [
  {
    id: 'user-priya',
    name: 'Priya Sharma',
    handle: '@priyacodes',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    college: 'UC Berkeley',
    major: 'Data Science',
    year: 'Class of 2026',
    bio: 'Math + chai + deep talks about consciousness and technology.',
    vibeTags: ['Chai lover', 'Quiet focused', 'Deep thinker'],
    interests: ['Machine Learning', 'Philosophy', 'Chai', 'Hiking'],
    badges: ['Study Marathoner'],
    socialLinks: { instagram: 'priya_ds' },
    hangoutsHosted: 3,
    hangoutsAttended: 14,
    socialBattery: 'Introvert',
    hangoutStyle: 'Library lock-in followed by cafe unwinding'
  },
  {
    id: 'user-marcus',
    name: 'Marcus Vance',
    handle: '@marcus_v',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    college: 'UC Berkeley',
    major: 'Mechanical Engineering',
    year: 'Class of 2027',
    bio: 'Maker, robotics lab dweller, avid climbing gym visitor.',
    vibeTags: ['Hands-on builder', 'Climbing', 'Tea enthusiast'],
    interests: ['Robotics', 'Rock Climbing', '3D Printing', 'Lo-Fi'],
    badges: ['Campus Explorer'],
    socialLinks: { instagram: 'marcus_builds' },
    hangoutsHosted: 4,
    hangoutsAttended: 11,
    socialBattery: 'Ambivert',
    hangoutStyle: 'Activity-first, collaborative learning'
  },
  {
    id: 'user-chloe',
    name: 'Chloe Zhang',
    handle: '@chloezzz',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    college: 'UC Berkeley',
    major: 'Architecture',
    year: 'Class of 2026',
    bio: 'Sketching buildings, scouting sunny grass patches, thrift enthusiast.',
    vibeTags: ['Creative soul', 'Golden hour', 'Thrifting'],
    interests: ['Urbanism', 'Sketching', 'Matcha', 'Vintage Fashion'],
    badges: ['Design Curator'],
    socialLinks: { instagram: 'chloe_arch' },
    hangoutsHosted: 5,
    hangoutsAttended: 18,
    socialBattery: 'Ambivert',
    hangoutStyle: 'Sunny outdoor hangs and aesthetic spots'
  }
];

export const INITIAL_HANGOUTS: Hangout[] = [
  {
    id: 'hangout-1',
    title: 'Midterm Study Sprint + Strada Iced Latte ☕',
    description: 'Working through CS61B / Data 100 problem sets. Doing 50-minute focused pomodoros with 10-minute break for chatting, debriefing, and pastry runs. Come grab an outdoor table!',
    category: 'study',
    host: DEMO_USERS[0],
    campusSpot: 'Caffe Strada (Outdoor Patio, near Bancroft)',
    date: 'Today',
    time: '3:30 PM - 5:30 PM',
    duration: '2 hours',
    maxSpots: 5,
    attendeeIds: ['user-maya', 'user-priya', 'user-marcus'],
    attendees: [DEMO_USERS[0], OTHER_STUDENTS[0], OTHER_STUDENTS[1]],
    vibe: 'Focused & Chill (50/10 Pomodoro)',
    costNote: 'Free / Buy your own drink (~$5)',
    tags: ['StudySprint', 'Pomodoro', 'OutdoorPatio', 'CS'],
    matchScore: 98,
    createdAt: '2 hours ago'
  },
  {
    id: 'hangout-2',
    title: 'Casual Sunset Spikeball & Chill Lawn Hang 🏓',
    description: 'Bringing two Spikeball kits to Memorial Glade. Beginners and pros welcome! If you don’t want to play, just come sit on the blanket, listen to music, and watch the sunset over the bay.',
    category: 'sports',
    host: DEMO_USERS[2],
    campusSpot: 'Memorial Glade (Upper lawn near Doe Library)',
    date: 'Today',
    time: '5:45 PM - 7:30 PM',
    duration: '1.75 hours',
    maxSpots: 8,
    attendeeIds: ['user-jordan', 'user-alex', 'user-chloe'],
    attendees: [DEMO_USERS[2], DEMO_USERS[1], OTHER_STUDENTS[2]],
    vibe: 'High Energy & Golden Hour Smiles',
    costNote: '100% Free',
    tags: ['Spikeball', 'GoldenHour', 'MemorialGlade', 'SunsetVibes'],
    matchScore: 94,
    createdAt: '3 hours ago'
  },
  {
    id: 'hangout-3',
    title: 'Midnight Boba Run & Existential College Yapping 🧋',
    description: 'Need a mental reset after staring at terminal screens all day. Walking from Unit 1 down to Sweetheart Cafe for roasted oolong milk tea and deep philosophical chats about post-grad life.',
    category: 'boba',
    host: DEMO_USERS[1],
    campusSpot: 'Meet at Unit 1 Courtyard -> Sweetheart Cafe',
    date: 'Tonight',
    time: '9:30 PM - 11:00 PM',
    duration: '1.5 hours',
    maxSpots: 6,
    attendeeIds: ['user-alex', 'user-maya', 'user-chloe', 'user-jordan'],
    attendees: [DEMO_USERS[1], DEMO_USERS[0], OTHER_STUDENTS[2], DEMO_USERS[2]],
    vibe: 'Late Night Chats & Sweet Cravings',
    costNote: 'Boba ~$6-7',
    tags: ['BobaRun', 'LateNight', 'GoodConversations', 'Walking'],
    matchScore: 96,
    createdAt: '4 hours ago'
  },
  {
    id: 'hangout-4',
    title: 'Beginner-Friendly Pickleball Doubles 🎾',
    description: 'Have two extra paddles! Playing casual friendly doubles at Hearst Courts. No intense sweating required, just practicing dinks, serves, and laughing when balls fly over the fence.',
    category: 'sports',
    host: OTHER_STUDENTS[1],
    campusSpot: 'Hearst Gymnasium Tennis Courts (Court 2)',
    date: 'Tomorrow',
    time: '4:00 PM - 5:30 PM',
    duration: '1.5 hours',
    maxSpots: 4,
    attendeeIds: ['user-marcus', 'user-alex'],
    attendees: [OTHER_STUDENTS[1], DEMO_USERS[1]],
    vibe: 'Active, Fun & Welcoming',
    costNote: 'Free (Equipment provided)',
    tags: ['Pickleball', 'CampusRec', 'ActiveLife'],
    matchScore: 89,
    createdAt: '5 hours ago'
  },
  {
    id: 'hangout-5',
    title: 'A24 Movie Night & Homemade Popcorn 🍿',
    description: 'Watching Past Lives / Everything Everywhere in the floor lounge with the big projector. Cozy blankets, air-popped cheddar popcorn, and post-movie discussions on identity and destiny.',
    category: 'arts',
    host: OTHER_STUDENTS[2],
    campusSpot: 'Wurster Hall Lounge / 3rd Floor Common Room',
    date: 'Tomorrow',
    time: '8:00 PM - 10:30 PM',
    duration: '2.5 hours',
    maxSpots: 10,
    attendeeIds: ['user-chloe', 'user-maya', 'user-priya'],
    attendees: [OTHER_STUDENTS[2], DEMO_USERS[0], OTHER_STUDENTS[0]],
    vibe: 'Cozy, Aesthetic & Thoughtful',
    costNote: 'Free (Popcorn on the host)',
    tags: ['A24', 'Cinema', 'CozyNight', 'FilmClub'],
    matchScore: 91,
    createdAt: '6 hours ago'
  },
  {
    id: 'hangout-6',
    title: 'Late Night Taco Bell & Debriefing Session 🌮',
    description: 'Heading to the Shattuck Ave Taco Bell after library closes. Craving cheesy gordita crunches and honest life updates. If you have car seats, let us know!',
    category: 'food',
    host: DEMO_USERS[2],
    campusSpot: 'Doe Library Steps -> Taco Bell on Shattuck',
    date: 'Tonight',
    time: '11:15 PM - 12:30 AM',
    duration: '1.25 hours',
    maxSpots: 6,
    attendeeIds: ['user-jordan'],
    attendees: [DEMO_USERS[2]],
    vibe: 'Unfiltered, Laughs & Midnight Fuel',
    costNote: 'Cheap eats (~$6)',
    tags: ['LateNightEats', 'TacoBell', 'CollegeLife'],
    matchScore: 85,
    createdAt: '1 hour ago'
  }
];

export const INITIAL_BEACONS: LiveBeacon[] = [
  {
    id: 'beacon-1',
    user: DEMO_USERS[1],
    message: 'Free right now! Sitting at Moffitt 3rd floor terrace with extra iced matcha. Who wants to take a 20-min sun break? ☀️',
    campusSpot: 'Moffitt Library 3rd Floor Terrace',
    category: 'coffee',
    expiresInMinutes: 35,
    createdAt: Date.now() - 10 * 60 * 1000,
    respondingUserIds: ['user-maya', 'user-priya']
  },
  {
    id: 'beacon-2',
    user: OTHER_STUDENTS[1],
    message: 'Pickleball court 3 at Hearst is open! Need 1 or 2 more people for friendly rally right now! 🏓',
    campusSpot: 'Hearst Courts, Court 3',
    category: 'sports',
    expiresInMinutes: 48,
    createdAt: Date.now() - 5 * 60 * 1000,
    respondingUserIds: ['user-jordan']
  },
  {
    id: 'beacon-3',
    user: OTHER_STUDENTS[0],
    message: 'Anyone at Golden Bear Cafe? Grabbing lunch alone at the corner booth, come join if you’re hungry! 🥗',
    campusSpot: 'Golden Bear Cafe Patio',
    category: 'food',
    expiresInMinutes: 22,
    createdAt: Date.now() - 18 * 60 * 1000,
    respondingUserIds: []
  }
];

export const INITIAL_CIRCLES: CommunityCircle[] = [
  {
    id: 'circle-1',
    name: 'Late Night Chai & Code',
    tagline: 'For night owls building cool software, hacks, and creative scripts.',
    description: 'A community of student hackers, builders, and designers who thrive between 9 PM and 2 AM with a hot mug of chai or matcha.',
    icon: '☕',
    category: 'Interests',
    memberCount: 342,
    isMember: true,
    upcomingMeetupCount: 3
  },
  {
    id: 'circle-2',
    name: 'Memorial Glade Sunset Club',
    tagline: 'Blankets, frisbees, acoustic guitars, and golden hour views.',
    description: 'We track the sunset schedule and gather on the grass whenever the sky looks promising. Zero agenda, 100% wholesome vibes.',
    icon: '🌅',
    category: 'Interests',
    memberCount: 518,
    isMember: true,
    upcomingMeetupCount: 2
  },
  {
    id: 'circle-3',
    name: 'Campus Pickleball & Padel Crew',
    tagline: 'Casual dinks, friendly doubles, and weekend court takeovers.',
    description: 'Open to all skill levels! We coordinate court bookings, lend extra paddles, and organize friendly mini-tournaments.',
    icon: '🏓',
    category: 'Clubs',
    memberCount: 284,
    isMember: false,
    upcomingMeetupCount: 4
  },
  {
    id: 'circle-4',
    name: 'Design & Figma Jam Community',
    tagline: 'Portfolio reviews, aesthetic appreciation, and UI redesigns.',
    description: 'Product designers, illustrative artists, and front-end crafters hanging out to critique, inspire, and collaborate on cool apps.',
    icon: '🎨',
    category: 'Majors',
    memberCount: 195,
    isMember: true,
    upcomingMeetupCount: 1
  },
  {
    id: 'circle-5',
    name: 'Unit 1 & 2 Dorm Floor Crew',
    tagline: 'Campus housing hangout hub for study breaks and midnight snacks.',
    description: 'Connect with people living in the Southside dorms for dining hall meetups, late night grocery runs, and lounge movie nights.',
    icon: '🏢',
    category: 'Housing',
    memberCount: 412,
    isMember: false,
    upcomingMeetupCount: 2
  }
];

export const INITIAL_CIRCLE_POSTS: Record<string, CirclePost[]> = {
  'circle-1': [
    {
      id: 'post-1',
      circleId: 'circle-1',
      author: DEMO_USERS[0],
      content: 'Anyone working on their CS61B Gitlet project tonight? We got a table in Soda Hall 2nd floor with snacks and USB-C chargers!',
      timestamp: '1 hour ago',
      likes: 14,
      isLiked: true,
      commentsCount: 6
    },
    {
      id: 'post-2',
      circleId: 'circle-1',
      author: OTHER_STUDENTS[0],
      content: 'Hot take: Cinnamon cardamon chai > coffee when debugging complex async bugs. Change my mind ☕',
      timestamp: '4 hours ago',
      likes: 29,
      isLiked: false,
      commentsCount: 11
    }
  ],
  'circle-2': [
    {
      id: 'post-3',
      circleId: 'circle-2',
      author: DEMO_USERS[1],
      content: 'Clear skies forecasted today around 6:15 PM! Bringing my camera to take free golden hour headshots/portraits for anyone who wants one on the lawn.',
      timestamp: '2 hours ago',
      likes: 42,
      isLiked: true,
      commentsCount: 9
    }
  ]
};

export const INITIAL_CHATS: Record<string, YapMessage[]> = {
  'hangout-1': [
    {
      id: 'msg-1',
      hangoutId: 'hangout-1',
      sender: DEMO_USERS[0],
      text: 'Hey everyone! I’m grabbing the big wooden bench table under the oak tree at Strada right now 🌳',
      timestamp: '3:15 PM'
    },
    {
      id: 'msg-2',
      hangoutId: 'hangout-1',
      sender: OTHER_STUDENTS[0],
      text: 'Awesome, just leaving Dwinelle! Should be there in 7 minutes, see you soon!',
      timestamp: '3:20 PM'
    },
    {
      id: 'msg-3',
      hangoutId: 'hangout-1',
      sender: OTHER_STUDENTS[1],
      text: 'Bringing an extension cord in case we need extra laptop battery juice ⚡',
      timestamp: '3:22 PM'
    }
  ],
  'hangout-2': [
    {
      id: 'msg-4',
      hangoutId: 'hangout-2',
      sender: DEMO_USERS[2],
      text: 'Spikeball sets are loaded in my backpack! Look for the yellow neon ball on the grass near Doe Library steps.',
      timestamp: '5:10 PM'
    },
    {
      id: 'msg-5',
      hangoutId: 'hangout-2',
      sender: DEMO_USERS[1],
      text: 'Bringing a big picnic blanket and my Bluetooth speaker for some chill indie tunes 🎵',
      timestamp: '5:25 PM'
    }
  ]
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Hangout Confirmed!',
    message: 'You are confirmed for "Midterm Study Sprint + Strada Iced Latte" today at 3:30 PM.',
    timeAgo: '20 min ago',
    type: 'rsvp',
    read: false
  },
  {
    id: 'notif-2',
    title: 'New Campus Beacon nearby ⚡',
    message: 'Alex Rivera dropped a 20-min sun break beacon at Moffitt Library Terrace.',
    timeAgo: '35 min ago',
    type: 'beacon',
    read: false
  },
  {
    id: 'notif-3',
    title: 'New message in Yap Channel',
    message: 'Marcus: "Bringing an extension cord in case we need extra battery juice ⚡"',
    timeAgo: '1 hour ago',
    type: 'chat',
    read: true
  }
];
