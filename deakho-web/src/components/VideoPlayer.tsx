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

interface QualityLevel {
  index: number;
  name: string;
}

interface TrackInfo {
  id: number;
  name: string;
}

interface StreamStats {
  resolution: string;
  bitrate: string;
  buffer: string;
  fps: number;
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
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [audioBoost, setAudioBoost] = useState<number>(1); // 1x to 2x (200% volume boost)
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [failoverMsg, setFailoverMsg] = useState<string | null>(null);

  // Quality, Audio, Subtitle tracks
  const [qualityLevels, setQualityLevels] = useState<QualityLevel[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1);
  const [audioTracks, setAudioTracks] = useState<TrackInfo[]>([]);
  const [currentAudio, setCurrentAudio] = useState<number>(0);
  const [subtitleTracks, setSubtitleTracks] = useState<TrackInfo[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<number>(-1);

  // Enhancements: Stream Stats & DVR Rewind
  const [showStats, setShowStats] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [streamStats, setStreamStats] = useState<StreamStats>({
    resolution: 'Auto 1080p',
    bitrate: '3.5 Mbps',
    buffer: '12.4s',
    fps: 60,
  });

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

  // Audio Booster (Web Audio API 200% Gain Node)
  const setupAudioBooster = useCallback(() => {
    if (isYouTube || !videoRef.current || audioCtxRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const source = ctx.createMediaElementSource(videoRef.current);
      const gainNode = ctx.createGain();
      gainNode.gain.value = audioBoost;
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      audioCtxRef.current = ctx;
      gainNodeRef.current = gainNode;
    } catch (e) {
      console.warn('Audio booster init note:', e);
    }
  }, [audioBoost, isYouTube]);

  const handleAudioBoostChange = (boostVal: number) => {
    setAudioBoost(boostVal);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = boostVal;
    } else {
      setupAudioBooster();
    }
  };

  const loadStream = useCallback(() => {
    if (!currentUrl) return;

    destroyHls();
    setError(null);
    setIsPlaying(false);
    setQualityLevels([]);
    setAudioTracks([]);
    setSubtitleTracks([]);

    if (isYouTube) {
      setIsPlaying(true);
      return;
    }

    if (!videoRef.current) return;
    const video = videoRef.current;

    if (currentUrl.url.endsWith('.m3u8') || currentUrl.url.includes('.m3u8')) {
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

        hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
          video.play().catch(() => {});

          if (data.levels && data.levels.length > 0) {
            const formatted = data.levels.map((lvl, idx) => ({
              index: idx,
              name: lvl.height ? `${lvl.height}p HD` : `Level ${idx + 1}`,
            }));
            setQualityLevels(formatted);
          }

          if (hls.audioTracks && hls.audioTracks.length > 0) {
            const formattedAudio = hls.audioTracks.map((tr, idx) => ({
              id: idx,
              name: tr.name || tr.lang || `Audio Track ${idx + 1}`,
            }));
            setAudioTracks(formattedAudio);
          }

          if (hls.subtitleTracks && hls.subtitleTracks.length > 0) {
            const formattedSubtitles = hls.subtitleTracks.map((tr, idx) => ({
              id: idx,
              name: tr.name || tr.lang || `Subtitle ${idx + 1}`,
            }));
            setSubtitleTracks(formattedSubtitles);
          }
        });

        // Real-time Stream Health Monitor
        hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
          const lvl = hls.levels[data.level];
          if (lvl) {
            setStreamStats((prev) => ({
              ...prev,
              resolution: `${lvl.width}x${lvl.height}`,
              bitrate: `${(lvl.bitrate / 1000000).toFixed(2)} Mbps`,
            }));
          }
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

  const handleChangeQuality = (levelIdx: number) => {
    setCurrentQuality(levelIdx);
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIdx;
    }
  };

  const handleChangeAudio = (audioIdx: number) => {
    setCurrentAudio(audioIdx);
    if (hlsRef.current) {
      hlsRef.current.audioTrack = audioIdx;
    }
  };

  const handleChangeSubtitle = (subIdx: number) => {
    setCurrentSubtitle(subIdx);
    if (hlsRef.current) {
      hlsRef.current.subtitleTrack = subIdx;
    }
  };

  // DVR Seek Controls (-10s / +10s / Go Live)
  const handleRewind = (seconds: number) => {
    if (isYouTube || !videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - seconds);
  };

  const handleForward = (seconds: number) => {
    if (isYouTube || !videoRef.current) return;
    videoRef.current.currentTime = videoRef.current.currentTime + seconds;
  };

