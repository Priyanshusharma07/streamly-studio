import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface HlsPlayerProps {
    /** HLS manifest URL (master.m3u8) */
    src: string;
    /** Optional thumbnail/poster shown before playback starts */
    poster?: string;
    className?: string;
    autoPlay?: boolean;
    onReady?: () => void;
    onError?: (message: string) => void;
}

/**
 * Cross-browser HLS video player.
 * – Uses hls.js on browsers that don't natively support HLS (Chrome, Firefox, Edge).
 * – Falls back to native HLS on Safari / iOS which supports it out-of-the-box.
 */
const HlsPlayer: React.FC<HlsPlayerProps> = ({
    src,
    poster,
    className,
    autoPlay = false,
    onReady,
    onError,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !src) return;

        if (Hls.isSupported()) {
            // ── hls.js path (Chrome, Firefox, Edge) ─────────────────────────────
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: false,
            });
            hlsRef.current = hls;

            hls.loadSource(src);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                onReady?.();
                if (autoPlay) {
                    video.play().catch(() => {
                        // Autoplay blocked by browser policy — silently ignore
                    });
                }
            });

            hls.on(Hls.Events.ERROR, (_event, data) => {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            onError?.('Network error while loading video stream.');
                            hls.startLoad(); // attempt recovery
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            onError?.('Media error while playing video.');
                            hls.recoverMediaError(); // attempt recovery
                            break;
                        default:
                            onError?.('Fatal streaming error.');
                            hls.destroy();
                            break;
                    }
                }
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // ── Native HLS path (Safari / iOS) ──────────────────────────────────
            video.src = src;
            video.addEventListener('loadedmetadata', () => {
                onReady?.();
                if (autoPlay) {
                    video.play().catch(() => { });
                }
            });
        } else {
            onError?.('Your browser does not support HLS video playback.');
        }

        return () => {
            // Cleanup hls.js instance on unmount
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [src]); // re-initialise whenever the src URL changes

    return (
        <video
            ref={videoRef}
            poster={poster}
            className={className}
            controls
            playsInline
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default HlsPlayer;
