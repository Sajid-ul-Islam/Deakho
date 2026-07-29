import type { Channel } from '../types';

interface PlexHeroBannerProps {
  channel: Channel;
  onPlayChannel: (channelId: string) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function PlexHeroBanner({
  channel,
  onPlayChannel,
  isFavorite,
  onToggleFavorite,
}: PlexHeroBannerProps) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden mb-8 border border-border-dark shadow-2xl group bg-gradient-to-r from-black via-dark-card to-deep-blue">
      {/* Background Image / Blur Accent */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark-card/70 to-transparent z-10" />
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center filter blur-xl scale-110 transition-all duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${channel.logo})` }}
      />

      {/* Banner Content */}
      <div className="relative z-20 p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-5 max-w-2xl">
          {/* Logo container */}
          <div className="size-20 sm:size-24 rounded-2xl bg-black/60 border border-white/10 p-3 flex items-center justify-center shadow-xl backdrop-blur-md shrink-0">
            <img
              src={channel.logo}
              alt={channel.name}
              className="max-w-full max-h-full object-contain filter drop-shadow-md"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-accent text-black text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                FEATURED LIVE
              </span>
              <span className="px-2 py-0.5 rounded-md bg-streaming/20 border border-streaming/40 text-streaming text-[10px] font-bold flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-streaming animate-pulse" />
                ON AIR
              </span>
              <span className="text-text-muted text-xs font-medium">· {channel.group}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
              {channel.name}
            </h1>

            <p className="text-xs sm:text-sm text-text-secondary mt-1.5 max-w-lg line-clamp-2 leading-relaxed">
              Stream live television broadcast directly in high definition with multi-source fallback support.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => onPlayChannel(channel.id)}
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-accent hover:bg-accent-light text-black font-extrabold text-xs sm:text-sm transition-all transform hover:scale-105 shadow-lg shadow-accent/20 cursor-pointer flex items-center justify-center gap-2.5"
          >
            <svg className="size-5 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>WATCH LIVE NOW</span>
          </button>

          <button
            onClick={onToggleFavorite}
            className={`p-3 rounded-xl border transition-all cursor-pointer shadow-md ${
              isFavorite
                ? 'bg-amber-400/15 border-amber-400/40 text-amber-400'
                : 'bg-black/40 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
            }`}
            title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          >
            <svg
              className="size-5"
              fill={isFavorite ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
