import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ThumbsUp, Bookmark, Share2, ChevronLeft,
  Loader2, AlertCircle, Clock,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { VideoCard } from '@/components/video/VideoCard';
import HlsPlayer from '@/components/video/HlsPlayer';
import { Button } from '@/components/ui/button';
import { useVideoById, useVideos } from '@/hooks/useVideos';
import { getHlsManifestUrl } from '@/services/api/videoApi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Watch: React.FC = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: video, isLoading, isError } = useVideoById(id);
  const { data: recommendedData } = useVideos({ limit: 8 });

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);

  const recommendedVideos = (recommendedData?.data ?? [])
    .filter((v) => v.id !== id)
    .slice(0, 8);

  const handleAction = (action: string) => {
    if (!isAuthenticated) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to perform this action.',
        variant: 'destructive',
      });
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

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading video...</span>
        </div>
      </Layout>
    );
  }

  // ── Not found / error ────────────────────────────────────────────────────
  if (isError || !video) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex flex-col items-center gap-4 text-center">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <h1 className="text-2xl font-bold text-foreground">Video not found</h1>
          <p className="text-muted-foreground">This video doesn't exist or you don't have permission to view it.</p>
          <Button asChild variant="secondary">
            <Link to="/browse">Browse videos</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // ── Video status states ──────────────────────────────────────────────────
  const isProcessing = video.status === 'processing';
  const isFailed = video.status === 'failed';
  const isReady = video.status === 'ready';

  const hlsUrl = getHlsManifestUrl(id!);

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
          {/* ── Video Player ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden">

              {/* Processing state */}
              {isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 text-white">
                  <Clock className="w-12 h-12 text-primary animate-pulse" />
                  <p className="text-lg font-semibold">Video is being processed…</p>
                  <p className="text-sm text-white/60">This may take a few minutes. Check back soon.</p>
                </div>
              )}

              {/* Failed state */}
              {isFailed && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 text-white">
                  <AlertCircle className="w-12 h-12 text-destructive" />
                  <p className="text-lg font-semibold">Processing failed</p>
                  <p className="text-sm text-white/60">There was a problem processing this video.</p>
                </div>
              )}

              {/* Player error state */}
              {isReady && playerError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 text-white">
                  <AlertCircle className="w-12 h-12 text-destructive" />
                  <p className="text-sm text-white/80 text-center px-4">{playerError}</p>
                </div>
              )}

              {/* Real HLS Player */}
              {isReady && !playerError && (
                <HlsPlayer
                  src={hlsUrl}
                  poster={video.thumbnail}
                  className="w-full h-full"
                  onError={(msg) => setPlayerError(msg)}
                />
              )}
            </div>

            {/* ── Video Info ─────────────────────────────────────────────── */}
            <div className="mt-6">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{video.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-muted-foreground">
                {video.creatorName && <span>by {video.creatorName}</span>}
                {video.year && (
                  <>
                    <span>•</span>
                    <span>{video.year}</span>
                  </>
                )}
                {video.status && video.status !== 'ready' && (
                  <>
                    <span>•</span>
                    <span className={cn(
                      'text-xs font-medium px-2 py-0.5 rounded-full',
                      video.status === 'processing' && 'bg-yellow-500/20 text-yellow-400',
                      video.status === 'pending' && 'bg-blue-500/20 text-blue-400',
                      video.status === 'failed' && 'bg-red-500/20 text-red-400',
                    )}>
                      {video.status}
                    </span>
                  </>
                )}
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

              {video.description && (
                <div className="mt-6 p-4 bg-card rounded-lg">
                  <p className="text-foreground leading-relaxed">{video.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Recommended Videos ───────────────────────────────────────── */}
          <aside className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recommended</h2>
            {recommendedVideos.length === 0 ? (
              <p className="text-muted-foreground text-sm">No recommendations yet.</p>
            ) : (
              <div className="space-y-2">
                {recommendedVideos.map((recVideo) => (
                  <VideoCard key={recVideo.id} video={recVideo} variant="horizontal" />
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default Watch;
