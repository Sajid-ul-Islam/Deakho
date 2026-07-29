import { useState } from 'react';
import type { Channel } from '../types';
import VideoPlayer from './VideoPlayer';

interface MultiScreenPlayerProps {
  channels: Channel[];
  onClose: () => void;
}

export default function MultiScreenPlayer({ channels, onClose }: MultiScreenPlayerProps) {
  const [screenCount, setScreenCount] = useState<2 | 4>(2);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(() => {
    return [
      channels[0]?.id || '',
      channels[1]?.id || '',
      channels[2]?.id || '',
      channels[3]?.id || '',
    ];
  });

  const [activeUrlIndices, setActiveUrlIndices] = useState<number[]>([0, 0, 0, 0]);

  const handleSelectChannelForSlot = (slotIdx: number, channelId: string) => {
    setSelectedChannels((prev) => {
      const updated = [...prev];
      updated[slotIdx] = channelId;
      return updated;
    });
    setActiveUrlIndices((prev) => {
      const updated = [...prev];
      updated[slotIdx] = 0;
      return updated;
    });
  };

  const handleSwitchUrlForSlot = (slotIdx: number, urlIndex: number) => {
    setActiveUrlIndices((prev) => {
      const updated = [...prev];
      updated[slotIdx] = urlIndex;
      return updated;
    });
  };

  return (
    <div className="w-full bg-dark-card border border-border-dark rounded-2xl overflow-hidden shadow-2xl p-4 mb-8 animate-slideUp">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-border-dark">
        <div className="flex items-center gap-2">
          <span className="text-base font-extrabold text-white flex items-center gap-2">
            <span>📺 Multi-Screen Split View</span>
            <span className="px-2 py-0.5 rounded bg-accent/20 text-accent text-[10px] uppercase tracking-wider">
              {screenCount} Screens Active
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switcher Pills */}
          <div className="flex items-center gap-1 bg-deep-blue p-1 rounded-xl border border-border-dark">
            <button
              onClick={() => setScreenCount(2)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                screenCount === 2
                  ? 'bg-accent text-black shadow-sm'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              Dual Screen (2x1)
            </button>
            <button
              onClick={() => setScreenCount(4)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                screenCount === 4
                  ? 'bg-accent text-black shadow-sm'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              Quad Screen (2x2)
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="size-8 rounded-full bg-deep-blue hover:bg-dark-hover flex items-center justify-center text-text-muted hover:text-white transition-colors cursor-pointer"
            title="Exit Multi-Screen Mode"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Screen Grid */}
      <div
        className={`grid gap-3 ${
          screenCount === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'
        }`}
      >
        {Array.from({ length: screenCount }).map((_, slotIdx) => {
          const chId = selectedChannels[slotIdx];
          const channelObj = channels.find((c) => c.id === chId) || channels[slotIdx];

          return (
            <div
              key={slotIdx}
              className="flex flex-col gap-2 bg-deep-blue/60 p-2.5 rounded-xl border border-border-dark/80"
            >
              {/* Channel Selector Dropdown for Slot */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent shrink-0">
                  Screen #{slotIdx + 1}
                </span>
                <select
                  value={channelObj?.id || ''}
                  onChange={(e) => handleSelectChannelForSlot(slotIdx, e.target.value)}
                  className="w-full text-xs font-semibold bg-dark-card border border-border-dark text-white rounded-lg px-2.5 py-1 focus:outline-none focus:border-accent"
                >
                  {channels.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.name} ({ch.group})
                    </option>
                  ))}
                </select>
              </div>

              {/* Slot Video Player */}
              {channelObj && (
                <div className="w-full">
                  <VideoPlayer
                    channel={channelObj}
                    urlIndex={activeUrlIndices[slotIdx] || 0}
                    onClose={() => {}}
                    onSwitchUrl={(uIdx) => handleSwitchUrlForSlot(slotIdx, uIdx)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
