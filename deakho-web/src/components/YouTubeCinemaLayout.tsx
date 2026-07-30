import { useState, useMemo } from 'react';
import type { Channel } from '../types';
import VideoPlayer from './VideoPlayer';

interface YouTubeCinemaLayoutProps {
  channel: Channel;
  allChannels: Channel[];
  urlIndex: number;
  onClose: () => void;
  onSwitchUrl: (index: number) => void;
  onNextChannel: () => void;
  onPrevChannel: () => void;
  onSelectChannel: (id: string) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function YouTubeCinemaLayout({
  channel,
  allChannels,
  urlIndex,
  onClose,
  onSwitchUrl,
  onNextChannel,
  onPrevChannel,
  onSelectChannel,
  isFavorite,
  onToggleFavorite,
}: YouTubeCinemaLayoutProps) {
  const [activeSuggestionChip, setActiveSuggestionChip] = useState<string>('All');
  const [likesCount, setLikesCount] = useState<number>(1420);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Suggestion chips
  const suggestionChips = [
    'All',
    'Up Next',
    'Bangladeshi',
    'News',
    'Sports',
    'Entertainment',
    'Kids',
    'Religious',
  ];

  // Up Next / Related channels filtered by selected chip
  const suggestedChannels = useMemo(() => {
    let list = allChannels.filter((c) => c.id !== channel.id);
    if (activeSuggestionChip === 'Up Next') {
      return list;
    }
    if (activeSuggestionChip !== 'All') {
      const matched = list.filter((c) => c.group.toLowerCase().includes(activeSuggestionChip.toLowerCase()));
      if (matched.length > 0) return matched;
    }
    return list;
  }, [allChannels, channel.id, activeSuggestionChip]);

  const handleLikeToggle = () => {
    if (isLiked) {
      setLikesCount((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikesCount((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-slideUp">
      {/* 2-Column Responsive Layout (YouTube Desktop & Mobile UI/UX) */}
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-full min-w-0">
        
        {/* Main Video & Channel Info Column (72% on Desktop) */}
        <div className="flex-1 flex flex-col gap-4 w-full max-w-full min-w-0">
          
          {/* Active Cinema Video Player (100% Edge-to-Edge Mobile Scaling) */}
          <div className="-mx-4 sm:mx-0 w-[calc(100%+2rem)] sm:w-full overflow-hidden">
            <VideoPlayer
              channel={channel}
              urlIndex={urlIndex}
              onClose={onClose}
              onSwitchUrl={onSwitchUrl}
              onNextChannel={onNextChannel}
              onPrevChannel={onPrevChannel}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
            />
          </div>

          {/* YouTube Style Channel Action Header */}
          <div className="bg-dark-card border border-border-dark rounded-2xl p-4 flex flex-col gap-3 shadow-xl">
            {/* Title & Group */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>{channel.name}</span>
                  <span className="size-4 rounded-full bg-accent/20 border border-accent/40 text-accent flex items-center justify-center text-[10px] font-extrabold" title="Verified Broadcast">
                    ✓
                  </span>
                </h2>
                <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                  <span className="font-bold text-accent px-2 py-0.5 rounded bg-accent/15 uppercase text-[10px]">
                    {channel.group}
                  </span>
                  <span>•</span>
                  <span className="text-streaming font-semibold flex items-center gap-1">
                    <span className="size-2 rounded-full bg-streaming animate-pulse" />
                    1.4K Watching Live
                  </span>
                </div>
              </div>

              {/* Subscribe / Favorite Button */}
              <button
                onClick={onToggleFavorite}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-md flex items-center gap-1.5 ${
                  isFavorite
                    ? 'bg-amber-500 text-black shadow-amber-500/20'
                    : 'bg-accent text-black hover:scale-105 shadow-accent/20'
                }`}
              >
                <span>{isFavorite ? '⭐ Saved' : '⭐ Favorite'}</span>
              </button>
            </div>

            {/* YouTube Style Action Pill Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-border-dark/60 text-xs">
              {/* Like Button */}
              <button
                onClick={handleLikeToggle}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer ${
                  isLiked
                    ? 'bg-accent/20 text-accent border-accent/40'
                    : 'bg-deep-blue text-text-secondary border-border-dark hover:text-white'
                }`}
              >
                <span>👍</span>
                <span>{likesCount}</span>
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-deep-blue border border-border-dark text-text-secondary hover:text-white font-bold transition-all cursor-pointer"
              >
                <span>🔗</span>
                <span>{copiedShare ? 'Copied!' : 'Share'}</span>
              </button>

              {/* Next Channel Shortcut */}
              {onNextChannel && (
                <button
                  onClick={onNextChannel}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-deep-blue border border-border-dark text-text-secondary hover:text-white font-bold transition-all cursor-pointer"
                >
                  <span>⏭️</span>
                  <span>Next Stream</span>
                </button>
              )}

              {/* Quality & Audio Badge */}
              <div className="px-3 py-1.5 rounded-xl bg-deep-blue border border-border-dark text-accent text-[11px] font-mono font-bold flex items-center gap-1">
                <span>⚡ 1080p HD</span>
              </div>
            </div>
          </div>

          {/* YouTube Style Slide Type Suggestion Chips (Swipeable Carousel Bar) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full max-w-full">
            <span className="text-xs font-bold text-accent uppercase tracking-wider shrink-0 mr-1">
              Explore:
            </span>
            {suggestionChips.map((chip) => (
              <button
                key={chip}
                onClick={() => setActiveSuggestionChip(chip)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeSuggestionChip === chip
                    ? 'bg-accent text-black shadow-md shadow-accent/20 scale-[1.02]'
                    : 'bg-dark-card text-text-secondary hover:bg-dark-hover border border-border-dark'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* YouTube Mobile Swipable Recommendation Cards */}
          <div className="lg:hidden flex flex-col gap-3">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              🔥 Up Next Streams ({suggestedChannels.length})
            </h3>

            {/* Horizontal Swipable Thumbnail Cards Row */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
              {suggestedChannels.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectChannel(item.id)}
                  className="snap-start shrink-0 w-44 bg-dark-card border border-border-dark rounded-xl p-2.5 flex flex-col gap-2 cursor-pointer hover:border-accent transition-all"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black/60 flex items-center justify-center p-2">
                    <img
                      src={item.logo}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
                    <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-streaming text-black text-[9px] font-black">
                      LIVE
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{item.name}</p>
                    <p className="text-[10px] text-text-muted truncate">{item.group}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Up Next Sidebar (28% Width) */}
        <div className="hidden lg:flex flex-col gap-3 w-80 shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <span>🔥 Up Next Live Streams</span>
              <span className="text-accent font-bold">({suggestedChannels.length})</span>
            </h3>
          </div>

          <div className="flex flex-col gap-2.5 max-h-[750px] overflow-y-auto pr-1">
            {suggestedChannels.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectChannel(item.id)}
                className="group p-2.5 rounded-xl bg-dark-card hover:bg-dark-hover border border-border-dark hover:border-accent/60 flex items-center gap-3 transition-all cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative size-14 rounded-lg bg-black/50 overflow-hidden flex items-center justify-center p-1.5 shrink-0 border border-border-dark group-hover:border-accent">
                  <img
                    src={item.logo}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                  <div className="absolute bottom-0.5 right-0.5 size-2 rounded-full bg-streaming animate-pulse" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white group-hover:text-accent truncate transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-text-muted font-medium truncate mt-0.5">
                    {item.group} • {item.urls.length} Source{item.urls.length > 1 ? 's' : ''}
                  </p>
                  <span className="inline-block mt-1 px-1.5 py-0.2 rounded bg-accent/15 text-accent text-[9px] font-extrabold">
                    ▶ Watch Stream
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
