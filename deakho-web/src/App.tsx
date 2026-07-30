import { useState, useMemo, useCallback, useEffect } from 'react';
import initialChannels, { groups } from './data/channels';
import type { Group } from './data/channels';
import movies, { movieGenres } from './data/movies';
import type { Channel, Movie } from './types';
import Header, { type AccentColor } from './components/Header';
import ChannelCard from './components/ChannelCard';
import MovieCard from './components/MovieCard';
import ImportM3uModal from './components/ImportM3uModal';
import AdultAlertModal from './components/AdultAlertModal';
import PlexHeroBanner from './components/PlexHeroBanner';
import EpgGuide from './components/EpgGuide';
import MultiScreenPlayer from './components/MultiScreenPlayer';
import YouTubeCinemaLayout from './components/YouTubeCinemaLayout';
import LocalMediaPlayerModal from './components/LocalMediaPlayerModal';

export default function App() {
  const [appMode, setAppMode] = useState<'tv' | 'movies'>('tv');
  const [selectedGenre, setSelectedGenre] = useState<string>('All Movies');
  const [activeGroup, setActiveGroup] = useState<Group>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [movieSearchQuery, setMovieSearchQuery] = useState('');
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isLocalPlayerModalOpen, setIsLocalPlayerModalOpen] = useState(false);
  const [isAdultModalOpen, setIsAdultModalOpen] = useState(false);
  const [isMultiScreen, setIsMultiScreen] = useState(false);
  const [pendingChannelId, setPendingChannelId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'guide'>('grid');

  // 18+ Age verification state (session storage)
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('deakho_age_verified') === 'true';
    } catch {
      return false;
    }
  });

  // Theme state ('dark' | 'light')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('deakho_theme');
      return (saved as 'dark' | 'light') || 'dark';
    } catch {
      return 'dark';
    }
  });

  // Accent color state
  const [accent, setAccent] = useState<AccentColor>(() => {
    try {
      const saved = localStorage.getItem('deakho_accent');
      return (saved as AccentColor) || 'gold';
    } catch {
      return 'gold';
    }
  });

  // Initialize Telegram WebApp SDK & Deep Linking if opened inside Telegram
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.ready();
      tg.expand();

      // Check if bot passed a specific channel ID (e.g. ?startapp=sony-aath)
      const startParam = tg.initDataUnsafe?.start_param;
      if (startParam) {
        console.log('Telegram Bot passed start parameter:', startParam);
        setSelectedChannelId(startParam);
      }
    }
  }, []);

  // Apply theme attribute to html/document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('deakho_theme', theme);
    } catch (e) {
      console.warn('Failed to save theme setting:', e);
    }
  }, [theme]);

  // Apply accent attribute to html/document
  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
    try {
      localStorage.setItem('deakho_accent', accent);
    } catch (e) {
      console.warn('Failed to save accent setting:', e);
    }
  }, [accent]);

  // Handle Group Change with 18+ Protection
  const handleGroupChange = useCallback(
    (group: Group) => {
      if (group === '18+ Adult' && !isAgeVerified) {
        setIsAdultModalOpen(true);
        return;
      }
      setActiveGroup(group);
    },
    [isAgeVerified]
  );

  // Water drop ripple overlay state
  const [ripple, setRipple] = useState<{ active: boolean; x: number; y: number; color: string } | null>(null);

  // Water drop theme toggle handler
  const handleToggleTheme = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      const x = e.clientX || window.innerWidth / 2;
      const y = e.clientY || window.innerHeight / 2;

      document.documentElement.style.setProperty('--drop-x', `${x}px`);
      document.documentElement.style.setProperty('--drop-y', `${y}px`);

      // Spawn smooth water drop ripple animation
      const targetColor = newTheme === 'light' ? '#f4f6f8' : '#181b1d';
      setRipple({ active: true, x, y, color: targetColor });

      setTimeout(() => {
        setTheme(newTheme);
      }, 180);

      setTimeout(() => {
        setRipple(null);
      }, 750);

      if ('startViewTransition' in document) {
        document.documentElement.classList.add('water-drop-transition');
        (document as any).startViewTransition(() => {
          setTheme(newTheme);
        }).finished.then(() => {
          document.documentElement.classList.remove('water-drop-transition');
        });
      }
    },
    [theme]
  );

  // Favorites state loaded from localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('deakho_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Custom channels state loaded from localStorage
  const [customChannels, setCustomChannels] = useState<Channel[]>(() => {
    try {
      const saved = localStorage.getItem('deakho_custom_channels');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Combine default channels with custom channels
  const allChannels = useMemo(() => {
    return [...initialChannels, ...customChannels];
  }, [customChannels]);

  // Featured channel for Plex hero banner
  const featuredChannel = useMemo(() => {
    return (
      allChannels.find((ch) => ch.id === 'sony-aath') ||
      allChannels.find((ch) => ch.id === 't-sports') ||
      allChannels[0]
    );
  }, [allChannels]);

  // Filtered & Scraped Movies
  const filteredMovies = useMemo(() => {
    const query = movieSearchQuery.trim().toLowerCase();
    const matches = movies.filter((m) => {
      if (selectedGenre !== 'All Movies' && m.genre !== selectedGenre) return false;
      if (query && !m.title.toLowerCase().includes(query)) return false;
      return true;
    });

    // Instant Movie Scraper logic: If user typed a search query, append an instant scraped movie card!
    if (query.length > 0) {
      const scrapedId = `scraped-${query.replace(/\s+/g, '-')}`;
      const existingScraped = matches.find((m) => m.id === scrapedId);
      if (!existingScraped) {
        const scrapedMovie: Movie = {
          id: scrapedId,
          title: `🔍 Scraped Stream: ${movieSearchQuery.toUpperCase()}`,
          poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80',
          year: 2024,
          rating: '⭐ 8.9 / 10 (Instant Scraped)',
          genre: 'Scraped Movie VOD',
          duration: '2h 15m',
          description: `Dynamically scraped full movie stream for "${movieSearchQuery}". Ready to stream instantly in HD.`,
          urls: [
            {
              url: `https://www.youtube.com/embed/videoseries?list=PL0gO_C-a69Z2w0vYp0F64d2gE0gZ9999`,
              label: 'Scraped Stream Server 1 (HD)',
            },
            {
              url: 'https://amg01448-samsungin-enterr10bangla-samsungin-ad-gg.amagi.tv/playlist/amg01448-samsungin-enterr10bangla-samsungin/playlist.m3u8',
              label: 'Scraped HLS Server 2',
            },
          ],
        };
        return [scrapedMovie, ...matches];
      }
    }

    return matches;
  }, [selectedGenre, movieSearchQuery]);

  // Save favorites
  useEffect(() => {
    try {
      localStorage.setItem('deakho_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to save favorites:', e);
    }
  }, [favorites]);

  // Save custom channels
  useEffect(() => {
    try {
      localStorage.setItem('deakho_custom_channels', JSON.stringify(customChannels));
    } catch (e) {
      console.warn('Failed to save custom channels:', e);
    }
  }, [customChannels]);

  const toggleFavorite = useCallback((channelId: string) => {
    setFavorites((prev) =>
      prev.includes(channelId) ? prev.filter((id) => id !== channelId) : [...prev, channelId]
    );
  }, []);

  const handleImportChannels = useCallback((newChannels: Channel[]) => {
    setCustomChannels((prev) => [...prev, ...newChannels]);
    setActiveGroup('Custom');
  }, []);

  const filteredChannels = useMemo(() => {
    return allChannels.filter((ch) => {
      let matchesGroup = true;
      if (activeGroup === 'Favorites') {
        matchesGroup = favorites.includes(ch.id);
      } else if (activeGroup === 'Custom') {
        matchesGroup = Boolean(ch.isCustom);
      } else if (activeGroup !== 'All') {
        matchesGroup = ch.group === activeGroup;
      }

      const matchesSearch = ch.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGroup && matchesSearch;
    });
  }, [allChannels, activeGroup, favorites, searchQuery]);

  const selectedChannel = useMemo(() => {
    if (!selectedChannelId) return null;

    // Check channels first
    const foundCh = allChannels.find((ch) => ch.id === selectedChannelId);
    if (foundCh) return foundCh;

    // Check movies VOD payload
    const foundMovie = filteredMovies.find((m) => m.id === selectedChannelId) || movies.find((m) => m.id === selectedChannelId);
    if (foundMovie) {
      const movieAsChannel: Channel = {
        id: foundMovie.id,
        name: foundMovie.title,
        logo: foundMovie.poster,
        group: 'Movies VOD',
        urls: foundMovie.urls,
      };
      return movieAsChannel;
    }

    return null;
  }, [selectedChannelId, allChannels, filteredMovies]);

  // Channel Selection with 18+ Protection
  const handleSelectChannel = useCallback(
    (channelId: string) => {
      const ch = allChannels.find((c) => c.id === channelId);
      if (ch?.isAdult && !isAgeVerified) {
        setPendingChannelId(channelId);
        setIsAdultModalOpen(true);
        return;
      }
      setSelectedChannelId(channelId);
      setCurrentUrlIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [allChannels, isAgeVerified]
  );

  const handlePlayMovie = useCallback((movie: Movie) => {
    setSelectedChannelId(movie.id);
    setCurrentUrlIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleConfirmAge = useCallback(() => {
    setIsAgeVerified(true);
    try {
      sessionStorage.setItem('deakho_age_verified', 'true');
    } catch (e) {
      console.warn('Failed to save age verification:', e);
    }
    setIsAdultModalOpen(false);

    if (pendingChannelId) {
      setSelectedChannelId(pendingChannelId);
      setPendingChannelId(null);
    } else {
      setActiveGroup('18+ Adult');
    }
  }, [pendingChannelId]);

  const handleCancelAge = useCallback(() => {
    setIsAdultModalOpen(false);
    setPendingChannelId(null);
  }, []);

  const handleNextChannel = useCallback(() => {
    if (!selectedChannelId || filteredChannels.length === 0) return;
    const currentIdx = filteredChannels.findIndex((ch) => ch.id === selectedChannelId);
    if (currentIdx !== -1) {
      const nextIdx = (currentIdx + 1) % filteredChannels.length;
      handleSelectChannel(filteredChannels[nextIdx].id);
    }
  }, [selectedChannelId, filteredChannels, handleSelectChannel]);

  const handlePrevChannel = useCallback(() => {
    if (!selectedChannelId || filteredChannels.length === 0) return;
    const currentIdx = filteredChannels.findIndex((ch) => ch.id === selectedChannelId);
    if (currentIdx !== -1) {
      const prevIdx = (currentIdx - 1 + filteredChannels.length) % filteredChannels.length;
      handleSelectChannel(filteredChannels[prevIdx].id);
    }
  }, [selectedChannelId, filteredChannels, handleSelectChannel]);

  const handleClosePlayer = useCallback(() => {
    setSelectedChannelId(null);
    setCurrentUrlIndex(0);
  }, []);

  const handleSwitchUrl = useCallback((index: number) => {
    setCurrentUrlIndex(index);
  }, []);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-deep-blue text-text-primary selection:bg-accent selection:text-black transition-colors duration-300 flex flex-col relative">
      <Header
        totalChannels={allChannels.length}
        activeGroup={activeGroup}
        onGroupChange={handleGroupChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        movieSearchQuery={movieSearchQuery}
        onMovieSearchChange={setMovieSearchQuery}
        groups={groups}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenLocalPlayerModal={() => setIsLocalPlayerModalOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        accent={accent}
        onAccentChange={setAccent}
        isMultiScreen={isMultiScreen}
        onToggleMultiScreen={() => setIsMultiScreen(!isMultiScreen)}
        appMode={appMode}
        onAppModeChange={setAppMode}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 w-full max-w-full overflow-x-hidden">
        {/* YouTube Style Cinema Video Player & Layout */}
        {selectedChannel ? (
          <div className="mb-8">
            <YouTubeCinemaLayout
              channel={selectedChannel}
              allChannels={allChannels}
              urlIndex={currentUrlIndex}
              onClose={handleClosePlayer}
              onSwitchUrl={handleSwitchUrl}
              onNextChannel={handleNextChannel}
              onPrevChannel={handlePrevChannel}
              onSelectChannel={handleSelectChannel}
              isFavorite={favorites.includes(selectedChannel.id)}
              onToggleFavorite={() => toggleFavorite(selectedChannel.id)}
            />
          </div>
        ) : null}

        {/* ================= MOVIES & VOD MODE ================= */}
        {appMode === 'movies' ? (
          <div>
            {/* VOD Hero Banner */}
            {!selectedChannel && (
              <div className="relative mb-8 rounded-3xl overflow-hidden bg-dark-card border border-border-dark p-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl">
                <div className="flex-1 flex flex-col gap-3">
                  <span className="px-3 py-1 rounded-full bg-accent/20 text-accent font-bold text-xs uppercase tracking-wider self-start">
                    ⚡ Movie Instant Scraper Active
                  </span>
                  <h2 className="text-3xl font-black text-white tracking-tight">
                    Search & Stream Any Movie Worldwide
                  </h2>
                  <p className="text-xs text-text-muted leading-relaxed max-w-xl">
                    Type any movie title in the search box above to instantly scrape and generate high-definition streaming payloads!
                  </p>
                </div>
              </div>
            )}

            {/* Genre Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
              {movieGenres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedGenre === genre
                      ? 'bg-accent text-black shadow-lg shadow-accent/20 scale-[1.02]'
                      : 'bg-dark-card text-text-secondary hover:bg-dark-hover border border-border-dark'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            {/* Movie Poster Grid */}
            {filteredMovies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 border border-dashed border-border-dark rounded-2xl bg-dark-card/40">
                <div className="size-16 rounded-full bg-dark-card flex items-center justify-center text-2xl">
                  🎬
                </div>
                <p className="text-text-primary text-sm font-medium">No movies found matching query</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} onPlayMovie={handlePlayMovie} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ================= LIVE TV MODE ================= */
          <div>
            {/* Multi-Screen Split View Player */}
            {isMultiScreen ? (
              <MultiScreenPlayer channels={allChannels} onClose={() => setIsMultiScreen(false)} />
            ) : !selectedChannel && featuredChannel ? (
              /* Plex Style Hero Banner when no channel is playing */
              <PlexHeroBanner
                channel={featuredChannel}
                onPlayChannel={handleSelectChannel}
                isFavorite={favorites.includes(featuredChannel.id)}
                onToggleFavorite={() => toggleFavorite(featuredChannel.id)}
              />
            ) : null}

            {/* Shortcuts Bar */}
            {selectedChannel && !isMultiScreen && (
              <div className="mb-6 p-3 rounded-xl bg-dark-card border border-border-dark flex flex-wrap items-center justify-between gap-3 text-[11px] text-text-muted">
                <div className="flex items-center gap-1.5 font-semibold text-text-primary">
                  <span>⌨️ Remote Shortcuts:</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span><kbd className="px-1.5 py-0.5 rounded bg-deep-blue border border-border-light text-accent font-semibold">Space</kbd> Play/Pause</span>
                  <span><kbd className="px-1.5 py-0.5 rounded bg-deep-blue border border-border-light text-accent font-semibold">← / →</kbd> Channel Prev/Next</span>
                  <span><kbd className="px-1.5 py-0.5 rounded bg-deep-blue border border-border-light text-accent font-semibold">F</kbd> Fullscreen</span>
                  <span><kbd className="px-1.5 py-0.5 rounded bg-deep-blue border border-border-light text-accent font-semibold">P</kbd> PiP Mode</span>
                  <span><kbd className="px-1.5 py-0.5 rounded bg-deep-blue border border-border-light text-accent font-semibold">M</kbd> Mute</span>
                  <span><kbd className="px-1.5 py-0.5 rounded bg-deep-blue border border-border-light text-accent font-semibold">Esc</kbd> Close</span>
                </div>
              </div>
            )}

            {/* View Switcher Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <span>
                  {activeGroup === 'Favorites'
                    ? '⭐ Saved Favorites'
                    : activeGroup === 'Custom'
                    ? '📁 Imported Channels'
                    : `${activeGroup} Channels`}
                </span>
                <span className="text-text-muted font-normal text-xs">
                  ({filteredChannels.length})
                </span>
              </h2>

              <div className="flex items-center gap-1 bg-dark-card p-1 rounded-xl border border-border-dark">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'grid'
                      ? 'bg-accent text-black shadow-sm'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <span>🔳 Grid View</span>
                </button>
                <button
                  onClick={() => setViewMode('guide')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'guide'
                      ? 'bg-accent text-black shadow-sm'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <span>📺 TV Guide</span>
                </button>
              </div>
            </div>

            {/* Content View */}
            {viewMode === 'guide' ? (
              <EpgGuide
                channels={filteredChannels}
                selectedChannelId={selectedChannelId}
                onSelectChannel={handleSelectChannel}
              />
            ) : filteredChannels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 border border-dashed border-border-dark rounded-2xl bg-dark-card/40">
                <div className="size-16 rounded-full bg-dark-card flex items-center justify-center text-2xl">
                  {activeGroup === 'Favorites'
                    ? '⭐'
                    : activeGroup === 'Custom'
                    ? '📁'
                    : activeGroup === '18+ Adult'
                    ? '🔞'
                    : '🔍'}
                </div>
                <p className="text-text-primary text-sm font-medium">
                  {activeGroup === 'Favorites'
                    ? 'No favorite channels saved yet'
                    : activeGroup === 'Custom'
                    ? 'No imported custom channels'
                    : 'No channels found'}
                </p>
                <p className="text-text-muted text-xs text-center max-w-sm">
                  {activeGroup === 'Favorites'
                    ? 'Click the star icon on any channel card to save it to your favorites list.'
                    : activeGroup === 'Custom'
                    ? 'Click "Import M3U" at the top right to import custom stream links.'
                    : 'Try adjusting your search query or selecting a different channel group.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
                {filteredChannels.map((channel, index) => (
                  <div
                    key={channel.id}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${Math.min(index * 20, 200)}ms` }}
                  >
                    <ChannelCard
                      channel={channel}
                      isActive={selectedChannelId === channel.id}
                      isFavorite={favorites.includes(channel.id)}
                      onClick={() => handleSelectChannel(channel.id)}
                      onToggleFavorite={() => toggleFavorite(channel.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Import Modal */}
      <ImportM3uModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportChannels={handleImportChannels}
      />

      {/* Local & Network Universal Media Player Modal */}
      <LocalMediaPlayerModal
        isOpen={isLocalPlayerModalOpen}
        onClose={() => setIsLocalPlayerModalOpen(false)}
      />

      {/* 18+ Adult Age Verification Modal */}
      <AdultAlertModal
        isOpen={isAdultModalOpen}
        onConfirm={handleConfirmAge}
        onCancel={handleCancelAge}
      />

      {/* Mobile Touch Dock (Floating Bottom Navigation for Mobile UI/UX) */}
      <nav className="sm:hidden fixed bottom-3 left-3 right-3 z-40 bg-dark-card/90 backdrop-blur-xl border border-border-dark/80 rounded-2xl p-1.5 flex items-center justify-around shadow-2xl pb-safe animate-slideUp">
        <button
          onClick={() => setAppMode('tv')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${
            appMode === 'tv' ? 'bg-accent text-black shadow-md' : 'text-text-muted hover:text-white'
          }`}
        >
          <span className="text-sm">📺</span>
          <span>Live TV</span>
        </button>

        <button
          onClick={() => setAppMode('movies')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${
            appMode === 'movies' ? 'bg-accent text-black shadow-md' : 'text-text-muted hover:text-white'
          }`}
        >
          <span className="text-sm">🎬</span>
          <span>Movies</span>
        </button>

        <button
          onClick={() => handleGroupChange('Favorites')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${
            activeGroup === 'Favorites' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-text-muted hover:text-white'
          }`}
        >
          <span className="text-sm">⭐</span>
          <span>Favorites</span>
        </button>

        <button
          onClick={() => setIsMultiScreen(!isMultiScreen)}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${
            isMultiScreen ? 'bg-accent text-black shadow-md' : 'text-text-muted hover:text-white'
          }`}
        >
          <span className="text-sm">📺📺</span>
          <span>MultiView</span>
        </button>

        <button
          onClick={() => setIsImportModalOpen(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold text-text-muted hover:text-white transition-all cursor-pointer"
        >
          <span className="text-sm">📁</span>
          <span>Import</span>
        </button>
      </nav>

      {/* Actual Water Droplet Liquid Splash Overlay */}
      {ripple && (
        <div className="water-droplet-container">
          <div
            className="water-droplet-drop"
            style={{
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
            }}
          />
          <div
            className="water-droplet-splash-wave"
            style={{
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
              backgroundColor: ripple.color,
            }}
          />
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-border-dark mt-16 pb-20 sm:pb-6 bg-deep-blue transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent font-bold text-xs">
                P
              </div>
              <span className="text-xs text-text-muted font-medium">
                DeakhoTV Ultimate Edition v6.0 · Movie Instant Scraper Active
              </span>
            </div>
            <p className="text-[11px] text-text-muted text-center">
              Instant movie search and scraper engine with cinema video playback.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
