import React from 'react';

interface SkeletonCardProps {
  variant?: 'default' | 'horizontal';
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ variant = 'default' }) => {
  if (variant === 'horizontal') {
    return (
      <div className="flex gap-4 p-2">
        <div className="w-40 aspect-video rounded-lg skeleton-shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded skeleton-shimmer" />
          <div className="h-3 w-1/2 rounded skeleton-shimmer" />
          <div className="h-3 w-1/3 rounded skeleton-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden">
      <div className="aspect-video skeleton-shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 rounded skeleton-shimmer" />
        <div className="h-3 w-1/2 rounded skeleton-shimmer" />
      </div>
    </div>
  );
};

export const SkeletonCarousel: React.FC = () => {
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="h-7 w-48 rounded skeleton-shimmer mb-4" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-64 md:w-72">
              <SkeletonCard />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const SkeletonHero: React.FC = () => {
  return (
    <section className="relative h-[70vh] md:h-[85vh]">
      <div className="absolute inset-0 skeleton-shimmer" />
      <div className="relative h-full container mx-auto px-4 flex items-end pb-20">
        <div className="max-w-2xl space-y-4">
          <div className="h-8 w-32 rounded skeleton-shimmer" />
          <div className="h-12 w-96 rounded skeleton-shimmer" />
          <div className="h-20 w-full rounded skeleton-shimmer" />
          <div className="flex gap-4">
            <div className="h-12 w-36 rounded skeleton-shimmer" />
            <div className="h-12 w-36 rounded skeleton-shimmer" />
          </div>
        </div>
      </div>
    </section>
  );
};
