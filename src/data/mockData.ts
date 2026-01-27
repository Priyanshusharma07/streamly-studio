export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: string;
  language: string;
  type: 'movie' | 'series' | 'live' | 'short';
  rating: number;
  year: number;
  views: string;
  isLive?: boolean;
  viewerCount?: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  watchHistory: string[];
  savedVideos: string[];
  likedVideos: string[];
}

export const categories = [
  'All',
  'Action',
  'Comedy',
  'Drama',
  'Horror',
  'Sci-Fi',
  'Documentary',
  'Animation',
  'Thriller',
  'Romance',
];

export const languages = ['All', 'English', 'Spanish', 'French', 'Japanese', 'Korean', 'Hindi'];

export const videoTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'movie', label: 'Movies' },
  { value: 'series', label: 'Series' },
  { value: 'live', label: 'Live' },
  { value: 'short', label: 'Shorts' },
];

export const mockVideos: Video[] = [
  {
    id: '1',
    title: 'The Last Frontier',
    description: 'An epic journey through uncharted territories where survival meets destiny. Follow our heroes as they navigate treacherous landscapes and face unimaginable challenges.',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=450&fit=crop',
    duration: '2h 34m',
    category: 'Action',
    language: 'English',
    type: 'movie',
    rating: 4.8,
    year: 2024,
    views: '2.4M',
  },
  {
    id: '2',
    title: 'Neon Dreams',
    description: 'A cyberpunk thriller set in 2089 where reality and virtual worlds collide.',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=450&fit=crop',
    duration: '1h 58m',
    category: 'Sci-Fi',
    language: 'English',
    type: 'movie',
    rating: 4.5,
    year: 2024,
    views: '1.8M',
  },
  {
    id: '3',
    title: 'Ocean Mysteries',
    description: 'Dive deep into the unexplored depths of our oceans and discover creatures beyond imagination.',
    thumbnail: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=800&h=450&fit=crop',
    duration: '52m',
    category: 'Documentary',
    language: 'English',
    type: 'series',
    rating: 4.9,
    year: 2024,
    views: '3.1M',
  },
  {
    id: '4',
    title: 'Midnight Comedy Hour',
    description: 'The funniest stand-up special of the year featuring top comedians.',
    thumbnail: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&h=450&fit=crop',
    duration: '1h 15m',
    category: 'Comedy',
    language: 'English',
    type: 'movie',
    rating: 4.3,
    year: 2024,
    views: '890K',
  },
  {
    id: '5',
    title: 'Tokyo Nights',
    description: 'Experience the vibrant nightlife and hidden stories of Tokyo.',
    thumbnail: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=450&fit=crop',
    duration: '45m',
    category: 'Documentary',
    language: 'Japanese',
    type: 'series',
    rating: 4.7,
    year: 2024,
    views: '1.2M',
  },
  {
    id: '6',
    title: 'The Shadow Game',
    description: 'A psychological thriller that will keep you on the edge of your seat.',
    thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=450&fit=crop',
    duration: '2h 12m',
    category: 'Thriller',
    language: 'English',
    type: 'movie',
    rating: 4.6,
    year: 2024,
    views: '2.1M',
  },
  {
    id: '7',
    title: 'Love in Paris',
    description: 'A heartwarming romantic story set in the city of lights.',
    thumbnail: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=450&fit=crop',
    duration: '1h 48m',
    category: 'Romance',
    language: 'French',
    type: 'movie',
    rating: 4.4,
    year: 2024,
    views: '1.5M',
  },
  {
    id: '8',
    title: 'Haunted Manor',
    description: 'Enter if you dare. The most terrifying horror experience of the decade.',
    thumbnail: 'https://images.unsplash.com/photo-1509248961725-aec71c872f2c?w=800&h=450&fit=crop',
    duration: '1h 52m',
    category: 'Horror',
    language: 'English',
    type: 'movie',
    rating: 4.2,
    year: 2024,
    views: '980K',
  },
  {
    id: '9',
    title: 'Space Odyssey 2089',
    description: 'Humanity\'s greatest adventure among the stars begins.',
    thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&h=450&fit=crop',
    duration: '2h 45m',
    category: 'Sci-Fi',
    language: 'English',
    type: 'movie',
    rating: 4.9,
    year: 2024,
    views: '4.2M',
  },
  {
    id: '10',
    title: 'The Art of Motion',
    description: 'A stunning animated feature that pushes the boundaries of visual storytelling.',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=450&fit=crop',
    duration: '1h 35m',
    category: 'Animation',
    language: 'English',
    type: 'movie',
    rating: 4.8,
    year: 2024,
    views: '2.8M',
  },
  {
    id: '11',
    title: 'Street Food Chronicles',
    description: 'A culinary journey through the world\'s most delicious street food.',
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=450&fit=crop',
    duration: '38m',
    category: 'Documentary',
    language: 'English',
    type: 'series',
    rating: 4.6,
    year: 2024,
    views: '1.1M',
  },
  {
    id: '12',
    title: 'The Heist',
    description: 'The most elaborate heist ever planned. Will they succeed?',
    thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=450&fit=crop',
    duration: '2h 08m',
    category: 'Thriller',
    language: 'English',
    type: 'movie',
    rating: 4.7,
    year: 2024,
    views: '3.5M',
  },
];

