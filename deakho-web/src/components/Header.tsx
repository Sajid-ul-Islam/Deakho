import { useState } from 'react';
import type { Group } from '../data/channels';

export type AccentColor =
  | 'gold'
  | 'blue'
  | 'green'
  | 'purple'
  | 'red'
  | 'cyan'
  | 'pink'
  | 'orange'
  | 'lime'
  | 'indigo'
  | 'rose'
  | 'teal'
  | 'amber'
  | 'slate';

interface HeaderProps {
  totalChannels: number;
  activeGroup: Group;
  onGroupChange: (group: Group) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  movieSearchQuery: string;
  onMovieSearchChange: (query: string) => void;
  groups: readonly Group[];
  onOpenImportModal?: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: (e: React.MouseEvent<HTMLButtonElement>) => void;
  accent: AccentColor;
  onAccentChange: (accent: AccentColor) => void;
  isMultiScreen?: boolean;
  onToggleMultiScreen?: () => void;
  appMode: 'tv' | 'movies';
  onAppModeChange: (mode: 'tv' | 'movies') => void;
}

const groupIcons: Record<string, string> = {
  All: '🖥️',
  Favorites: '⭐',
  Bangladeshi: '🇧🇩',
  News: '📰',
  Sports: '⚽',
  Entertainment: '🎬',
  Music: '🎵',
  Kids: '🎈',
  Documentary: '🌿',
  Religious: '🌙',
  Custom: '📁',
  '18+ Adult': '🔞',
};

const accents: { name: AccentColor; bg: string; label: string }[] = [
  { name: 'gold', bg: '#e5a00d', label: 'Plex Gold' },
  { name: 'blue', bg: '#3b82f6', label: 'Neon Blue' },
  { name: 'green', bg: '#10b981', label: 'Emerald' },
  { name: 'purple', bg: '#8b5cf6', label: 'Violet' },
  { name: 'red', bg: '#ef4444', label: 'Crimson' },
  { name: 'cyan', bg: '#06b6d4', label: 'Cyan' },
  { name: 'pink', bg: '#ec4899', label: 'Hot Pink' },
  { name: 'orange', bg: '#f97316', label: 'Sunset Orange' },
  { name: 'lime', bg: '#84cc16', label: 'Lime' },
  { name: 'indigo', bg: '#6366f1', label: 'Indigo' },
  { name: 'rose', bg: '#f43f5e', label: 'Rose Velvet' },
  { name: 'teal', bg: '#14b8a6', label: 'Ocean Teal' },
  { name: 'amber', bg: '#f59e0b', label: 'Amber Warm' },
  { name: 'slate', bg: '#94a3b8', label: 'Monochrome Slate' },
];

