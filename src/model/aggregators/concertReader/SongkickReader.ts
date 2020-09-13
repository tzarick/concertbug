import {
  ConcertDataReader,
  RawConcertObj,
  ConcertArtist,
  ConcertInfo,
} from './ConcertDataReader';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { Artist } from '../../artists/Artist';
import { SongKickResponse, SongKickEvent } from './songKickTypes';
import lodash from 'lodash';

const _ = lodash;

export class SongkickReader extends ConcertDataReader {
  private artistsNotFound: string[] = [];
  async fetchConcertData(artists: Artist[]): Promise<RawConcertObj[]> {
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

    // get next pages of responses if necessary
    let allResponses: RawConcertObj[] = [];
    for (let i = 0; i < responses.length; i++) {
      const allPages = await this.getAllPages(
        responses[i].data,
        artists[i].name
      );

      allResponses.push(
        this.condenseAndExtractRelevantConcertInfo(allPages, artists[i].name)
      );
      // allResponses.push(allPages);
    }

    // console.log(allResponses);

    // get rid of artists without upcoming shows
    const concertInfo = allResponses.filter(
      (item) => item.concertInfo.length > 0
    );
    console.log(concertInfo);
    // const allResponsesClean =
    //   .map((item) => item.resultsPage.results)
    //   .filter((item) => item.event);

    // console.log(allResponsesClean);

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

  private condenseAndExtractRelevantConcertInfo(
    paginatedInfo: SongKickResponse[],
    artistName: string
  ): RawConcertObj {
    const concertChunks: ConcertInfo[][] = paginatedInfo.map(
      (page: SongKickResponse) => {
        const eventArray = page.resultsPage.results.event;
        let concertInfo: ConcertInfo[] = [];

        if (eventArray) {
          concertInfo = eventArray.map((event) =>
            this.buildConcertInfoObj(event, artistName)
          );
        }

        return concertInfo;
      }
    );

    return {
      concertArtistInfo: {
        name: artistName,
        id: '', // don't know yet
      },
      concertInfo: _.flatten(concertChunks),
    };
  }

  private buildConcertInfoObj(
    event: SongKickEvent,
    artistName: string
  ): ConcertInfo {
    const bill =
      event.performance.length > 0
        ? event.performance
            .map((item) => item.displayName)
            .filter((item) => item !== artistName)
        : [];

    return {
      title: event.displayName,
      uri: event.uri,
      type: event.type,
      date: new Date(event.start.datetime),
      venue: {
        name: event.venue ? event.venue.displayName : 'Unknown Venue',
        lat: event.venue ? event.venue.lat : -1,
        lng: event.venue ? event.venue.lng : -1,
      },
      bill: bill,
    };
  }

  // if there are more results for this artist, get them
  private async getAllPages(
    data: SongKickResponse,
    artistName: string
  ): Promise<SongKickResponse[]> {
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

    if (this.artistsNotFound.length > 0) {
      console.log('Unable to find on SongKick: ');
      console.log(this.artistsNotFound);
    }

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
      const artistId = response.data.resultsPage.results.artist[0].id;
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
