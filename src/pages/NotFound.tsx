import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 40%, hsl(192 100% 50% / .06) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md animate-scale-in">
        {/* Logo */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 font-bold text-2xl"
          style={{ background: 'var(--gradient-cyan-purple)', color: 'hsl(220 20% 6%)' }}
        >
          S
        </div>

        {/* 404 */}
        <h1 className="text-[8rem] font-black leading-none text-gradient-hero mb-2">404</h1>
        <h2 className="text-2xl font-bold text-foreground mb-3">Page not found</h2>
        <p className="text-sm text-muted-foreground mb-2">
          The page{' '}
          <code className="px-1.5 py-0.5 rounded bg-secondary text-xs text-foreground font-mono">
            {pathname}
          </code>{' '}
          doesn't exist or was removed.
        </p>
        <p className="text-sm text-muted-foreground mb-10">Let's get you somewhere great.</p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
          <Link to="/" className="btn-cyan w-full sm:flex-1 py-2.5 rounded-xl text-sm justify-center gap-2">
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link to="/browse" className="btn-outline-cyan w-full sm:flex-1 py-2.5 rounded-xl text-sm justify-center gap-2">
            <Search className="w-4 h-4" /> Browse
          </Link>
        </div>

        <button
          onClick={() => window.history.back()}
          className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Go back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
