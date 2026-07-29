import { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import type { Channel } from '../types';

interface VideoPlayerProps {
  channel: Channel | null;
  urlIndex: number;
  onClose: () => void;
  onSwitchUrl: (index: number) => void;
  onNextChannel?: () => void;
  onPrevChannel?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const getYouTubeEmbedUrl = (url: string) => {
  if (url.includes('youtube.com/embed/')) return url;
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('watch?v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  if (url.includes('channel/')) {
    const channelId = url.split('channel/')[1]?.split('/')[0]?.split('?')[0];
    return `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=1`;
  }
  return url;
};

export default function VideoPlayer({
  channel,
  urlIndex,
  onClose,
  onSwitchUrl,
  onNextChannel,
  onPrevChannel,
  isFavorite = false,
  onToggleFavorite,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [failoverMsg, setFailoverMsg] = useState<string | null>(null);
  const controlsTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const currentUrl = channel?.urls[urlIndex];
  const isYouTube = currentUrl?.url.includes('youtube.com') || currentUrl?.url.includes('youtu.be');

  const destroyHls = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.detachMedia();
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, []);

  const triggerAutoFailover = useCallback(() => {
    if (!channel) return;
    if (urlIndex < channel.urls.length - 1) {
      const nextIdx = urlIndex + 1;
      const nextLabel = channel.urls[nextIdx].label;
      setFailoverMsg(`Stream failed. Auto-switching to ${nextLabel}...`);
      setTimeout(() => {
        setFailoverMsg(null);
        onSwitchUrl(nextIdx);
      }, 1500);
    } else {
      setError('All stream sources failed for this channel. Try again later.');
    }
  }, [channel, urlIndex, onSwitchUrl]);

  const loadStream = useCallback(() => {
    if (!currentUrl) return;

    destroyHls();
    setError(null);
    setIsPlaying(false);

    if (isYouTube) {
      setIsPlaying(true);
      return;
    }

    if (!videoRef.current) return;
    const video = videoRef.current;

    if (currentUrl.url.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          xhrSetup: (xhr) => {
            if (channel?.needsHeaders || currentUrl.needsHeaders) {
              xhr.setRequestHeader('Referer', 'https://www.jagobd.com/');
              xhr.setRequestHeader(
                'User-Agent',
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              );
            }
          },
        });
        hlsRef.current = hls;
        hls.loadSource(currentUrl.url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            triggerAutoFailover();
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = currentUrl.url;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(() => {});
        });
        video.onerror = () => triggerAutoFailover();
      } else {
        setError('HLS is not supported in this browser.');
      }
    } else {
      video.src = currentUrl.url;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => {});
      });
      video.onerror = () => triggerAutoFailover();
    }
  }, [currentUrl, channel?.needsHeaders, destroyHls, triggerAutoFailover, isYouTube]);

  useEffect(() => {
    loadStream();
    return () => {
      destroyHls();
    };
  }, [loadStream, destroyHls]);

  // Auto-hide controls
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3500);
  }, []);

  const togglePlay = useCallback(() => {
    if (isYouTube || !videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isYouTube]);

  const toggleMute = useCallback(() => {
    if (isYouTube || !videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  }, [isYouTube]);

  const toggleFullscreen = useCallback(() => {
    if (!videoRef.current && !isYouTube) return;
    const container = document.getElementById('deakho-player-container');
    if (!document.fullscreenElement) {
      container?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, [isYouTube]);

  const togglePiP = useCallback(async () => {
    if (isYouTube || !videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (e) {
      console.warn('PiP failed:', e);
    }
  }, [isYouTube]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (isYouTube || !videoRef.current) return;
    const v = parseFloat(e.target.value);
    videoRef.current.volume = v;
    videoRef.current.muted = v === 0;
    setVolume(v);
    setIsMuted(v === 0);
  }, [isYouTube]);

  // TV Remote Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      switch (e.key) {
        case ' ':
        case 'k':
        case 'K':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          togglePiP();
          break;
        case 'ArrowRight':
          if (onNextChannel) {
            e.preventDefault();
            onNextChannel();
          }
          break;
        case 'ArrowLeft':
          if (onPrevChannel) {
            e.preventDefault();
            onPrevChannel();
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleFullscreen, toggleMute, togglePiP, onNextChannel, onPrevChannel, onClose]);

  if (!channel) return null;

  return (
    <div
      id="deakho-player-container"
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group shadow-2xl border border-border-dark"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      {isYouTube ? (
        <iframe
          src={getYouTubeEmbedUrl(currentUrl!.url)}
          title={channel.name}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <video
          ref={videoRef}
          className="w-full h-full object-contain cursor-pointer"
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          playsInline
        />
      )}

      {/* Auto Failover Notice */}
      {failoverMsg && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-accent/90 text-black px-4 py-2 rounded-xl text-xs font-semibold shadow-lg z-30 animate-bounce">
          {failoverMsg}
        </div>
      )}

      {/* Error overlay */}
      {error && !isYouTube && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 z-20 gap-4 p-4 text-center">
          <div className="size-16 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="size-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-400 text-sm max-w-md">{error}</p>
          {channel.urls.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 max-w-md">
              {channel.urls.map((u, i) => (
                <button
                  key={u.label}
                  onClick={() => {
                    setError(null);
                    onSwitchUrl(i);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    i === urlIndex
                      ? 'bg-accent text-black'
                      : 'bg-dark-hover text-text-secondary hover:bg-border-light hover:text-white'
                  }`}
                >
                  {u.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Loading spinner for native HLS */}
      {!error && !isPlaying && !isYouTube && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 pointer-events-none">
          <div className="size-12 border-4 border-border-light border-t-accent rounded-full animate-spin" />
        </div>
      )}

      {/* Top overlay */}
      <div
        className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/90 via-black/40 to-transparent transition-opacity duration-300 z-20 pointer-events-auto ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {channel.logo && (
              <img
                src={channel.logo}
                alt=""
                className="size-9 rounded-xl object-contain bg-dark-card p-1 shadow"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-sm sm:text-base leading-tight">
                  {channel.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-streaming/20 border border-streaming/30 text-streaming text-[10px] font-semibold">
                  LIVE
                </span>
                {isYouTube && (
                  <span className="px-2 py-0.5 rounded-full bg-red-600/30 border border-red-500/40 text-red-400 text-[10px] font-bold">
                    YouTube Official
                  </span>
                )}
              </div>
              <p className="text-text-muted text-xs mt-0.5">
                {currentUrl?.label || 'Primary'} · Category: {channel.group}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Favorite button */}
            {onToggleFavorite && (
              <button
                onClick={onToggleFavorite}
                className={`size-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors cursor-pointer ${
                  isFavorite ? 'text-amber-400' : 'text-white/70 hover:text-white'
                }`}
                title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              >
                <svg className="size-4" fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="size-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors cursor-pointer text-white"
              title="Close player (Esc)"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 z-20 pointer-events-auto ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Previous Channel */}
          {onPrevChannel && (
            <button
              onClick={onPrevChannel}
              className="size-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
              title="Previous Channel (Left Arrow)"
            >
              <svg className="size-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>
          )}

          {!isYouTube && (
            <>
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="size-10 rounded-full bg-accent hover:bg-accent-light text-black flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-lg"
                title="Play / Pause (Space)"
              >
                {isPlaying ? (
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="size-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Volume */}
              <button
                onClick={toggleMute}
                className="size-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                title="Mute / Unmute (M)"
              >
                {isMuted || volume === 0 ? (
                  <svg className="size-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg className="size-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>

              {/* Volume slider */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-20 h-1 appearance-none bg-white/20 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </>
          )}

          {/* Next Channel */}
          {onNextChannel && (
            <button
              onClick={onNextChannel}
              className="size-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
              title="Next Channel (Right Arrow)"
            >
              <svg className="size-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          )}

          <div className="flex-1" />

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="size-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            title="Fullscreen (F)"
          >
            <svg className="size-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>

          {/* Source Switcher */}
          {channel.urls.length > 1 && (
            <div className="flex gap-1 bg-black/60 p-1 rounded-lg border border-white/10">
              {channel.urls.map((u, i) => (
                <button
                  key={u.label}
                  onClick={() => {
                    setError(null);
                    onSwitchUrl(i);
                  }}
                  className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                    i === urlIndex
                      ? 'bg-accent text-black shadow-sm'
                      : 'bg-white/5 text-white/70 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  {u.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
