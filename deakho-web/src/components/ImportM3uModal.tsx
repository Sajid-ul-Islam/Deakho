import { useState } from 'react';
import type { Channel } from '../types';

interface ImportM3uModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportChannels: (newChannels: Channel[]) => void;
}

export default function ImportM3uModal({
  isOpen,
  onClose,
  onImportChannels,
}: ImportM3uModalProps) {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [rawText, setRawText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'url' | 'file' | 'text'>('url');

  if (!isOpen) return null;

  const parseM3uContent = (content: string): Channel[] => {
    const lines = content.split(/\r?\n/);
    const parsedChannels: Channel[] = [];
    let currentName = '';
    let currentLogo = '';
    let currentGroup = 'Custom';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('#EXTINF:')) {
        // Parse logo
        const logoMatch = line.match(/tvg-logo="([^"]+)"/i);
        currentLogo = logoMatch ? logoMatch[1] : '';

        // Parse group
        const groupMatch = line.match(/group-title="([^"]+)"/i);
        currentGroup = groupMatch ? groupMatch[1] : 'Custom';

        // Parse name
        const commaIdx = line.indexOf(',');
        currentName = commaIdx !== -1 ? line.substring(commaIdx + 1).trim() : 'Custom Channel';
      } else if (line && !line.startsWith('#')) {
        if (currentName || line.includes('://')) {
          const channelId = `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
          parsedChannels.push({
            id: channelId,
            name: currentName || 'Custom Channel',
            logo: currentLogo || 'https://i.imgur.com/LwP634U.png',
            group: currentGroup,
            isCustom: true,
            urls: [{ url: line, label: 'Primary' }],
          });
          currentName = '';
          currentLogo = '';
          currentGroup = 'Custom';
        }
      }
    }

    return parsedChannels;
  };

  const handleFetchUrl = async () => {
    if (!playlistUrl.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(playlistUrl);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const text = await res.text();
      const channels = parseM3uContent(text);
      if (channels.length === 0) {
        setError('No valid streams found in this M3U file.');
      } else {
        onImportChannels(channels);
        onClose();
      }
    } catch (e: any) {
      setError(
        `Failed to fetch M3U playlist (${e.message || 'CORS or Network issue'}). Try pasting raw text or uploading the file.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        const channels = parseM3uContent(text);
        if (channels.length === 0) {
          setError('No valid streams found in file.');
        } else {
          onImportChannels(channels);
          onClose();
        }
      }
    };
    reader.readAsText(file);
  };

  const handleTextImport = () => {
    if (!rawText.trim()) return;
    const channels = parseM3uContent(rawText);
    if (channels.length === 0) {
      setError('No valid channels found in text.');
    } else {
      onImportChannels(channels);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-dark-card border border-border-dark rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-dark">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h2 className="text-white font-bold text-base">Import M3U Playlist</h2>
              <p className="text-text-muted text-xs">Add custom channels to your player</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-full bg-dark-hover hover:bg-border-light flex items-center justify-center text-text-muted hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border-dark bg-deep-blue/40 px-6">
          <button
            onClick={() => setActiveTab('url')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'url'
                ? 'border-accent text-accent'
                : 'border-transparent text-text-muted hover:text-white'
            }`}
          >
            Playlist URL
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'file'
                ? 'border-accent text-accent'
                : 'border-transparent text-text-muted hover:text-white'
            }`}
          >
            Upload .M3U File
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'text'
                ? 'border-accent text-accent'
                : 'border-transparent text-text-muted hover:text-white'
            }`}
          >
            Paste Raw Text
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {error}
            </div>
          )}

          {activeTab === 'url' && (
            <div className="flex flex-col gap-3">
              <label className="text-xs font-medium text-text-primary">M3U or M3U8 Web URL:</label>
              <input
                type="url"
                placeholder="https://example.com/playlist.m3u"
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-deep-blue border border-border-dark text-xs text-white placeholder-text-muted focus:outline-none focus:border-accent/50"
              />
              <button
                onClick={handleFetchUrl}
                disabled={isLoading || !playlistUrl.trim()}
                className="w-full py-2.5 rounded-xl bg-accent hover:bg-accent-light disabled:opacity-50 text-black font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <div className="size-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                )}
                <span>Fetch & Import Playlist</span>
              </button>
            </div>
          )}

          {activeTab === 'file' && (
            <div className="flex flex-col gap-3">
              <label className="text-xs font-medium text-text-primary">Select local .m3u or .m3u8 file:</label>
              <div className="border-2 border-dashed border-border-dark hover:border-accent/50 rounded-xl p-6 text-center bg-deep-blue/30 transition-colors">
                <input
                  type="file"
                  accept=".m3u,.m3u8,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="m3u-file-input"
                />
                <label
                  htmlFor="m3u-file-input"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <div className="size-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    📂
                  </div>
                  <span className="text-xs font-medium text-white">Click to browse M3U file</span>
                  <span className="text-[11px] text-text-muted">Supports .m3u, .m3u8 formats</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'text' && (
            <div className="flex flex-col gap-3">
              <label className="text-xs font-medium text-text-primary">Paste M3U content directly:</label>
              <textarea
                rows={6}
                placeholder="#EXTM3U&#10;#EXTINF:-1,Sample Channel&#10;https://example.com/stream.m3u8"
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full p-3 rounded-xl bg-deep-blue border border-border-dark text-xs font-mono text-white placeholder-text-muted focus:outline-none focus:border-accent/50"
              />
              <button
                onClick={handleTextImport}
                disabled={!rawText.trim()}
                className="w-full py-2.5 rounded-xl bg-accent hover:bg-accent-light disabled:opacity-50 text-black font-bold text-xs transition-colors cursor-pointer"
              >
                Import Raw Content
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
