import { apiFetch, API_BASE_URL, apiHeaders } from './config';
import type {
  ApiVideo,
  InitiateUploadDto,
  InitiateUploadResponse,
  CompleteUploadResponse,
  VideoListParams,
  PaginatedResponse,
} from './types';

// --- Video CRUD ---

export const getVideos = async (params?: VideoListParams): Promise<PaginatedResponse<ApiVideo>> => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.category && params.category !== 'All') searchParams.set('category', params.category);
  if (params?.language && params.language !== 'All') searchParams.set('language', params.language);
  if (params?.type && params.type !== 'all') searchParams.set('type', params.type);
  if (params?.search) searchParams.set('search', params.search);
  if (params?.sort) searchParams.set('sort', params.sort);

  const query = searchParams.toString();
  return apiFetch<PaginatedResponse<ApiVideo>>(`/videos${query ? `?${query}` : ''}`);
};

export const getVideoById = async (id: number | string): Promise<ApiVideo> => {
  return apiFetch<ApiVideo>(`/videos/${id}`);
};

// --- Upload Flow ---

export const initiateUpload = async (dto: InitiateUploadDto): Promise<InitiateUploadResponse> => {
  return apiFetch<InitiateUploadResponse>('/videos/initiate', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
};

export const uploadFileToS3 = async (
  presignedUrl: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', presignedUrl, true);
    xhr.setRequestHeader('Content-Type', file.type);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`S3 upload failed: ${xhr.status}`));
    };

    xhr.onerror = () => reject(new Error('S3 upload network error'));
    xhr.send(file);
  });
};

export const completeUpload = async (videoId: number): Promise<CompleteUploadResponse> => {
  return apiFetch<CompleteUploadResponse>(`/videos/${videoId}/complete`, {
    method: 'POST',
  });
};

// --- Playback ---

export const getHlsManifestUrl = (videoId: number | string): string => {
  return `${API_BASE_URL}/videos/${videoId}/playback/master.m3u8`;
};

// --- Featured / Trending (convenience wrappers) ---

export const getTrendingVideos = async (limit = 8): Promise<PaginatedResponse<ApiVideo>> => {
  return getVideos({ sort: 'trending', limit });
};

export const getRecentVideos = async (limit = 8): Promise<PaginatedResponse<ApiVideo>> => {
  return getVideos({ sort: 'recent', limit });
};

export const getMovies = async (limit = 8): Promise<PaginatedResponse<ApiVideo>> => {
  return getVideos({ type: 'movie', limit });
};
