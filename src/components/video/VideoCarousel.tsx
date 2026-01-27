import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoCard } from './VideoCard';
import { Video } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface VideoCarouselProps {
  title: string;
  videos: Video[];
  showSeeAll?: boolean;
  onSeeAll?: () => void;
}

export const VideoCarousel: React.FC<VideoCarouselProps> = ({
  title,
  videos,
  showSeeAll,
  onSeeAll,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{title}</h2>
          {showSeeAll && (
            <Button variant="ghost" onClick={onSeeAll} className="text-primary hover:text-primary/80">
              See All
            </Button>
          )}
        </div>

        {/* Carousel */}
        <div className="relative group">
          {/* Navigation Buttons */}
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-lg',
              !canScrollLeft && 'hidden'
            )}
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            className={cn(
              'absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-lg',
              !canScrollRight && 'hidden'
            )}
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Gradient Overlays */}
          <div
            className={cn(
              'absolute left-0 top-0 bottom-0 w-12 carousel-gradient-left z-[5] pointer-events-none transition-opacity',
              !canScrollLeft && 'opacity-0'
            )}
          />
          <div
            className={cn(
              'absolute right-0 top-0 bottom-0 w-12 carousel-gradient-right z-[5] pointer-events-none transition-opacity',
              !canScrollRight && 'opacity-0'
            )}
          />

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {videos.map((video) => (
              <div key={video.id} className="flex-shrink-0 w-64 md:w-72">
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