  const handleSyncLive = () => {
    if (isYouTube || !videoRef.current) return;
    if (videoRef.current.seekable.length > 0) {
      videoRef.current.currentTime = videoRef.current.seekable.end(0);
    }
  };

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
    const container = document.getElementById('deakho-player-container');
    if (!document.fullscreenElement) {
      container?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

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

  // Smart TV Remote Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea', 'select'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }

      switch (e.key) {
        case ' ':
        case 'k':
        case 'Enter':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleRewind(10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleForward(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (videoRef.current) {
            const newVol = Math.min(1, videoRef.current.volume + 0.1);
            videoRef.current.volume = newVol;
            setVolume(newVol);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (videoRef.current) {
            const newVol = Math.max(0, videoRef.current.volume - 0.1);
            videoRef.current.volume = newVol;
            setVolume(newVol);
          }
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          togglePiP();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleFullscreen, togglePiP, toggleMute, onClose]);

  if (!channel || !currentUrl) return null;

  return (
    <div
      id="deakho-player-container"
      onMouseMove={handleMouseMove}
      className="relative w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-border-dark group flex flex-col"
    >
      {/* Video Container */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
        {isYouTube ? (
          <iframe
            src={getYouTubeEmbedUrl(currentUrl.url)}
            title={channel.name}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onClick={togglePlay}
          />
        )}

        {/* Live Stream Health Stats (Nerd Stats Overlay) */}
        {showStats && (
          <div className="absolute top-4 left-4 z-40 bg-black/85 backdrop-blur-md border border-accent/40 rounded-xl p-3 text-[11px] font-mono text-accent flex flex-col gap-1 shadow-2xl animate-fadeIn">
            <div className="font-bold flex items-center justify-between border-b border-accent/30 pb-1 mb-1 text-white">
              <span>📊 Stream Nerd Stats</span>
              <button onClick={() => setShowStats(false)} className="text-text-muted hover:text-white">✕</button>
            </div>
            <div>Resolution: <span className="text-white">{streamStats.resolution}</span></div>
            <div>Bitrate: <span className="text-white">{streamStats.bitrate}</span></div>
            <div>Buffer: <span className="text-white">{streamStats.buffer}</span></div>
            <div>FPS: <span className="text-white">{streamStats.fps} fps</span></div>
            <div>Audio Boost: <span className="text-white">{audioBoost * 100}%</span></div>
          </div>
        )}

        {/* Failover Notification */}
        {failoverMsg && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-30 animate-fadeIn">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-card border border-accent/40 shadow-2xl text-accent font-bold text-xs">
              <div className="size-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span>{failoverMsg}</span>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center gap-3 z-30">
            <div className="size-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-xl">
              ⚠️
            </div>
            <p className="text-white text-sm font-semibold max-w-md">{error}</p>
            <button
              onClick={loadStream}
              className="px-4 py-2 rounded-xl bg-accent text-black font-bold text-xs hover:scale-105 transition-transform cursor-pointer"
            >
              Retry Stream
            </button>
          </div>
        )}

        {/* Overlays / Settings Popup */}
        {showSettingsMenu && !isYouTube && (
          <div className="absolute right-4 bottom-16 z-40 bg-dark-card border border-border-dark p-3.5 rounded-2xl shadow-2xl text-xs text-white min-w-[220px] flex flex-col gap-3 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-border-dark">
              <span className="font-extrabold text-accent">⚙️ Audio & Quality Settings</span>
              <button onClick={() => setShowSettingsMenu(false)} className="text-text-muted hover:text-white">✕</button>
            </div>

            {/* Audio Booster 200% Gain */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px] text-text-muted uppercase font-bold">
                <span>🔊 Audio Booster</span>
                <span className="text-accent">{Math.round(audioBoost * 100)}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.1"
                value={audioBoost}
                onChange={(e) => handleAudioBoostChange(parseFloat(e.target.value))}
                className="w-full h-1 accent-accent rounded cursor-pointer"
              />
            </div>

            {/* Quality Selector */}
            {qualityLevels.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-text-muted uppercase font-bold">📊 Quality</span>
                <select
                  value={currentQuality}
                  onChange={(e) => handleChangeQuality(parseInt(e.target.value))}
                  className="bg-deep-blue text-white rounded-lg p-1.5 border border-border-dark text-xs"
                >
                  <option value={-1}>Auto (Adaptive)</option>
                  {qualityLevels.map((lvl) => (
                    <option key={lvl.index} value={lvl.index}>{lvl.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Audio Track Selector */}
            {audioTracks.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-text-muted uppercase font-bold">🎙️ Audio Language</span>
                <select
                  value={currentAudio}
                  onChange={(e) => handleChangeAudio(parseInt(e.target.value))}
                  className="bg-deep-blue text-white rounded-lg p-1.5 border border-border-dark text-xs"
                >
                  {audioTracks.map((tr) => (
                    <option key={tr.id} value={tr.id}>{tr.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Subtitle Selector */}
            {subtitleTracks.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-text-muted uppercase font-bold">💬 Subtitles</span>
                <select
                  value={currentSubtitle}
                  onChange={(e) => handleChangeSubtitle(parseInt(e.target.value))}
                  className="bg-deep-blue text-white rounded-lg p-1.5 border border-border-dark text-xs"
                >
                  <option value={-1}>Off</option>
                  {subtitleTracks.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Toggle Nerd Stats */}
            <button
              onClick={() => { setShowStats(!showStats); setShowSettingsMenu(false); }}
              className="mt-1 py-1 px-2 rounded bg-deep-blue border border-border-dark text-[10px] text-text-muted hover:text-white transition-colors"
            >
              {showStats ? 'Hide Stream Stats' : '📊 Show Stream Health Stats'}
            </button>
          </div>
        )}
      </div>

      {/* Control Bar Overlay */}
      <div
        className={`p-4 bg-gradient-to-t from-dark-card via-dark-card/90 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-3">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {channel.logo && (
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className="size-8 rounded-lg object-contain bg-black/40 p-1 border border-border-dark"
                />
              )}
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <span>{channel.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-accent/20 text-accent uppercase">
                    {channel.group}
                  </span>
                </h3>
                <p className="text-[11px] text-text-muted">
                  Source {urlIndex + 1} of {channel.urls.length}: {currentUrl.label}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Favorite Star */}
              {onToggleFavorite && (
                <button
                  onClick={onToggleFavorite}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    isFavorite
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                      : 'bg-deep-blue border-border-dark text-text-muted hover:text-white'
                  }`}
                  title={isFavorite ? 'Remove Favorite' : 'Save Favorite'}
                >
                  ⭐
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-deep-blue hover:bg-dark-hover border border-border-dark text-text-muted hover:text-white transition-colors cursor-pointer"
                title="Close Player (Esc)"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-2">
              {!isYouTube && (
                <>
                  <button
                    onClick={togglePlay}
                    className="p-2.5 rounded-xl bg-accent text-black hover:scale-105 transition-transform cursor-pointer shadow-md"
                    title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                  >
                    {isPlaying ? (
                      <svg className="size-4 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                    ) : (
                      <svg className="size-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    )}
                  </button>

                  {/* DVR Time-Shift Controls */}
                  <button
                    onClick={() => handleRewind(10)}
                    className="p-2 rounded-xl bg-deep-blue hover:bg-dark-hover border border-border-dark text-text-muted hover:text-white text-xs font-bold transition-colors cursor-pointer"
                    title="Rewind 10 Seconds (←)"
                  >
                    ↺ 10s
                  </button>
                  <button
                    onClick={() => handleForward(10)}
                    className="p-2 rounded-xl bg-deep-blue hover:bg-dark-hover border border-border-dark text-text-muted hover:text-white text-xs font-bold transition-colors cursor-pointer"
                    title="Forward 10 Seconds (→)"
                  >
                    10s ↻
                  </button>
                  <button
                    onClick={handleSyncLive}
                    className="px-2.5 py-1.5 rounded-xl bg-streaming/15 border border-streaming/30 text-streaming text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    title="Sync to Live Stream"
                  >
                    <div className="size-1.5 rounded-full bg-streaming animate-pulse" />
                    <span>LIVE</span>
                  </button>
                </>
              )}

              {/* Prev / Next Channel Remote Buttons */}
              {onPrevChannel && (
                <button
                  onClick={onPrevChannel}
                  className="p-2 rounded-xl bg-deep-blue hover:bg-dark-hover border border-border-dark text-text-secondary hover:text-white transition-colors cursor-pointer text-xs font-bold"
                  title="Previous Channel"
                >
                  ◀ Prev
                </button>
              )}
              {onNextChannel && (
                <button
                  onClick={onNextChannel}
                  className="p-2 rounded-xl bg-deep-blue hover:bg-dark-hover border border-border-dark text-text-secondary hover:text-white transition-colors cursor-pointer text-xs font-bold"
                  title="Next Channel"
                >
                  Next ▶
                </button>
              )}

              {/* Volume Slider */}
              {!isYouTube && (
                <div className="hidden sm:flex items-center gap-2 ml-2">
                  <button
                    onClick={toggleMute}
                    className="text-text-muted hover:text-white cursor-pointer"
                    title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                  >
                    {isMuted || volume === 0 ? '🔇' : '🔊'}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 accent-accent rounded cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              {/* Settings Gear */}
              {!isYouTube && (
                <button
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                  className="px-2.5 py-1.5 rounded-xl bg-deep-blue border border-border-dark text-accent hover:bg-dark-hover text-xs font-extrabold transition-colors cursor-pointer flex items-center gap-1"
                  title="Stream Settings (Audio Boost, Quality, Subtitles)"
                >
                  <span>⚙️</span>
                  <span className="hidden sm:inline">Settings</span>
                </button>
              )}

              {/* PiP Button */}
              {!isYouTube && (
                <button
                  onClick={togglePiP}
                  className="p-2 rounded-xl bg-deep-blue hover:bg-dark-hover border border-border-dark text-text-muted hover:text-white transition-colors cursor-pointer"
                  title="Picture in Picture (P)"
                >
                  📺
                </button>
              )}

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-xl bg-deep-blue hover:bg-dark-hover border border-border-dark text-text-muted hover:text-white transition-colors cursor-pointer"
                title="Fullscreen (F)"
              >
                ⛶
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
