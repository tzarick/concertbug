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
  abstract fetchConcertData(artistNames: Artist[]): rawConcertObj[];
  abstract async fetchArtistIDs(
    artistNames: Artist[]
  ): Promise<ConcertArtist[]>;
}
