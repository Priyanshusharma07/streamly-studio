import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VideoCardData {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  duration?: string;
  category?: string;
  views?: string;
  isLive?: boolean;
  viewerCount?: number;
  creatorName?: string;
  creatorAvatar?: string;
  status?: string;
}

interface VideoCardProps {
  video: VideoCardData;
  variant?: 'default' | 'horizontal';
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, variant = 'default' }) => {
  const href = video.isLive ? `/live/${video.id}` : `/watch/${video.id}`;

  if (variant === 'horizontal') {
    return (
      <Link to={href} className="group flex gap-3 p-2 rounded-xl hover:bg-secondary/50 transition-colors">
        <div className="relative w-36 aspect-video rounded-lg overflow-hidden flex-shrink-0">
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
          {video.isLive
            ? <span className="absolute top-1.5 left-1.5 live-badge">Live</span>
            : video.duration && (
              <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                {video.duration}
              </span>
            )
          }
        </div>
        <div className="flex-1 min-w-0 py-1">
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {video.title}
          </h3>
          {video.creatorName && (
            <p className="text-xs text-muted-foreground mt-1 truncate">{video.creatorName}</p>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">
            {video.views ? `${video.views} views` : ''}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link to={href} className="video-card group block">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden rounded-xl">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* play overlay */}
        <div className="play-overlay">
          <div className="play-btn">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>
        {/* Gradient bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16"
          style={{ background: 'linear-gradient(transparent, hsl(220 20% 6% / .9))' }} />
        {/* badges */}
        {video.isLive ? (
          <span className="absolute top-2 left-2 live-badge">Live</span>
        ) : video.duration ? (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
            {video.duration}
          </span>
        ) : null}
        {video.isLive && video.viewerCount && (
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
            <Eye className="w-2.5 h-2.5" />
            {video.viewerCount >= 1000
              ? `${(video.viewerCount / 1000).toFixed(1)}K`
              : video.viewerCount}
          </span>
        )}
      </div>
      {/* Info row */}
      <div className="flex gap-2.5 pt-2.5 pb-1">
        {video.creatorName && (
          <div
            className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white mt-0.5"
            style={{ background: 'var(--gradient-cyan-purple)' }}
          >
            {video.creatorAvatar
              ? <img src={video.creatorAvatar} alt="" className="w-full h-full rounded-full object-cover" />
              : video.creatorName.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {video.title}
          </h3>
          {video.creatorName && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{video.creatorName}</p>
          )}
          <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-muted-foreground">
            {video.views && <span>{video.views} views</span>}
            {video.category && <><span>•</span><span>{video.category}</span></>}
          </div>
        </div>
      </div>
    </Link>
  );
};
