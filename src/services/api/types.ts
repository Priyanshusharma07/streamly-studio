// ============================================
// Backend DTOs & Entity types matching NestJS
// ============================================

// --- Video Entity ---
export type VideoStatus = 'pending' | 'processing' | 'ready' | 'failed';

export interface VideoCreator {
  id: number;
  username: string;
  avatar?: string;
}

export interface ApiVideo {
  id: number;
  title: string;
  description?: string;
  status: VideoStatus;
  s3OriginalKey: string;
  s3HlsKey?: string;
  thumbnailPath?: string;
  creator: VideoCreator;
  createdAt: string;
  updatedAt: string;
  // Extended fields returned by GET /videos/:id
  hlsManifestPath?: string;
  signedUrl?: string;
  expiresIn?: number;
}

// --- Initiate Upload ---
export interface InitiateUploadDto {
  title: string;
  description?: string;
  videoExt: string;
  thumbnailExt?: string;
}

export interface InitiateUploadResponse {
  videoId: number;
  uploadUrls: {
    video: string;
    thumbnail: string | null;
  };
  keys: {
    video: string;
    thumbnail: string | null;
  };
}

// --- Complete Upload ---
export interface CompleteUploadResponse {
  message: string;
  status: 'processing';
}

// --- Video List ---
export interface VideoListParams {
  page?: number;
  limit?: number;
  category?: string;
  language?: string;
  type?: string;
  search?: string;
  sort?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// --- Auth ---
export interface LoginDto {
  email: string;
  password: string;
}

export interface SignupDto {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

// --- Password Management ---
export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  token: string;
  newPassword: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

// --- User Management ---
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

// --- Frontend-compatible Video type (for UI components) ---
export interface FrontendVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: string;
  language: string;
  type: 'movie' | 'series' | 'live' | 'short';
  rating: number;
  year: number;
  views: string;
  isLive?: boolean;
  viewerCount?: number;
  status?: VideoStatus;
  hlsManifestPath?: string;
  signedUrl?: string;
  creatorName?: string;
}
