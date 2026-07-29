import type { Channel } from '../types';

interface ChannelCardProps {
  channel: Channel;
  isActive: boolean;
  isFavorite?: boolean;
  onClick: () => void;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

export default function ChannelCard({
  channel,
  isActive,
  isFavorite = false,
  onClick,
  onToggleFavorite,
}: ChannelCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        relative group flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl
        transition-all duration-200 ease-out cursor-pointer select-none
        border
        ${
          isActive
            ? 'border-accent bg-accent/10 shadow-lg shadow-accent/10 scale-[1.02]'
            : 'border-border-dark bg-dark-card hover:border-border-light hover:bg-dark-hover hover:scale-[1.02]'
        }
      `}
    >
      {/* Top action row: Favorite star & Status dot */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
        {onToggleFavorite ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(e);
            }}
            className={`p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer ${
              isFavorite ? 'text-amber-400' : 'text-text-muted hover:text-white'
            }`}
            title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          >
            <svg
              className="size-4"
              fill={isFavorite ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-1">
          {channel.isAdult && (
            <span className="px-1.5 py-0.5 rounded bg-red-600/30 border border-red-500/40 text-red-400 text-[9px] font-bold">
              18+
            </span>
          )}
          <div className="size-2 rounded-full bg-streaming animate-[pulse-glow_2s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* Logo */}
      <div className="size-14 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center p-2 transition-transform duration-200 group-hover:scale-110 mt-1">
        <img
          src={channel.logo}
          alt={`${channel.name} logo`}
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.innerHTML = `
                <div class="flex items-center justify-center w-full h-full text-accent font-bold text-lg">
                  ${channel.name
                    .split(' ')
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join('')}
                </div>
              `;
            }
          }}
        />
      </div>

      {/* Name */}
      <div className="text-center min-w-0 w-full">
        <p className="text-xs font-medium text-text-primary truncate leading-tight">
          {channel.name}
        </p>
        <p className="text-[10px] text-text-muted mt-0.5">{channel.group}</p>
      </div>

      {/* Hover indicator */}
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/0 group-hover:ring-white/10 transition-all duration-200 pointer-events-none" />

      {/* Active indicator bar */}
      {isActive && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent rounded-full" />
      )}
    </div>
  );
}
