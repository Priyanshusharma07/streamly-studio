import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { HeroBanner } from '@/components/video/HeroBanner';
import { VideoCarousel } from '@/components/video/VideoCarousel';
import { SkeletonHero, SkeletonCarousel } from '@/components/video/SkeletonCard';
import { mockVideos, liveStreams, featuredVideo } from '@/data/mockData';

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const trendingVideos = mockVideos.slice(0, 8);
  const movies = mockVideos.filter((v) => v.type === 'movie');
  const recentlyAdded = [...mockVideos].reverse().slice(0, 8);

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
      {/* Hero Banner */}
      <HeroBanner video={featuredVideo} />

      {/* Trending Now */}
      <div className="-mt-20 relative z-10">
        <VideoCarousel
          title="Trending Now"
          videos={trendingVideos}
          showSeeAll
          onSeeAll={() => navigate('/browse?sort=trending')}
        />
      </div>

      {/* Live Streams */}
      <VideoCarousel
        title="🔴 Live Now"
        videos={liveStreams}
        showSeeAll
        onSeeAll={() => navigate('/live')}
      />

      {/* Movies */}
      <VideoCarousel
        title="Popular Movies"
        videos={movies}
        showSeeAll
        onSeeAll={() => navigate('/browse?type=movie')}
      />

      {/* Recently Added */}
      <VideoCarousel
        title="Recently Added"
        videos={recentlyAdded}
        showSeeAll
        onSeeAll={() => navigate('/browse?sort=recent')}
      />

      {/* Footer */}
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
