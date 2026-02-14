import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  ThumbsUp, Bookmark, Share2, ChevronLeft,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { VideoCard } from '@/components/video/VideoCard';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useVideoById, useVideos } from '@/hooks/useVideos';
import { getHlsManifestUrl } from '@/services/api/videoApi';
import { mockVideos } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Watch: React.FC = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: video, isLoading } = useVideoById(id);
  const { data: recommendedData } = useVideos({ limit: 8 });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Fallback to mock data if API hasn't loaded
  const displayVideo = video || mockVideos.find((v) => v.id === id) || mockVideos[0];
  const recommendedVideos = (recommendedData?.data ?? mockVideos).filter((v) => v.id !== id).slice(0, 8);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
  };
  const handleToggleMute = () => setIsMuted(!isMuted);
  const handleProgressChange = (value: number[]) => setProgress(value[0]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const handleAction = (action: string) => {
    if (!isAuthenticated) {
      toast({ title: 'Sign in required', description: 'Please sign in to perform this action.', variant: 'destructive' });
      return;
    }
    switch (action) {
      case 'like':
        setIsLiked(!isLiked);
        toast({ title: isLiked ? 'Removed from liked videos' : 'Added to liked videos' });
        break;
      case 'save':
        setIsSaved(!isSaved);
        toast({ title: isSaved ? 'Removed from saved videos' : 'Saved to your list' });
        break;
      case 'share':
        navigator.clipboard.writeText(window.location.href);
        toast({ title: 'Link copied to clipboard!' });
        break;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/" className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div
              ref={playerRef}
              className="relative aspect-video bg-black rounded-xl overflow-hidden group"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => isPlaying && setShowControls(false)}
            >
              <img src={displayVideo.thumbnail} alt={displayVideo.title} className="w-full h-full object-cover" />

              <div
                className={cn(
                  'absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity cursor-pointer',
                  isPlaying && !showControls ? 'opacity-0' : 'opacity-100'
                )}
                onClick={handlePlayPause}
              >
                <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center transform hover:scale-110 transition-transform">
                  {isPlaying ? <Pause className="w-10 h-10 text-primary-foreground" /> : <Play className="w-10 h-10 text-primary-foreground ml-1" />}
                </div>
              </div>

              <div className={cn(
                'absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent transition-opacity',
                showControls ? 'opacity-100' : 'opacity-0'
              )}>
                <Slider value={[progress]} max={100} step={0.1} onValueChange={handleProgressChange} className="mb-4" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={handlePlayPause} className="text-white hover:bg-white/20" aria-label={isPlaying ? 'Pause' : 'Play'}>
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    <div className="flex items-center gap-2 group/volume">
                      <Button variant="ghost" size="icon" onClick={handleToggleMute} className="text-white hover:bg-white/20" aria-label={isMuted ? 'Unmute' : 'Mute'}>
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </Button>
                      <div className="w-0 group-hover/volume:w-24 overflow-hidden transition-all">
                        <Slider value={[isMuted ? 0 : volume]} max={100} onValueChange={handleVolumeChange} />
                      </div>
                    </div>
                    <span className="text-white text-sm">0:00 / {displayVideo.duration}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleFullscreen} className="text-white hover:bg-white/20" aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{displayVideo.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-muted-foreground">
                <span>{displayVideo.views} views</span>
                <span>•</span>
                <span>{displayVideo.year}</span>
                <span>•</span>
                <span>{displayVideo.category}</span>
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                <Button variant={isLiked ? 'default' : 'secondary'} onClick={() => handleAction('like')} className="gap-2">
                  <ThumbsUp className={cn('w-4 h-4', isLiked && 'fill-current')} />
                  {isLiked ? 'Liked' : 'Like'}
                </Button>
                <Button variant={isSaved ? 'default' : 'secondary'} onClick={() => handleAction('save')} className="gap-2">
                  <Bookmark className={cn('w-4 h-4', isSaved && 'fill-current')} />
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
                <Button variant="secondary" onClick={() => handleAction('share')} className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
              <div className="mt-6 p-4 bg-card rounded-lg">
                <p className="text-foreground leading-relaxed">{displayVideo.description}</p>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recommended</h2>
            <div className="space-y-2">
              {recommendedVideos.map((recVideo) => (
                <VideoCard key={recVideo.id} video={recVideo} variant="horizontal" />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default Watch;
