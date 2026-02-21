import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Play, ChevronLeft, ChevronRight,
  TrendingUp, Clock, Clapperboard, Radio,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { VideoCard, VideoCardData } from '@/components/video/VideoCard';
import { useTrendingVideos, useRecentVideos, useMovies } from '@/hooks/useVideos';
import { useAuth } from '@/contexts/AuthContext';
import { mockVideos, liveStreams } from '@/data/mockData';
import { cn } from '@/lib/utils';

// ─────────────────────────── helpers ────────────────────────────────────────
const toCard = (v: any): VideoCardData => ({
  id: v.id, title: v.title, thumbnail: v.thumbnail,
  duration: v.duration, category: v.category, views: v.views,
  isLive: v.isLive, viewerCount: v.viewerCount,
  creatorName: v.creatorName || 'StreamHub Creator',
});

const GENRES = [
  { label: 'Sci-Fi',    img: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=260&fit=crop' },
  { label: 'Action',    img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=260&fit=crop' },
  { label: 'Cyberpunk', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=260&fit=crop' },
  { label: 'Anime',     img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=260&fit=crop' },
  { label: 'Thriller',  img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=260&fit=crop' },
  { label: 'Fantasy',   img: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=400&h=260&fit=crop' },
];

const LANDING_FILTERS = ['All', 'Gaming', 'Music', 'Movies'];

// ── Scrollable Video Row ─────────────────────────────────────────────────────
const VideoRow: React.FC<{
  title: string;
  icon?: React.ReactNode;
  videos: VideoCardData[];
  onSeeAll?: () => void;
}> = ({ title, icon, videos, onSeeAll }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const scroll = (dir: 'l' | 'r') =>
    ref.current?.scrollBy({ left: dir === 'r' ? 280 : -280, behavior: 'smooth' });

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-[15px] font-semibold text-foreground">
          {icon}
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {onSeeAll && (
            <button
              onClick={onSeeAll}
              className="text-xs font-medium mr-1 transition-colors hover:opacity-80"
              style={{ color: '#00D4FF' }}
            >
              View All
            </button>
          )}
          <button
            onClick={() => scroll('l')}
            className="w-7 h-7 rounded-full bg-secondary/70 hover:bg-secondary flex items-center justify-center transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => scroll('r')}
            className="w-7 h-7 rounded-full bg-secondary/70 hover:bg-secondary flex items-center justify-center transition-all"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videos.map((v) => (
          <div key={v.id} className="flex-none w-52 sm:w-60">
            <VideoCard video={v} />
          </div>
        ))}
      </div>
    </section>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// LANDING PAGE  (unauthenticated / guest)
// ════════════════════════════════════════════════════════════════════════════
const LandingHome: React.FC<{
  trendingVideos: VideoCardData[];
  liveVideos: VideoCardData[];
  movieVideos: VideoCardData[];
  recentVideos: VideoCardData[];
}> = ({ trendingVideos, liveVideos, movieVideos, recentVideos }) => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('All');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/browse?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <Layout fullWidth>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-background">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, hsl(192 100% 50% / .12) 0%, transparent 70%)' }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'linear-gradient(hsl(192 100% 50% / .03) 1px, transparent 1px), linear-gradient(90deg, hsl(192 100% 50% / .03) 1px, transparent 1px)', backgroundSize: '80px 80px' }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
            style={{ background: 'linear-gradient(transparent, hsl(220 20% 6%))' }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto pt-28 pb-16">
          {/* Floating play icon */}
          <div
            className="w-20 h-20 rounded-full mb-10 flex items-center justify-center animate-fade-in ring-1 ring-white/10"
            style={{ background: 'hsl(220 18% 11%)' }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: 'hsl(220 14% 17%)' }}
            >
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-gradient-hero text-[clamp(3rem,10vw,6rem)] font-black uppercase tracking-tight leading-[0.88] mb-8 animate-slide-up">
            Stream&nbsp;Limitless
          </h1>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="w-full max-w-xl flex items-center mb-10 animate-slide-up"
            style={{ animationDelay: '80ms' }}
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search movies, series, or genres..."
                className="w-full rounded-l-xl border border-r-0 border-white/[.1] bg-white/[.04] pl-11 pr-4 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
            <button
              type="submit"
              className="rounded-r-xl px-7 py-4 text-sm font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--gradient-cyan-purple)' }}
            >
              Explore
            </button>
          </form>

          {/* Stats strip */}
          <div
            className="flex items-center gap-8 text-center animate-fade-in"
            style={{ animationDelay: '160ms' }}
          >
            {[['10K+', 'Movies & Series'], ['500+', 'Live Channels'], ['4K', 'Ultra HD Streams']].map(
              ([num, label]) => (
                <div key={label}>
                  <p className="text-xl font-black text-foreground">{num}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── TRENDING CATEGORIES ──────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto w-full py-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
            Trending Categories
          </p>
          <div className="flex gap-2">
            {(['l', 'r'] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => {
                  document.getElementById('genre-scrl')?.scrollBy({
                    left: dir === 'r' ? 220 : -220,
                    behavior: 'smooth',
                  });
                }}
                className="w-7 h-7 rounded-full bg-secondary/70 hover:bg-secondary flex items-center justify-center transition-all"
              >
                {dir === 'l' ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>

        <div
          id="genre-scrl"
          className="flex gap-4 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {GENRES.map((g) => (
            <button
              key={g.label}
              onClick={() => navigate(`/browse?category=${g.label}`)}
              className="genre-card flex-none w-[140px] h-[90px]"
            >
              <img src={g.img} alt={g.label} className="w-full h-full object-cover" loading="lazy" />
              <div className="genre-overlay" />
              <span className="absolute bottom-2 left-0 right-0 text-center text-[11px] font-bold uppercase tracking-wider text-white">
                {g.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── VIDEO ROWS ───────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 py-8 max-w-7xl mx-auto w-full border-t border-white/[.04] mt-4">
        {/* For You tabs */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-[15px] font-semibold text-foreground mr-2">For You</h2>
          <div className="flex items-center gap-1 bg-secondary/40 rounded-lg p-1">
            {LANDING_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-3 py-1 rounded-md text-xs font-medium transition-all',
                  filter === f
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate('/browse')}
            className="ml-auto text-xs font-medium transition-colors hover:opacity-80"
            style={{ color: '#00D4FF' }}
          >
            View All
          </button>
        </div>

        <VideoRow
          title="Trending in India"
          icon={<TrendingUp className="w-4 h-4 text-primary" />}
          videos={trendingVideos}
          onSeeAll={() => navigate('/browse?sort=trending')}
        />
        <VideoRow
          title="🔴 Live Now"
          videos={liveVideos}
          onSeeAll={() => navigate('/live')}
        />
        <VideoRow
          title="Popular Movies"
          icon={<Clapperboard className="w-4 h-4 text-muted-foreground" />}
          videos={movieVideos}
          onSeeAll={() => navigate('/browse?type=movie')}
        />
        <VideoRow
          title="Recently Added"
          icon={<Clock className="w-4 h-4 text-muted-foreground" />}
          videos={recentVideos}
          onSeeAll={() => navigate('/browse?sort=recent')}
        />
      </div>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section className="mx-4 sm:mx-6 mb-12 max-w-7xl mx-auto rounded-2xl overflow-hidden relative">
        <div
          className="py-14 px-8 text-center"
          style={{ background: 'linear-gradient(135deg, hsl(192 100% 40% / .2), hsl(270 70% 40% / .2))', border: '1px solid hsl(192 100% 50% / .15)' }}
        >
          <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-3">
            Ready to stream without limits?
          </h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Join millions of viewers. Watch anything, anywhere, on any device.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/signup" className="btn-cyan px-7 py-3 rounded-xl text-sm">Get Started Free</Link>
            <Link to="/browse" className="btn-outline-cyan px-7 py-3 rounded-xl text-sm">Browse Content</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[.04] py-8 text-center">
        <p className="text-xs text-muted-foreground">© 2024 StreamHub · All rights reserved</p>
      </footer>
    </Layout>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// AUTH HOME FEED  (logged-in users → sidebar layout)
// ════════════════════════════════════════════════════════════════════════════
const AuthHomeFeed: React.FC<{
  trendingVideos: VideoCardData[];
  liveVideos: VideoCardData[];
  movieVideos: VideoCardData[];
  recentVideos: VideoCardData[];
}> = ({ trendingVideos, liveVideos, movieVideos, recentVideos }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = React.useState('All');

  const FILTERS = ['All', 'Gaming', 'Music', 'Movies'];

  return (
    <Layout>
      <div className="px-5 py-6 max-w-6xl mx-auto">
        {/* For You filter */}
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-[15px] font-semibold text-foreground mr-1">For You</h2>
          <div className="flex items-center gap-1 bg-secondary/40 rounded-lg p-0.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                  filter === f
                    ? 'text-foreground bg-secondary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate('/browse')}
            className="ml-auto text-xs font-medium"
            style={{ color: '#00D4FF' }}
          >
            View All
          </button>
        </div>

        <VideoRow
          title="Trending in India"
          icon={<TrendingUp className="w-4 h-4 text-primary" />}
          videos={trendingVideos}
          onSeeAll={() => navigate('/browse?sort=trending')}
        />
        <VideoRow
          title="🔴 Live Now"
          videos={liveVideos}
          onSeeAll={() => navigate('/live')}
        />
        <VideoRow
          title="Popular Movies"
          icon={<Clapperboard className="w-4 h-4 text-muted-foreground" />}
          videos={movieVideos}
          onSeeAll={() => navigate('/browse?type=movie')}
        />
        <VideoRow
          title="Recently Added"
          icon={<Clock className="w-4 h-4 text-muted-foreground" />}
          videos={recentVideos}
          onSeeAll={() => navigate('/browse?sort=recent')}
        />
      </div>
    </Layout>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// ROOT HOME — branches on auth state
// ════════════════════════════════════════════════════════════════════════════
const Home: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const { data: trending } = useTrendingVideos(12);
  const { data: recent }   = useRecentVideos(10);
  const { data: movies }   = useMovies(10);

  const trendingVideos = (trending?.length ? trending : mockVideos.slice(0, 10)).map(toCard);
  const recentVideos   = (recent?.length   ? recent   : [...mockVideos].reverse().slice(0, 10)).map(toCard);
  const movieVideos    = (movies?.length   ? movies   : mockVideos.filter((v) => v.type === 'movie')).map(toCard);
  const liveVideos     = liveStreams.map(toCard);

  // Show a minimal full-screen spinner while auth state restores from localStorage
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl"
            style={{ background: 'var(--gradient-cyan-purple)', color: 'hsl(220 20% 6%)' }}
          >
            S
          </div>
          <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  const shared = { trendingVideos, liveVideos, movieVideos, recentVideos };

  return isAuthenticated
    ? <AuthHomeFeed {...shared} />
    : <LandingHome {...shared} />;
};

export default Home;
