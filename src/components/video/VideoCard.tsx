import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, Star } from 'lucide-react';
import { Video } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface VideoCardProps {
  video: Video;
  variant?: 'default' | 'large' | 'horizontal';
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, variant = 'default' }) => {
  const isLarge = variant === 'large';
  const isHorizontal = variant === 'horizontal';

  if (isHorizontal) {
    return (
      <Link
        to={video.isLive ? `/live/${video.id}` : `/watch/${video.id}`}
        className="group flex gap-4 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
      >
        <div className="relative w-40 aspect-video rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {video.isLive ? (
            <span className="absolute top-2 left-2 live-badge">Live</span>
          ) : (
            <span className="absolute bottom-2 right-2 bg-background/90 text-foreground text-xs px-1.5 py-0.5 rounded">
              {video.duration}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{video.views} views</p>
          <p className="text-sm text-muted-foreground">{video.category}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={video.isLive ? `/live/${video.id}` : `/watch/${video.id}`}
      className={cn('video-card group block', isLarge ? 'w-80' : 'w-full')}
    >
      <div className="relative aspect-video">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 text-primary-foreground fill-current ml-1" />
          </div>
        </div>

        {/* Duration / Live badge */}
        {video.isLive ? (
          <span className="absolute top-2 left-2 live-badge">Live</span>
        ) : (
          <span className="absolute bottom-2 right-2 bg-background/90 text-foreground text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {video.duration}
          </span>
        )}

        {/* Live viewer count */}
        {video.isLive && video.viewerCount && (
          <span className="absolute bottom-2 right-2 bg-background/90 text-foreground text-xs px-2 py-0.5 rounded">
            {(video.viewerCount / 1000).toFixed(1)}K watching
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          <span>{video.category}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-primary text-primary" />
            {video.rating}
          </span>
        </div>
        {!isLarge && (
          <p className="text-sm text-muted-foreground mt-1">{video.views} views</p>
        )}
      </div>
    </Link>
  );
};