export default function Header({
  totalChannels,
  activeGroup,
  onGroupChange,
  searchQuery,
  onSearchChange,
  movieSearchQuery,
  onMovieSearchChange,
  groups,
  onOpenImportModal,
  theme,
  onToggleTheme,
  accent,
  onAccentChange,
  isMultiScreen = false,
  onToggleMultiScreen,
  appMode,
  onAppModeChange,
}: HeaderProps) {
  const [showPalette, setShowPalette] = useState(false);

  return (
    <header className="sticky top-0 z-30 plex-glass border-b border-border-dark shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 py-3.5">
          {/* Top row: Brand + Action buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Accent Logo */}
              <div className="flex items-center justify-center size-10 rounded-xl bg-accent text-black font-black text-lg shadow-md shadow-accent/20 transition-colors duration-300">
                P
              </div>

              <div>
                <h1 className="text-xl font-extrabold text-text-primary tracking-tight">
                  Deakho<span className="text-accent transition-colors duration-300">TV</span>
                  <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded bg-accent/20 text-accent uppercase tracking-widest transition-colors duration-300">
                    Plex Pass
                  </span>
                </h1>
                <p className="text-[11px] text-text-muted">
                  {totalChannels} live channels & VOD Movies · Instant Scraper
                </p>
              </div>
            </div>

            {/* Main Mode Switcher (Live TV vs Movies) */}
            <div className="flex items-center gap-1 bg-dark-card p-1 rounded-2xl border border-border-dark shadow-inner">
              <button
                onClick={() => onAppModeChange('tv')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  appMode === 'tv'
                    ? 'bg-accent text-black shadow-md shadow-accent/20 scale-[1.02]'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <span>📺 Live TV</span>
              </button>
              <button
                onClick={() => onAppModeChange('movies')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  appMode === 'movies'
                    ? 'bg-accent text-black shadow-md shadow-accent/20 scale-[1.02]'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <span>🎬 Movies & VOD</span>
              </button>
            </div>

            {/* Top actions */}
            <div className="flex items-center gap-2.5">
              {/* Multi-Screen Split Mode Button */}
              {onToggleMultiScreen && appMode === 'tv' && (
                <button
                  onClick={onToggleMultiScreen}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm ${
                    isMultiScreen
                      ? 'bg-accent text-black border-accent'
                      : 'bg-dark-card hover:bg-dark-hover border-border-dark text-text-primary'
                  }`}
                  title="Toggle Multi-Screen Split View"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Multi-Screen</span>
                </button>
              )}

              {/* Color Palette Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowPalette(!showPalette)}
                  className="size-9 rounded-xl bg-dark-card hover:bg-dark-hover border border-border-dark flex items-center justify-center text-text-primary transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                  title="Choose Color Palette Accent"
                >
                  <div
                    className="size-4 rounded-full border border-white/20 transition-colors duration-300"
                    style={{ backgroundColor: accents.find((a) => a.name === accent)?.bg || '#e5a00d' }}
                  />
                </button>

                {/* Palette Dropdown Popup */}
                {showPalette && (
                  <div className="absolute right-0 top-11 z-50 p-3.5 bg-dark-card border border-border-dark rounded-2xl shadow-2xl flex flex-col gap-2.5 min-w-[210px] animate-fadeIn">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                        Accent Theme (14 Colors)
                      </span>
                      <button
                        onClick={() => setShowPalette(false)}
                        className="text-[10px] text-text-muted hover:text-text-primary cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {accents.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => {
                            onAccentChange(item.name);
                            setShowPalette(false);
                          }}
                          className={`size-6 rounded-full flex items-center justify-center border transition-all cursor-pointer hover:scale-125 ${
                            accent === item.name
                              ? 'ring-2 ring-white ring-offset-2 ring-offset-dark-card border-white scale-110'
                              : 'border-transparent opacity-80 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: item.bg }}
                          title={item.label}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Water drop Theme Switcher Button */}
              <button
                onClick={onToggleTheme}
                className="size-9 rounded-xl bg-dark-card hover:bg-dark-hover border border-border-dark flex items-center justify-center text-accent transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? (
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
                  </svg>
                ) : (
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.3 2c-4.46 0-8.08 3.58-8.08 8.04 0 3.96 2.87 7.24 6.66 7.91.47.08.87-.29.87-.77 0-.35-.23-.66-.57-.75-2.82-.79-4.88-3.37-4.88-6.39 0-3.66 2.97-6.63 6.63-6.63 1.95 0 3.7.85 4.91 2.2.25.28.69.34 1.02.13.34-.21.46-.65.26-1.01A8.04 8.04 0 0012.3 2z" />
                  </svg>
                )}
              </button>

              {onOpenImportModal && (
                <button
                  onClick={onOpenImportModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/15 hover:bg-accent/25 border border-accent/30 text-accent text-xs font-bold transition-all cursor-pointer shadow-sm"
                  title="Import custom M3U playlist"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Import M3U</span>
                </button>
              )}
            </div>
          </div>

          {/* Bottom row: Category Pills + Search */}
          {appMode === 'tv' ? (
            <div className="flex items-center gap-3">
              {/* Group filters */}
              <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                {groups.map((group) => (
                  <button
                    key={group}
                    onClick={() => onGroupChange(group)}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
                      transition-all duration-200 whitespace-nowrap cursor-pointer
                      ${
                        activeGroup === group
                          ? 'bg-accent text-black shadow-md shadow-accent/20 scale-[1.02]'
                          : 'bg-dark-card text-text-secondary hover:bg-dark-hover hover:text-text-primary border border-border-dark'
                      }
                    `}
                  >
                    <span className="text-sm">{groupIcons[group] || '📺'}</span>
                    {group}
                  </button>
                ))}
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Search TV Channels */}
              <div className="relative max-w-[220px] shrink-0">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-text-muted pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search channels..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-deep-blue border border-border-dark text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all"
                />
              </div>
            </div>
          ) : (
            /* Movie Instant Scraper Search Bar */
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-accent">🔍 Movie Instant Scraper:</span>
                <span className="text-[11px] text-text-muted hidden sm:inline">
                  Search any movie title worldwide to instantly scrape & stream!
                </span>
              </div>

              <div className="relative w-full max-w-md">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-accent pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Type any movie title (e.g. Avatar, Oppenheimer, Spider-Man)..."
                  value={movieSearchQuery}
                  onChange={(e) => onMovieSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-deep-blue border border-accent/40 text-xs text-white placeholder-text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all shadow-md"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
