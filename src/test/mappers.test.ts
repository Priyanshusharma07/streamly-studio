import { describe, it, expect } from 'vitest';
import { mapApiVideoToFrontend } from '../services/api/mappers';
import type { ApiVideo } from '../services/api/types';

const baseVideo: ApiVideo = {
    id: 42,
    title: 'Test Video',
    description: 'A test video',
    status: 'ready',
    s3OriginalKey: 'originals/test.mp4',
    creator: { id: 1, username: 'alice' },
    createdAt: '2024-03-15T10:00:00.000Z',
    updatedAt: '2024-03-15T10:00:00.000Z',
};

describe('mapApiVideoToFrontend', () => {
    it('converts numeric id to string', () => {
        const result = mapApiVideoToFrontend(baseVideo);
        expect(result.id).toBe('42');
        expect(typeof result.id).toBe('string');
    });

    it('maps title and description correctly', () => {
        const result = mapApiVideoToFrontend(baseVideo);
        expect(result.title).toBe('Test Video');
        expect(result.description).toBe('A test video');
    });

    it('falls back to placeholder thumbnail when thumbnailPath is absent', () => {
        const result = mapApiVideoToFrontend({ ...baseVideo, thumbnailPath: undefined });
        expect(result.thumbnail).toContain('unsplash.com');
    });

    it('uses absolute thumbnailPath as-is when it starts with https', () => {
        const absoluteUrl = 'https://cdn.example.com/thumb.jpg';
        const result = mapApiVideoToFrontend({ ...baseVideo, thumbnailPath: absoluteUrl });
        expect(result.thumbnail).toBe(absoluteUrl);
    });

    it('prepends API_BASE_URL to a relative thumbnailPath', () => {
        const result = mapApiVideoToFrontend({ ...baseVideo, thumbnailPath: 'thumbnails/thumb.jpg' });
        // Should start with the base URL (localhost or env-configured)
        expect(result.thumbnail).toMatch(/^https?:\/\/.+thumbnails\/thumb\.jpg$/);
    });

    it('extracts year from createdAt', () => {
        const result = mapApiVideoToFrontend(baseVideo);
        expect(result.year).toBe(2024);
    });

    it('maps creator username to creatorName', () => {
        const result = mapApiVideoToFrontend(baseVideo);
        expect(result.creatorName).toBe('alice');
    });

    it('passes through status', () => {
        const result = mapApiVideoToFrontend({ ...baseVideo, status: 'processing' });
        expect(result.status).toBe('processing');
    });

    it('uses empty string for missing description', () => {
        const result = mapApiVideoToFrontend({ ...baseVideo, description: undefined });
        expect(result.description).toBe('');
    });
});
