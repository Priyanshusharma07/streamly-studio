import { useQuery } from '@tanstack/react-query';
import {
  getVideos,
  getVideoById,
  getTrendingVideos,
  getRecentVideos,
  getMovies,
} from '@/services/api/videoApi';
import { mapApiVideoToFrontend } from '@/services/api/mappers';
import type { VideoListParams, FrontendVideo } from '@/services/api/types';

export const useVideos = (params?: VideoListParams) => {
  return useQuery({
    queryKey: ['videos', params],
    queryFn: () => getVideos(params),
    select: (data) => ({
      ...data,
      data: data.data.map(mapApiVideoToFrontend),
    }),
  });
};

export const useVideoById = (id: string | number | undefined) => {
  return useQuery({
    queryKey: ['video', id],
    queryFn: () => getVideoById(id!),
    enabled: !!id,
    select: mapApiVideoToFrontend,
  });
};

export const useTrendingVideos = (limit = 8) => {
  return useQuery({
    queryKey: ['videos', 'trending', limit],
    queryFn: () => getTrendingVideos(limit),
    select: (data) => data.data.map(mapApiVideoToFrontend),
  });
};

export const useRecentVideos = (limit = 8) => {
  return useQuery({
    queryKey: ['videos', 'recent', limit],
    queryFn: () => getRecentVideos(limit),
    select: (data) => data.data.map(mapApiVideoToFrontend),
  });
};

export const useMovies = (limit = 8) => {
  return useQuery({
    queryKey: ['videos', 'movies', limit],
    queryFn: () => getMovies(limit),
    select: (data) => data.data.map(mapApiVideoToFrontend),
  });
};
