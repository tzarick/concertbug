export interface SongKickResponse {
  resultsPage: {
    results: {
      event: SongKickEvent[];
      artist: SongKickArtist;
    };
    totalEntries: number;
    perPage: number;
    page: number;
  };
}

export interface SongKickEvent {
  id: number;
  type: string;
  uri: string;
  displayName: string;
  start: {
    time: string;
    date: string;
    datetime: string;
  };
  performance: {
    artist: {
      displayName: string;
    };
    displayName: string;
    billingIndex: number;
  }[];
  location: {
    city: string;
    lat: number;
    lng: number;
  };
  venue: {
    displayName: string;
    lat: number;
    lng: number;
  };
}

interface SongKickArtist {
  id: number;
}
