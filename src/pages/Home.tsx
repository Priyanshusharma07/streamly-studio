import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { HeroBanner } from '@/components/video/HeroBanner';
import { VideoCarousel } from '@/components/video/VideoCarousel';
import { SkeletonHero, SkeletonCarousel } from '@/components/video/SkeletonCard';
import { useTrendingVideos, useRecentVideos, useMovies } from '@/hooks/useVideos';
import { mockVideos, liveStreams } from '@/data/mockData';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { data: trending, isLoading: trendingLoading } = useTrendingVideos();
  const { data: recent, isLoading: recentLoading } = useRecentVideos();
  const { data: movies, isLoading: moviesLoading } = useMovies();

  const isLoading = trendingLoading && recentLoading && moviesLoading;

  // Use API data if available, fallback to mock data
  const trendingVideos = trending && trending.length > 0 ? trending : mockVideos.slice(0, 8);
  const recentVideos = recent && recent.length > 0 ? recent : [...mockVideos].reverse().slice(0, 8);
  const movieVideos = movies && movies.length > 0 ? movies : mockVideos.filter((v) => v.type === 'movie');

  // Use first real trending video for the hero banner; fall back to mock
  const featuredVideo = trendingVideos[0] ?? mockVideos[0];

  if (isLoading) {
    return (
      <Layout>
        <SkeletonHero />
        <SkeletonCarousel />
        <SkeletonCarousel />
        <SkeletonCarousel />
      </Layout>
    );
  }

  return (
    <Layout>
      <HeroBanner video={featuredVideo} />

      <div className="-mt-20 relative z-10">
        <VideoCarousel
          title="Trending Now"
          videos={trendingVideos}
          showSeeAll
          onSeeAll={() => navigate('/browse?sort=trending')}
        />
      </div>

      <VideoCarousel
        title="🔴 Live Now"
        videos={liveStreams}
        showSeeAll
        onSeeAll={() => navigate('/live')}
      />

      <VideoCarousel
        title="Popular Movies"
        videos={movieVideos}
        showSeeAll
        onSeeAll={() => navigate('/browse?type=movie')}
      />

      <VideoCarousel
        title="Recently Added"
        videos={recentVideos}
        showSeeAll
        onSeeAll={() => navigate('/browse?sort=recent')}
      />

      <footer className="py-12 border-t border-border mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">© 2024 StreamVault. All rights reserved.</p>
          <p className="text-xs mt-2">A personal portfolio project.</p>
        </div>
      </footer>
    </Layout>
  );
};

export default Home;