export const liveStreams: Video[] = [
  {
    id: 'live-1',
    title: 'Gaming Championship Finals',
    description: 'Watch the world\'s best gamers compete for the ultimate prize.',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop',
    duration: 'LIVE',
    category: 'Gaming',
    language: 'English',
    type: 'live',
    rating: 4.9,
    year: 2024,
    views: '45K watching',
    isLive: true,
    viewerCount: 45000,
  },
  {
    id: 'live-2',
    title: 'Music Festival Stream',
    description: 'Live performances from the biggest music festival of the year.',
    thumbnail: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=450&fit=crop',
    duration: 'LIVE',
    category: 'Music',
    language: 'English',
    type: 'live',
    rating: 4.8,
    year: 2024,
    views: '128K watching',
    isLive: true,
    viewerCount: 128000,
  },
  {
    id: 'live-3',
    title: 'Tech Talk: AI Revolution',
    description: 'Industry experts discuss the future of artificial intelligence.',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=450&fit=crop',
    duration: 'LIVE',
    category: 'Technology',
    language: 'English',
    type: 'live',
    rating: 4.7,
    year: 2024,
    views: '12K watching',
    isLive: true,
    viewerCount: 12000,
  },
];

export const featuredVideo: Video = {
  id: 'featured',
  title: 'The Last Frontier',
  description: 'An epic journey through uncharted territories where survival meets destiny. Follow our heroes as they navigate treacherous landscapes and face unimaginable challenges in this visually stunning masterpiece.',
  thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop',
  duration: '2h 34m',
  category: 'Action',
  language: 'English',
  type: 'movie',
  rating: 4.8,
  year: 2024,
  views: '2.4M',
};

export const mockUser: User = {
  id: '1',
  username: 'JohnDoe',
  email: 'john.doe@example.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
  watchHistory: ['1', '3', '5', '7'],
  savedVideos: ['2', '4', '6'],
  likedVideos: ['1', '2', '3', '9'],
};

export const mockChatMessages = [
  { id: '1', user: 'StreamFan123', message: 'This is amazing! 🔥', timestamp: '2 min ago' },
  { id: '2', user: 'MovieLover', message: 'Best stream ever!', timestamp: '1 min ago' },
  { id: '3', user: 'NightOwl', message: 'Who else is watching from Japan?', timestamp: '45 sec ago' },
  { id: '4', user: 'TechGuru', message: 'The quality is incredible', timestamp: '30 sec ago' },
  { id: '5', user: 'GamerPro', message: 'Let\'s gooo! 🎮', timestamp: '15 sec ago' },
];
