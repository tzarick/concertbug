import {
  ConcertDataReader,
  rawConcertObj,
  ConcertArtist,
} from './ConcertDataReader';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { Artist } from '../../artists/Artist';

interface songKickArtistResponse extends AxiosResponse {
  resultsPage: {
    results: {
      artist: [
        {
          id: number; // songkick id
        }
      ];
    };
    totalEntries: number;
    perPage: number;
    page: number;
  };
}

export class SongkickReader extends ConcertDataReader {
  fetchConcertData(artistNames: Artist[]): rawConcertObj[] {
    return [];
  }

  async fetchArtistIDs(artistNames: Artist[]): Promise<ConcertArtist[]> {
    let artistIds: ConcertArtist[] = [];
    let artistsNotFound: string[] = [];
    for (let artist of artistNames) {
      let artistInfoEndpoint = `https://api.songkick.com/api/3.0/search/artists.json?apikey=${process.env.REACT_APP_SONGKICK_API_KEY}&query=${artist.name}`;
      await axios
        .get(artistInfoEndpoint)
        .then((response: AxiosResponse) => {
          const artistId: songKickArtistResponse =
            response.data.resultsPage.results.artist[0].id;
          artistIds.push({
            name: artist.name,
            id: `${artistId}`,
          });
        })
        .catch((error: AxiosError) => {
          artistsNotFound.push(artist.name);
        });
    }
    console.log('artist IDs: ');
    console.log(artistIds);
    console.log('artists not found: ');
    console.log(artistsNotFound);
    return artistIds;
  }
}
