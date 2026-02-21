import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ThumbsUp, Share2, MoreHorizontal, CheckCircle2,
  DollarSign, Play, Loader2, AlertCircle, RotateCcw,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { HlsPlayer } from '@/components/video/HlsPlayer';
import { useVideoById } from '@/hooks/useVideos';
import { getHlsManifestUrl } from '@/services/api/videoApi';
import { mockVideos } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { VideoCard, VideoCardData } from '@/components/video/VideoCard';

const toCard = (v: any): VideoCardData => ({
  id: v.id, title: v.title, thumbnail: v.thumbnail,
  duration: v.duration, category: v.category, views: v.views,
  isLive: v.isLive, creatorName: v.creatorName || 'StreamHub Creator',
});

const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: video, isLoading, isError } = useVideoById(id);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const relatedVideos: VideoCardData[] = mockVideos.slice(0, 6).map(toCard);

  const isReady = video?.status === 'ready' || (!isLoading && !isError && !video);
  const isProcessing = video?.status === 'processing';
  const isFailed = video?.status === 'failed';

  const hlsUrl = id ? getHlsManifestUrl(id) : '';

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Layout>
        <div className="p-6 max-w-7xl mx-auto">
          <div className="skeleton-shimmer aspect-video w-full rounded-xl mb-6" />
          <div className="flex gap-6">
            <div className="flex-1 space-y-3">
              <div className="skeleton-shimmer h-7 w-3/4 rounded-lg" />
              <div className="skeleton-shimmer h-4 w-1/2 rounded-lg" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError && !video) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-96 gap-4 text-center px-4">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <h2 className="text-xl font-bold text-foreground">Video Not Found</h2>
          <p className="text-muted-foreground text-sm">This video may have been removed or is unavailable.</p>
          <Link to="/" className="btn-cyan px-6 py-2 rounded-lg text-sm">Go Home</Link>
        </div>
      </Layout>
    );
  }

  const displayVideo = video || { title: mockVideos[0].title, description: mockVideos[0].description, thumbnail: mockVideos[0].thumbnail, views: mockVideos[0].views, creatorName: 'StreamHub Creator', year: 2024, category: 'General' };

  return (
    <Layout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Left: Player + Info ───────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Player */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-4">
              {isProcessing ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-sm font-medium text-foreground">Processing your video…</p>
                  <p className="text-xs text-muted-foreground">This usually takes a few minutes</p>
                </div>
              ) : isFailed ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                  <AlertCircle className="w-10 h-10 text-destructive" />
                  <p className="text-sm font-medium text-foreground">Processing failed</p>
                  <p className="text-xs text-muted-foreground">Please try uploading again</p>
                </div>
              ) : playerError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <AlertCircle className="w-10 h-10 text-destructive" />
                  <p className="text-sm text-muted-foreground">{playerError}</p>
                  <button onClick={() => setPlayerError(null)} className="btn-cyan px-4 py-2 rounded-lg text-xs gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5" /> Retry
                  </button>
                </div>
              ) : (
                <HlsPlayer
                  src={hlsUrl}
                  poster={displayVideo.thumbnail}
                  className="w-full h-full"
                  onError={(msg) => setPlayerError(msg)}
                />
              )}
            </div>

            {/* Title + tags */}
            <h1 className="text-xl font-bold text-foreground mb-2 leading-snug">
              {displayVideo.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm text-muted-foreground">{displayVideo.views} views</span>
              <span className="text-muted-foreground/40">•</span>
              {displayVideo.category && <span className="tag-pill-cyan">{displayVideo.category}</span>}
            </div>

            {/* Action bar */}
            <div className="flex items-center justify-between py-3 border-y border-white/[.06] mb-5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLiked(!liked)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    liked
                      ? 'text-primary bg-primary/10 border border-primary/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60',
                  )}
                >
                  <ThumbsUp className={cn('w-4 h-4', liked && 'fill-current')} />
                  <span>45K</span>
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-lg transition-all">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Creator info */}
            <div className="flex items-start gap-3 mb-5 p-4 rounded-xl bg-secondary/30">
              <div
                className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold"
                style={{ background: 'var(--gradient-cyan-purple)', color: 'hsl(220 20% 6%)' }}
              >
                {displayVideo.creatorName?.charAt(0) || 'S'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-foreground">{displayVideo.creatorName || 'StreamHub Creator'}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#00D4FF' }} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">2.4M subscribers</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="btn-cyan py-2 px-4 text-xs rounded-lg">Subscribe</button>
                <button className="btn-outline-cyan py-2 px-3 text-xs rounded-lg gap-1.5">
                  <DollarSign className="w-3 h-3" /> Tip Creator
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 rounded-xl bg-secondary/20">
              <p className={cn('text-sm text-muted-foreground leading-relaxed', !showFullDesc && 'line-clamp-3')}>
                {displayVideo.description || 'No description available.'}
              </p>
              <button
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="text-xs mt-2 font-medium transition-colors hover:text-foreground"
                style={{ color: '#00D4FF' }}
              >
                {showFullDesc ? 'Show less' : 'Show more'}
              </button>
            </div>
          </div>

          {/* ── Right: Up Next ────────────────────────────────────────────── */}
          <div className="lg:w-80 xl:w-96 flex-shrink-0">
            <h3 className="text-sm font-semibold text-foreground mb-3">Up Next</h3>
            <div className="space-y-1">
              {relatedVideos.map((v) => (
                <VideoCard key={v.id} video={v} variant="horizontal" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Watch;
