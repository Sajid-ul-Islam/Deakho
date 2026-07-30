import type { Channel } from '../types';

interface EpgGuideProps {
  channels: Channel[];
  selectedChannelId: string | null;
  onSelectChannel: (id: string) => void;
}

const mockPrograms: Record<string, { current: string; next: string; category: string }> = {
  btv: { current: 'National News & Documentary', next: 'Desh O Jonogonn', category: 'News' },
  'deepto-tv': { current: 'Evening Mega Drama Serial', next: 'Deepto Cinema', category: 'Drama' },
  'ekusey-tv': { current: 'Ekusey Barta & Discussion', next: 'Shondhar Songbad', category: 'News' },
  'channel-24': { current: 'Desh 24 Prime News', next: 'Sports 24 Update', category: 'News' },
  'shomoy-tv': { current: 'Somoy Bulletin Live', next: 'Kheladhula News', category: 'News' },
  't-sports': { current: 'Live Cricket / Football Special', next: 'Match Highlights 360', category: 'Sports' },
  'abp-ananda': { current: 'Ananda Khobor Live', next: 'Mahaganta Discussion', category: 'News' },
  '9xm': { current: 'Non-Stop Hits & Beats', next: 'Bollywood Countdown', category: 'Music' },
  'saudi-quran': { current: 'Makkah Live Recitation', next: 'Evening Isha Prayer', category: 'Religious' },
  'wild-earth': { current: 'Safari Live Africa', next: 'Predators of Seronera', category: 'Documentary' },
};

export default function EpgGuide({ channels, selectedChannelId, onSelectChannel }: EpgGuideProps) {
  return (
    <div className="w-full bg-dark-card border border-border-dark rounded-2xl overflow-hidden shadow-xl mb-8">
      {/* EPG Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-dark bg-deep-blue/60">
        <div className="flex items-center gap-2">
          <span className="text-accent font-bold text-base">📺 Live TV Guide</span>
          <span className="text-text-muted text-xs">· On Now & Schedule</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-accent animate-pulse" />
            Live Now (16:00 - 17:00)
          </span>
          <span className="hidden sm:inline">Up Next (17:00+)</span>
        </div>
      </div>

      {/* Channel Rows */}
      <div className="divide-y divide-border-dark/60 max-h-[500px] overflow-y-auto">
        {channels.map((ch) => {
          const info = mockPrograms[ch.id] || {
            current: `${ch.name} Live Stream`,
            next: `${ch.name} Prime Time`,
            category: ch.group,
          };
          const isSelected = selectedChannelId === ch.id;

          return (
            <div
              key={ch.id}
              onClick={() => onSelectChannel(ch.id)}
              className={`flex items-center justify-between p-3.5 sm:px-6 hover:bg-dark-hover transition-colors cursor-pointer group ${
                isSelected ? 'bg-accent/10 border-l-4 border-accent' : ''
              }`}
            >
              {/* Channel logo & title */}
              <div className="flex items-center gap-3 w-48 sm:w-60 shrink-0">
                <div className="size-10 rounded-xl bg-black/50 p-1.5 flex items-center justify-center border border-white/10 shrink-0">
                  <img
                    src={ch.logo}
                    alt=""
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-accent transition-colors">
                    {ch.name}
                  </h4>
                  <p className="text-[10px] text-text-muted">{ch.group}</p>
                </div>
              </div>

              {/* On Now Program details */}
              <div className="flex-1 min-w-0 px-4">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-accent/20 text-accent text-[9px] font-bold">
                    {info.category}
                  </span>
                  <p className="text-xs font-semibold text-text-primary truncate">
                    {info.current}
                  </p>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-deep-blue h-1 rounded-full overflow-hidden mt-1.5 border border-white/5">
                  <div className="bg-accent h-full w-[65%] rounded-full" />
                </div>
              </div>

              {/* Up Next */}
              <div className="hidden md:block w-48 shrink-0 text-right">
                <p className="text-[10px] text-text-muted">UP NEXT</p>
                <p className="text-xs text-text-secondary truncate">{info.next}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
