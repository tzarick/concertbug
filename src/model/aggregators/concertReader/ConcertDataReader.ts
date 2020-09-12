import { Artist } from '../../artists/Artist';

export interface rawConcertObj {
  concertArtistInfo: ConcertArtist;
  concertResponse: {
    // todo
  };
}
export interface ConcertArtist {
  name: string;
  id: string; // id specific to concert service api
}

export abstract class ConcertDataReader {
  abstract async fetchConcertData(
    artistNames: Artist[]
  ): Promise<rawConcertObj[]>;
  abstract async fetchArtistIDs(
    artistNames: Artist[]
  ): Promise<ConcertArtist[]>;
}
