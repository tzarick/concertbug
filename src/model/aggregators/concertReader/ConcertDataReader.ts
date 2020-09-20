import { Artist } from '../../artists/Artist';

export interface RawConcertObj {
  concertArtistInfo: ConcertArtist;
  concertInfo: ConcertInfo[];
}

export interface ConcertInfo {
  title: string;
  uri: string;
  type: string; // Concert or Festival
  date: Date | null;
  venue: {
    name: string;
    lat: number;
    lng: number;
  };
  bill: string[]; // any other artists on the same show
}

export interface ConcertArtist {
  name: string;
  streamingServiceId: string; // id specific to streaming service api
  concertServiceId: string; // id specific to concert service api
  previewUri: string | null;
}

export abstract class ConcertDataReader {
  abstract async fetchConcertData(
    artistNames: Artist[]
  ): Promise<RawConcertObj[]>;
  // abstract async fetchArtistIDs(
  //   artistNames: Artist[]
  // ): Promise<ConcertArtist[]>;
}
