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

  async fetchArtistIDs(artists: Artist[]): Promise<ConcertArtist[]> {
    let artistIds: ConcertArtist[] = [];
    let artistsNotFound: string[] = [];
    // const concertInfoPromises = artists.map(async (artist) => {
    //   return await axios
    //     .get(
    //       `https://api.songkick.com/api/3.0/search/artists.json?apikey=${process.env.REACT_APP_SONGKICK_API_KEY}&query=${artist.name}`,
    //       {
    //         headers: {
    //           artistName: artist.name,
    //         },
    //       }
    //     )
    //     .catch(() => {
    //       artistsNotFound.push(artist.name);
    //     });
    // });

    artists.map((artist) => {
      axios
        .get(
          `https://api.songkick.com/api/3.0/search/artists.json?apikey=${process.env.REACT_APP_SONGKICK_API_KEY}&query=${artist.name}`
        )
        .then((response: AxiosResponse) => {
          console.log(response.data.resultsPage.results.artist[0].id);
        })
        .catch(() => console.log(`skipped ${artist.name}`));
    });

    // const responses: AxiosResponse[] = (await Promise.all(
    //   concertInfoPromises
    // )) as AxiosResponse[];

    // const artistInfo = responses.map((response) => {
    //   return this.extractArtistInfo(response);
    // });

    // console.log(artistInfo);

    // for (let artist of artists) {
    //   let artistInfoEndpoint = `https://api.songkick.com/api/3.0/search/artists.json?apikey=${process.env.REACT_APP_SONGKICK_API_KEY}&query=${artist.name}`;
    //   await axios
    //     .get(artistInfoEndpoint)
    //     .then((response: AxiosResponse) => {
    //       const artistId: songKickArtistResponse =
    //         response.data.resultsPage.results.artist[0].id;
    //       artistIds.push({
    //         name: artist.name,
    //         id: `${artistId}`,
    //       });
    //     })
    //     .catch((error: AxiosError) => {
    //       artistsNotFound.push(artist.name);
    //     });
    // }
    // console.log('artist IDs: ');
    // console.log(artistIds);
    // console.log('artists not found: ');
    // console.log(artistsNotFound);
    return artistIds;
  }

  private extractArtistInfo(response: AxiosResponse): ConcertArtist | null {
    try {
      const artistName = response.headers.artistName;
      const artistId: songKickArtistResponse =
        response.data.resultsPage.results.artist[0].id;
      return {
        name: artistName,
        id: `${artistId}`,
      };
    } catch {
      console.log(`skipped`);
      return null;
    }
  }
}
