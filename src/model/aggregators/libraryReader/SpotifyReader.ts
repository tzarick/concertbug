import { MusicLibraryReader, artistInfo } from './MusicLibraryReader';
import { hashParamsExist, getHashParams } from '../../utils';
import axios, { AxiosResponse } from 'axios';
import lodash from 'lodash';

const _ = lodash;

interface spotifyTrackObject {
  track: {
    artists: [
      {
        name: string;
        id: string;
      }
    ];
  };
}

const savedTracksEndpoint = 'https://api.spotify.com/v1/me/tracks?limit=50';

export class SpotifyReader extends MusicLibraryReader {
  private redirectUri = 'http://localhost:3000/'; // TODO: change this to real prod URL
  private token = '';
  private artists: artistInfo[] = [];
  authorizeUrl = '';

  constructor() {
    super();
    this.getToken(); // this is for when we come back to home after authentication - otherwise, do nothing
  }

  authenticate(): boolean {
    const stateKey = this.generateRandomString(16);
    const scope = 'user-library-read playlist-read-private user-top-read'; // add more scopes here if needed
    const spotifyAuthUrl = 'https://accounts.spotify.com/authorize';

    this.authorizeUrl = this.buildFullUrl(spotifyAuthUrl, [
      { response_type: 'token' },
      { client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID as string },
      { scope: scope },
      { redirect_uri: this.redirectUri },
      { state: stateKey },
      { show_dialog: 'true' }, // this is nice to have for testing to verify it works, not necessary for prod
      { service: 'spotify' },
    ]);

    return true;
  }

  async fetchArtists(): Promise<artistInfo[]> {
    const savedTracksArtists = await this.fetchSavedTracksArtists();
    return savedTracksArtists;
  }

  async getPreviewUri(artistId: string): Promise<string | null> {
    const topTracksEnpoint = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`;
    var uri: string | null = null;
    await axios
      .get(topTracksEnpoint, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then((response: AxiosResponse): void => {
        uri = response.data.uri;
      });

    return uri;
  }

  private getToken(): void {
    if (hashParamsExist()) this.token = getHashParams().access_token;
  }

  private async fetchSavedTracksArtistsBatch(
    url: string
  ): Promise<string | null> {
    // var trackArtistsArray: string[] = [];
    var next: string | null = null; // if null, no more tracks in lib -> can stop
    await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then((response: AxiosResponse): void => {
        next = response.data.next;

        const artists: artistInfo[] = response.data.items
          .map((item: spotifyTrackObject) =>
            item.track.artists.map(
              (artist): artistInfo => {
                return { name: artist.name, id: artist.id };
              }
            )
          ) // grab all artists on each track
          .reduce(
            (array: artistInfo[], item: artistInfo[]) => [...array, ...item],
            []
          ); // collapse nested arrays

        artists.forEach((artist: artistInfo) => {
          // add only unique artists
          if (this.artists.findIndex((item) => item.id === artist.id) === -1) {
            this.artists.push(artist);
          }
        });

        // const trackArtistsSet = new Set<artistInfo>([
        //   ...this.artists,
        //   ...artists,
        // ]); // combine + no duplicates

        // this.artists = [...trackArtistsSet]; // back to an array with no duplicates
      })
      .catch((e) => {
        window.alert(
          'This Spotify connection is a bit weak..\n\nIt might be us but.. Try logging in with your streaming service again to make sure :)'
        );
      });

    return next; // next url endpoint of next batch (max limit per call is 50)
  }

  private async fetchSavedTracksArtists(): Promise<artistInfo[]> {
    const totalTracks = await this.getTotalTrackCount();
    const endpoints = this.generateSavedTracksEndpoints(totalTracks);

    // all batches at once
    const savedTrackBatchPromises = endpoints.map(async (endpoint) => {
      return await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
    });

    const responses: AxiosResponse[] = await Promise.all(
      savedTrackBatchPromises
    ); // all responses at once
    const artistBatches = responses.map((response: AxiosResponse) =>
      this.getArtistsFromTracksBatch(response)
    );

    const artists = _.flatten(artistBatches);

    artists.forEach((artist: artistInfo) => {
      // add only unique artists
      if (this.artists.findIndex((item) => item.id === artist.id) === -1) {
        this.artists.push(artist);
      }
    });

    // var nextEndpointUrl = await this.fetchSavedTracksArtistsBatch(
    //   savedTracksEndpoint
    // );
    // while (nextEndpointUrl !== null) {
    //   nextEndpointUrl = await this.fetchSavedTracksArtistsBatch(
    //     nextEndpointUrl
    //   );
    // }

    return this.artists;
  }

  private getArtistsFromTracksBatch(tracksBatch: AxiosResponse) {
    const artists: artistInfo[] = tracksBatch.data.items.map(
      (item: spotifyTrackObject) =>
        item.track.artists.map(
          (artist): artistInfo => {
            return { name: artist.name, id: artist.id };
          }
        )
    ); // grab all artists on each track

    return _.flatten(artists);
  }

  private requestTracksBatch(offset: number, limit: number) {
    return axios.get(
      `https://api.spotify.com/v1/me/tracks?offset=${offset}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // total tracks in "Saved Songs" list
  private async getTotalTrackCount(): Promise<number> {
    try {
      const response: AxiosResponse = await axios.get(savedTracksEndpoint, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const {
        data: { total },
      } = response;
      console.log(`Total tracks in \"Saved Tracks\": ${total}`);

      return total;
    } catch {
      window.alert(
        'This Spotify connection is a bit weak..\n\nIt might be us but.. Try logging in with your streaming service again to make sure :)'
      );
    }

    return 0;
  }

  // get an enpoint for each paginated response based on the library size. Limit per call = 50.
  // So that we can expedite this fetch process in parallel if there are lots of songs in a lib (like mine..)
  private generateSavedTracksEndpoints(trackCount: number): string[] {
    const limitPerResponse = 50;
    const numberOfCallsNeeded = Math.ceil(trackCount / limitPerResponse);

    let endpoints: string[] = [];
    for (let i = 0; i < numberOfCallsNeeded; i++) {
      endpoints.push(
        `https://api.spotify.com/v1/me/tracks?offset=${
          i * limitPerResponse
        }&limit=${limitPerResponse}`
      );
    }
    // let offsets: number[] = [];
    // for (let i = 0; i < numberOfCallsNeeded; i++) {
    //   offsets.push(i * limitPerResponse);
    // }

    return endpoints;
  }

  // for Spotify "state" param - for security
  private generateRandomString(length: number) {
    let text = '';
    const possibleChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possibleChars.charAt(
        Math.floor(Math.random() * possibleChars.length)
      );
    }

    return text;
  }

  static spotifyUserIsLoggedIn(): boolean {
    return (
      hashParamsExist() &&
      Object.keys(getHashParams()).includes(
        'access_token'
      ) /* && spotifyTestApiCallWorks() */
    );
  }
}
