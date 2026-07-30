import { useState, useRef, useEffect } from 'react';

interface LocalMediaPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LocalMediaPlayerModal({ isOpen, onClose }: LocalMediaPlayerModalProps) {
  const [activeTab, setActiveTab] = useState<'local' | 'network'>('local');
  const [networkUrl, setNetworkUrl] = useState('');
  const [mediaSrc, setMediaSrc] = useState<string | null>(null);
  const [mediaTitle, setMediaTitle] = useState<string>('');
  const [mediaType, setMediaType] = useState<'video' | 'audio'>('video');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [autoPipOnTabSwitch, setAutoPipOnTabSwitch] = useState(true);

  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle local file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isAudio = file.type.startsWith('audio');
    setMediaType(isAudio ? 'audio' : 'video');
    setMediaTitle(file.name);

    const objectUrl = URL.createObjectURL(file);
    setMediaSrc(objectUrl);
    setIsPlaying(true);
  };

  // Handle network URL load
  const handleNetworkLoad = () => {
    if (!networkUrl.trim()) return;
    const url = networkUrl.trim();
    const isAudio = url.match(/\.(mp3|aac|flac|wav|ogg|m4a)(\?.*)?$/i);
    setMediaType(isAudio ? 'audio' : 'video');
    
    // Extract title from URL
    const filename = url.split('/').pop() || 'Network Stream';
    setMediaTitle(decodeURIComponent(filename));
    setMediaSrc(url);
    setIsPlaying(true);
  };

  // Configure MediaSession for background audio playback when tab/app minimized
  useEffect(() => {
    if (!mediaSrc || !('mediaSession' in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: mediaTitle || 'Deakho Media Stream',
      artist: 'DeakhoTV Universal Player',
      album: 'Background Audio Mode',
      artwork: [
        {
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Sony_Aath_logo.svg/512px-Sony_Aath_logo.svg.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    });

    navigator.mediaSession.setActionHandler('play', () => {
      if (mediaRef.current) {
        mediaRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      if (mediaRef.current) {
        mediaRef.current.pause();
        setIsPlaying(false);
      }
    });

    return () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
      }
    };
  }, [mediaSrc, mediaTitle]);

  // Auto Picture-in-Picture when tab/browser is minimized
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (
        document.hidden &&
        autoPipOnTabSwitch &&
        mediaRef.current &&
        mediaType === 'video' &&
        isPlaying &&
        mediaRef.current instanceof HTMLVideoElement &&
        !document.pictureInPictureElement
      ) {
        try {
          if (document.pictureInPictureEnabled && !mediaRef.current.paused) {
            await mediaRef.current.requestPictureInPicture();
          }
        } catch (e) {
          console.warn('Auto PiP on tab switch failed:', e);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [autoPipOnTabSwitch, isPlaying, mediaType]);

  const togglePlay = () => {
    if (!mediaRef.current) return;
    if (mediaRef.current.paused) {
      mediaRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      mediaRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePiP = async () => {
    if (!mediaRef.current || !(mediaRef.current instanceof HTMLVideoElement)) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await mediaRef.current.requestPictureInPicture();
      }
    } catch (e) {
      console.warn('PiP error:', e);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (mediaRef.current) {
      mediaRef.current.playbackRate = speed;
    }
  };

  const handleResetMedia = () => {
    if (mediaSrc && mediaSrc.startsWith('blob:')) {
      URL.revokeObjectURL(mediaSrc);
    }
    setMediaSrc(null);
    setMediaTitle('');
    setIsPlaying(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-dark-card border border-border-dark rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-dark bg-deep-blue/60">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent font-bold">
              🎬
            </div>
            <div>
              <h2 className="text-white font-extrabold text-base tracking-tight">
                Universal Media Player
              </h2>
              <p className="text-text-muted text-xs">
                Play Local & Network Video/Audio with Background & PiP Support
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="size-8 rounded-full bg-deep-blue hover:bg-dark-hover flex items-center justify-center text-text-muted hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col gap-5 overflow-y-auto">
          {!mediaSrc ? (
            /* Input Selector Tabs */
            <div className="flex flex-col gap-4">
              {/* Tabs */}
              <div className="flex items-center gap-2 p-1 rounded-xl bg-deep-blue border border-border-dark">
                <button
                  onClick={() => setActiveTab('local')}
                  className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all ${
                    activeTab === 'local' ? 'bg-accent text-black shadow-sm' : 'text-text-muted'
                  }`}
                >
                  📁 Local File (PC / Mobile)
                </button>
                <button
                  onClick={() => setActiveTab('network')}
                  className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all ${
                    activeTab === 'network' ? 'bg-accent text-black shadow-sm' : 'text-text-muted'
                  }`}
                >
                  🌐 Network Stream URL
                </button>
              </div>

              {activeTab === 'local' ? (
                /* Drag & Drop File Selector */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-accent/40 hover:border-accent bg-deep-blue/40 hover:bg-deep-blue/80 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all text-center"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*,audio/*,.mkv,.mp4,.avi,.webm,.mp3,.flac,.wav,.aac"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="size-14 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent text-2xl">
                    📁
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Click or Drag & Drop File Here</p>
                    <p className="text-xs text-text-muted mt-1">
                      Supports MP4, MKV, WebM, MP3, AAC, FLAC, WAV & more
                    </p>
                  </div>
                </div>
              ) : (
                /* Network URL Stream Input */
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold text-text-primary">Enter Network File or Stream URL:</label>
                  <input
                    type="url"
                    placeholder="https://example.com/video.mp4 or stream.m3u8"
                    value={networkUrl}
                    onChange={(e) => setNetworkUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-deep-blue border border-border-dark text-xs text-white placeholder-text-muted focus:border-accent focus:outline-none"
                  />
                  <button
                    onClick={handleNetworkLoad}
                    className="w-full py-2.5 rounded-xl bg-accent text-black font-extrabold text-xs shadow-lg shadow-accent/20 cursor-pointer"
                  >
                    ▶ Load & Play Stream
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Active Media Player View */
            <div className="flex flex-col gap-4">
              {/* Header Title Bar */}
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-white truncate">{mediaTitle}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-text-muted mt-0.5">
                    <span className="px-1.5 py-0.5 rounded bg-accent/20 text-accent font-extrabold uppercase">
                      {mediaType}
                    </span>
                    <span>• MediaSession Background Active</span>
                  </div>
                </div>

                <button
                  onClick={handleResetMedia}
                  className="px-3 py-1.5 rounded-xl bg-deep-blue border border-border-dark text-xs text-text-muted hover:text-white font-bold cursor-pointer"
                >
                  🔄 Open Another File
                </button>
              </div>

              {/* Player Container */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-border-dark shadow-2xl">
                {mediaType === 'video' ? (
                  <video
                    ref={mediaRef as React.RefObject<HTMLVideoElement>}
                    src={mediaSrc}
                    autoPlay
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 gap-4 text-center w-full">
                    {/* Animated Audio Equalizer Bar */}
                    <div className="flex items-end gap-1.5 h-16">
                      {[40, 75, 100, 60, 90, 45, 80, 50, 95, 30].map((h, i) => (
                        <div
                          key={i}
                          className="w-2.5 rounded-full bg-accent animate-pulse"
                          style={{
                            height: `${isPlaying ? h : 15}%`,
                            animationDuration: `${0.4 + (i % 5) * 0.2}s`,
                          }}
                        />
                      ))}
                    </div>

                    <audio
                      ref={mediaRef as React.RefObject<HTMLAudioElement>}
                      src={mediaSrc}
                      autoPlay
                      controls
                      className="w-full mt-4"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  </div>
                )}
              </div>

              {/* Background & PiP Controls Toolbar */}
              <div className="p-3.5 rounded-2xl bg-deep-blue border border-border-dark flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  {/* Play / Pause Toggle Button */}
                  <button
                    onClick={togglePlay}
                    className="px-3 py-1.5 rounded-xl bg-accent text-black font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>{isPlaying ? '⏸️ Pause' : '▶ Play'}</span>
                  </button>

                  {/* PiP Button for Video */}
                  {mediaType === 'video' && (
                    <button
                      onClick={togglePiP}
                      className="px-3 py-1.5 rounded-xl bg-dark-card hover:bg-dark-hover border border-border-dark text-accent font-bold flex items-center gap-1.5 cursor-pointer"
                      title="Float player in Picture-in-Picture window"
                    >
                      <span>🖼️</span>
                      <span>Floating PiP Screen</span>
                    </button>
                  )}

                  {/* Auto PiP on Tab Switch Toggle */}
                  <label className="flex items-center gap-2 text-text-muted font-medium cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={autoPipOnTabSwitch}
                      onChange={(e) => setAutoPipOnTabSwitch(e.target.checked)}
                      className="accent-accent"
                    />
                    <span>Auto-PiP on Tab Minimize</span>
                  </label>
                </div>

                {/* Speed Controls */}
                <div className="flex items-center gap-1">
                  <span className="text-text-muted text-[11px] font-bold mr-1">Speed:</span>
                  {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                        playbackSpeed === s
                          ? 'bg-accent text-black'
                          : 'bg-dark-card text-text-muted hover:text-white'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
