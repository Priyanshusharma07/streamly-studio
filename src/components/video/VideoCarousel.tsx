import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { VideoCard, VideoCardData } from './VideoCard';
import { cn } from '@/lib/utils';

interface VideoCarouselProps {
  title: string;
  videos: VideoCardData[];
  onSeeAll?: () => void;
}

export const VideoCarousel: React.FC<VideoCarouselProps> = ({ title, videos, onSeeAll }) => {
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

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <div className="flex items-center gap-2">
          {onSeeAll && (
            <button onClick={onSeeAll} className="text-xs font-medium hover:text-foreground transition-colors" style={{ color: '#00D4FF' }}>
              View All
            </button>
          )}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="w-7 h-7 rounded-full bg-secondary/70 hover:bg-secondary flex items-center justify-center transition-colors disabled:opacity-30"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="w-7 h-7 rounded-full bg-secondary/70 hover:bg-secondary flex items-center justify-center transition-colors disabled:opacity-30"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videos.map((v) => (
          <div key={v.id} className="flex-none w-56 sm:w-64">
            <VideoCard video={v} />
          </div>
        ))}
      </div>
    </section>
  );
};
