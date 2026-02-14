import type { ApiVideo, FrontendVideo } from '@/services/api/types';
import { API_BASE_URL } from '@/services/api/config';

/**
 * Maps backend ApiVideo to the FrontendVideo shape used by UI components.
 * Adjust field mappings as your backend evolves.
 */
export const mapApiVideoToFrontend = (v: ApiVideo): FrontendVideo => ({
  id: String(v.id),
  title: v.title,
  description: v.description || '',
  thumbnail: v.thumbnailPath
    ? (v.thumbnailPath.startsWith('http') ? v.thumbnailPath : `${API_BASE_URL}/${v.thumbnailPath}`)
    : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=450&fit=crop',
  duration: '—',
  category: '',
  language: '',
  type: 'movie',
  rating: 0,
  year: new Date(v.createdAt).getFullYear(),
  views: '0',
  status: v.status,
  hlsManifestPath: v.hlsManifestPath,
  signedUrl: v.signedUrl,
  creatorName: v.creator?.username,
});
