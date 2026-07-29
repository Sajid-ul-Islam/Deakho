export interface Channel {
  id: string;
  name: string;
  logo: string;
  group: string;
  urls: ChannelUrl[];
  needsHeaders?: boolean;
  needsProxy?: boolean;
  isFavorite?: boolean;
  isCustom?: boolean;
  isAdult?: boolean;
}

export interface ChannelUrl {
  url: string;
  label: string;
  needsHeaders?: boolean;
  needsProxy?: boolean;
}

export interface PlayerState {
  channel: Channel | null;
  urlIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop?: string;
  year: number;
  rating: string;
  genre: string;
  duration: string;
  description: string;
  urls: ChannelUrl[];
  isFavorite?: boolean;
}

