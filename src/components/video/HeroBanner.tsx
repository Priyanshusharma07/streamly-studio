import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Video } from '@/data/mockData';

interface HeroBannerProps {
  video: Video;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ video }) => {
  return (
    <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl animate-slide-up">
          {/* Category Badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
              Featured
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-primary text-primary" />
              {video.rating}
            </span>
            <span className="text-sm text-muted-foreground">{video.year}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
            {video.title}
          </h1>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-6 line-clamp-3 md:line-clamp-none">
            {video.description}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            <span>{video.duration}</span>
            <span>•</span>
            <span>{video.category}</span>
            <span>•</span>
            <span>{video.language}</span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="gap-2 text-base">
              <Link to={`/watch/${video.id}`}>
                <Play className="w-5 h-5 fill-current" />
                Play Now
              </Link>
            </Button>
            <Button variant="secondary" size="lg" className="gap-2 text-base" asChild>
              <Link to={`/watch/${video.id}`}>
                <Info className="w-5 h-5" />
                More Info
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
