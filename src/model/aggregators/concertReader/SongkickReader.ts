import {
  ConcertDataReader,
  rawConcertObj,
  ConcertArtist,
} from './ConcertDataReader';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { Artist } from '../../artists/Artist';
import lodash from 'lodash';

const _ = lodash;

interface songKickArtistResponse {
  resultsPage: {
    results: {
      event: [];
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
  private artistsNotFound: string[] = [];
  async fetchConcertData(artists: Artist[]): Promise<rawConcertObj[]> {
    const concertDataPromises = artists.map((artist) => {
      let concertDataEndpoint = `https://api.songkick.com/api/3.0/events.json?apikey=U6EzuX5YFdieotzL&artist_name=${encodeURIComponent(
        artist.name
      )}`;
      return axios.get(concertDataEndpoint);
    });

    const responses: AxiosResponse[] = await Promise.all(concertDataPromises);
    // console.log(responses);
    // const allResponses = responses.map(
    //   async (response, i) =>
    //     await this.getAllPages(response.data, artists[i].name)
    // );

    let allResponses: songKickArtistResponse[][] = [];
    for (let i = 0; i < responses.length; i++) {
      const allPages = await this.getAllPages(
        responses[i].data,
        artists[i].name
      );
      allResponses.push(allPages);
    }

    const allResponsesClean = _.flatten(allResponses)
      .map((item) => item.resultsPage.results)
      .filter((item) => item.event);
    console.log(allResponsesClean);
    // const all = await Promise.all(responses);
    // console.log(all);

    // const concertInfo = responses.map((response, i) => {
    //   console.log(artists[i]);
    //   return response;
    // });
    // .filter((info) => info.totalEntries > info.perPage);
    // const concertsRaw = responses.map((concert) => concert.data);

    // console.log(concertsRaw);
    return [];
  }

  // if there are more results for this artist, get them
  private async getAllPages(
    data: songKickArtistResponse,
    artistName: string
  ): Promise<songKickArtistResponse[]> {
    const {
      resultsPage: { totalEntries, perPage },
    } = data;
    let results = [data]; // start with 1 object, the one we've already received

    // if more pages of data exist
    if (totalEntries > perPage) {
      const totalPages = Math.ceil(totalEntries / perPage);
      for (let i = 2; i < totalPages; i++) {
        const response = await axios.get(
          `https://api.songkick.com/api/3.0/events.json?apikey=U6EzuX5YFdieotzL&artist_name=${encodeURIComponent(
            artistName
          )}&page=${i}`
        );
        results.push(response.data);
      }
    }
    return results;
  }

  async fetchArtistIDs(artists: Artist[]): Promise<ConcertArtist[]> {
    // let info: ConcertArtist[] = [];

    const concertInfoPromises = artists.map((artist) => {
      return axios.get(
        `https://api.songkick.com/api/3.0/search/artists.json?apikey=${process.env.REACT_APP_SONGKICK_API_KEY}&query=${artist.name}`,
        {
          params: {
            artistName: artist.name,
          },
        }
      );
    });

    // artists.map((artist) => {
    //   axios
    //     .get(
    //       `https://api.songkick.com/api/3.0/search/artists.json?apikey=${process.env.REACT_APP_SONGKICK_API_KEY}&query=${artist.name}`
    //     )
    //     .then((response: AxiosResponse) => {
    //       console.log(response.data.resultsPage.results.artist[0].id);
    //     })
    //     .catch(() => console.log(`skipped ${artist.name}`));
    // });

    const responses: AxiosResponse[] = await Promise.all(concertInfoPromises);

    const artistInfo = responses.map((response) => {
      return this.extractArtistInfo(response);
    });

    const info = artistInfo.filter((item) => item) as ConcertArtist[]; // remove null
    console.log('Unable to find on SongKick: ');
    console.log(this.artistsNotFound);

    console.log(info);
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
    return info;
  }

  private extractArtistInfo(response: AxiosResponse): ConcertArtist | null {
    const artistName = response.config.params.artistName;
    try {
      const artistId: songKickArtistResponse =
        response.data.resultsPage.results.artist[0].id;
      return {
        name: artistName,
        id: `${artistId}`,
      };
    } catch {
      this.artistsNotFound.push(artistName);
      return null;
    }
  }
}
