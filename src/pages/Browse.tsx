import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { Filter, LayoutGrid, List, Search } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { VideoCard, VideoCardData } from '@/components/video/VideoCard';
import { useVideos } from '@/hooks/useVideos';
import { mockVideos } from '@/data/mockData';
import { cn } from '@/lib/utils';

const CATEGORIES = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Documentary', 'Animation', 'Thriller', 'Romance', 'Gaming', 'Music'];
const SORTS = [
  { label: 'Popular', value: 'popular' },
  { label: 'Trending', value: 'trending' },
  { label: 'Recent', value: 'recent' },
  { label: 'Top Rated', value: 'rating' },
];

const toCard = (v: any): VideoCardData => ({
  id: v.id, title: v.title, thumbnail: v.thumbnail,
  duration: v.duration, category: v.category, views: v.views,
  isLive: v.isLive, viewerCount: v.viewerCount,
  creatorName: v.creatorName || 'StreamHub Creator',
});

const Browse: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');

  const searchQuery = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || 'popular';

  const { data, isLoading } = useVideos({ search: searchQuery || undefined, category, sort, limit: 50 });
  const videos: VideoCardData[] = (data?.data ?? mockVideos.map(toCard)).map(toCard);

  const update = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams);
    if (!value || value === 'All' || value === 'popular') p.delete(key); else p.set(key, value);
    setSearchParams(p);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    update('search', localSearch);
  };

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Discover</h1>
            {searchQuery && (
              <p className="text-sm text-muted-foreground mt-0.5">Results for "{searchQuery}"</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <input
                className="search-input pl-9 py-2 w-48 md:w-64"
                placeholder="Search videos..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </form>
            {/* View toggle */}
            <div className="flex items-center bg-secondary/50 rounded-lg p-1 gap-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={cn('p-1.5 rounded-md transition-all', viewMode === 'grid' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground')}
              > <LayoutGrid className="w-4 h-4" /> </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn('p-1.5 rounded-md transition-all', viewMode === 'list' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground')}
              > <List className="w-4 h-4" /> </button>
            </div>
          </div>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => update('category', c)}
              className={cn(
                'flex-none px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border',
                category === c
                  ? 'text-background border-primary'
                  : 'text-muted-foreground border-border/60 hover:border-border hover:text-foreground',
              )}
              style={category === c ? { background: '#00D4FF' } : {}}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs text-muted-foreground">Sort by:</span>
          {SORTS.map((s) => (
            <button
              key={s.value}
              onClick={() => update('sort', s.value)}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-medium transition-all',
                sort === s.value ? 'text-foreground bg-secondary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Grid / List */}
        {isLoading ? (
          <div className={cn(
            viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
              : 'space-y-2',
          )}>
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="skeleton-shimmer aspect-video rounded-xl" />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-2xl font-bold text-foreground mb-2">No Videos Found</p>
            <p className="text-muted-foreground text-sm">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <>
            <div className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
                : 'space-y-2',
            )}>
              {videos.map((v) => (
                <VideoCard key={v.id} video={v} variant={viewMode === 'list' ? 'horizontal' : 'default'} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-8">
              Showing {videos.length} results
            </p>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Browse;
