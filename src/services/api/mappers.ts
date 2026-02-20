import type { ApiVideo, FrontendVideo } from '@/services/api/types';
import { API_BASE_URL } from '@/services/api/config';

/** Resolve thumbnail URL — handles absolute URLs, relative paths, and missing values. */
const resolveThumbnail = (thumbnailPath?: string): string => {
  if (!thumbnailPath) {
    return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=450&fit=crop';
  }
  if (thumbnailPath.startsWith('http://') || thumbnailPath.startsWith('https://')) {
    return thumbnailPath;
  }
  // Relative S3/CDN key — prefix with base URL
  return `${API_BASE_URL}/${thumbnailPath.replace(/^\//, '')}`;
};

/**
 * Maps backend ApiVideo to the FrontendVideo shape used by UI components.
 *
 * NOTE: The backend does not yet return `category`, `language`, `duration`,
 * `rating`, or `views`. Those fields are kept as safe defaults until the
 * backend adds them. All other fields are mapped directly.
 */
export const mapApiVideoToFrontend = (v: ApiVideo): FrontendVideo => ({
  id: String(v.id),
  title: v.title,
  description: v.description ?? '',
  thumbnail: resolveThumbnail(v.thumbnailPath),

  // ── Fields not yet provided by the backend ──────────────────────────────
  duration: '—',       // TODO: backend should return duration in seconds
  category: '',        // TODO: backend should return category
  language: '',        // TODO: backend should return language
  type: 'movie',       // TODO: backend should return type (movie | series | live | short)
  rating: 0,           // TODO: backend should return rating
  views: '0',          // TODO: backend should return view count
  // ────────────────────────────────────────────────────────────────────────

  year: new Date(v.createdAt).getFullYear(),
  status: v.status,
  hlsManifestPath: v.hlsManifestPath,
  signedUrl: v.signedUrl,
  creatorName: v.creator?.username,
});
