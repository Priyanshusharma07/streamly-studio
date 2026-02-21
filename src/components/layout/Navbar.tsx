import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Radio, Menu, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const TOP_NAV_LINKS = [
  { label: 'Movies', href: '/browse?type=movie' },
  { label: 'TV Shows', href: '/browse?type=series' },
  { label: 'Live', href: '/live' },
];

/** Minimal top bar used on landing/public pages (wide layout, no sidebar) */
export const TopNavbar: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/browse?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'nav-blur shadow-xl' : 'bg-transparent',
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{ background: 'var(--gradient-cyan-purple)', color: 'hsl(220 20% 6%)' }}
          >
            S
          </div>
          <span className="font-bold text-base tracking-wide hidden sm:block" style={{ color: '#00D4FF' }}>
            STREAMHUB
          </span>
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-7">
          {TOP_NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3 ml-auto">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                className="search-input w-48 md:w-64 py-1.5"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              <button type="button" onClick={() => setSearchOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Search className="w-4.5 h-4.5 w-[18px] h-[18px]" />
            </button>
          )}

          {isAuthenticated ? (
            <>
              <Link to="/live" className="btn-cyan py-1.5 px-4 text-xs gap-1.5 rounded-lg">
                <Radio className="w-3.5 h-3.5" /> Go Live
              </Link>
              <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="w-[18px] h-[18px]" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
              </button>
              <Link to="/profile">
                <Avatar className="w-8 h-8 ring-2 ring-primary/40 hover:ring-primary/80 transition-all">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-xs font-bold" style={{ background: 'var(--gradient-cyan-purple)', color: 'hsl(220 20% 6%)' }}>
                    {user?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Login
              </Link>
              <Link to="/signup" className="btn-outline-cyan text-xs py-1.5 px-4">
                Sign Up Free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

/** Top bar used inside the sidebar layout (authenticated/browse pages) with search + Go Live */
export const InnerNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { user, isAuthenticated } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/browse?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="flex items-center gap-4 px-6 py-3 border-b border-white/[.05]"
      style={{ background: 'hsl(220 20% 6% / .6)', backdropFilter: 'blur(16px)' }}>
      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          className="search-input"
          placeholder="Search streams, movies, or masters..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      <div className="flex items-center gap-3 ml-auto">
        <Link to="/live" className="btn-cyan py-1.5 px-4 text-xs gap-1.5 rounded-lg">
          <Radio className="w-3.5 h-3.5" /> Go Live
        </Link>
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
        </button>
      </div>
    </div>
  );
};
