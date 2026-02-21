import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import { VideoCardData } from './VideoCard';

interface HeroBannerProps {
  video: VideoCardData;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ video }) => {
  return (
    <section className="relative h-[60vh] overflow-hidden">
      <img src={video.thumbnail} alt={video.title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, hsl(220 20% 6%))' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, hsl(220 20% 6% / .7) 0%, transparent 60%)' }} />

      <div className="relative h-full flex items-end px-6 pb-10 max-w-2xl">
        <div className="animate-slide-up">
          <h1 className="text-4xl font-black text-foreground mb-3 leading-tight">{video.title}</h1>
          {video.description && (
            <p className="text-sm text-muted-foreground mb-5 line-clamp-2">{video.description}</p>
          )}
          <div className="flex gap-3">
            <Link to={`/watch/${video.id}`} className="btn-cyan gap-2">
              <Play className="w-4 h-4 fill-current" /> Play Now
            </Link>
            <Link to={`/watch/${video.id}`} className="btn-outline-cyan gap-2">
              <Info className="w-4 h-4" /> More Info
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
