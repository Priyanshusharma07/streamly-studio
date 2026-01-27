import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { VideoCard } from '@/components/video/VideoCard';
import { SkeletonCard } from '@/components/video/SkeletonCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { mockVideos, categories, languages, videoTypes, Video } from '@/data/mockData';
import { cn } from '@/lib/utils';

const Browse: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);

  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || 'All';
  const languageFilter = searchParams.get('language') || 'All';
  const typeFilter = searchParams.get('type') || 'all';
  const sortBy = searchParams.get('sort') || 'popular';

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let results = [...mockVideos];

      // Search filter
      if (searchQuery) {
        results = results.filter(
          (v) =>
            v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Category filter
      if (categoryFilter !== 'All') {
        results = results.filter((v) => v.category === categoryFilter);
      }

      // Language filter
      if (languageFilter !== 'All') {
        results = results.filter((v) => v.language === languageFilter);
      }

      // Type filter
      if (typeFilter !== 'all') {
        results = results.filter((v) => v.type === typeFilter);
      }

      // Sort
      switch (sortBy) {
        case 'recent':
          results = results.reverse();
          break;
        case 'rating':
          results = results.sort((a, b) => b.rating - a.rating);
          break;
        case 'trending':
          results = results.sort(() => Math.random() - 0.5);
          break;
        default:
          break;
      }

      setFilteredVideos(results);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, categoryFilter, languageFilter, typeFilter, sortBy]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'All' || value === 'all') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const FilterControls = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
        <Select value={categoryFilter} onValueChange={(v) => updateFilter('category', v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Language</label>
        <Select value={languageFilter} onValueChange={(v) => updateFilter('language', v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Type</label>
        <Select value={typeFilter} onValueChange={(v) => updateFilter('type', v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {videoTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Sort By</label>
        <Select value={sortBy} onValueChange={(v) => updateFilter('sort', v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="recent">Recently Added</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="trending">Trending</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Browse</h1>
            {searchQuery && (
              <p className="text-muted-foreground mt-1">
                Search results for "{searchQuery}"
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <Input
              type="search"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-48 md:w-64"
            />

            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Filter className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterControls />
                </div>
              </SheetContent>
            </Sheet>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center border border-border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="text-lg font-semibold text-foreground mb-4">Filters</h2>
              <FilterControls />
            </div>
          </aside>

          {/* Video Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div
                className={cn(
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-4'
                )}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <SkeletonCard key={i} variant={viewMode === 'list' ? 'horizontal' : 'default'} />
                ))}
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">No videos found</p>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <div
                className={cn(
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-2'
                )}
              >
                {filteredVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    variant={viewMode === 'list' ? 'horizontal' : 'default'}
                  />
                ))}
              </div>
            )}

            {/* Results count */}
            {!isLoading && filteredVideos.length > 0 && (
              <p className="text-muted-foreground text-sm mt-8 text-center">
                Showing {filteredVideos.length} videos
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Browse;
