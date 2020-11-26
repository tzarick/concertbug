import { MusicLibraryReader, artistInfo } from './MusicLibraryReader';
import { hashParamsExist, getHashParams } from '../../utils';
import axios, { AxiosResponse } from 'axios';
import {
  SpotifyTopTracksObject,
  SpotifyTrackObject,
  SpotifyTopArtistsObject,
  SpotifyPlaylistsObject,
  SpotifyUserDetailsObject,
  SpotifyPlaylistTracksObject,
} from './spotifyTypes';
import lodash from 'lodash';

const _ = lodash;

const savedTracksEndpoint = 'https://api.spotify.com/v1/me/tracks?limit=50';
const topArtistsEndpoint = 'https://api.spotify.com/v1/me/top/artists';

export class SpotifyReader extends MusicLibraryReader {
  private redirectUri = process.env.REACT_APP_BASE_URL as string;
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
    const playlistArtists = await this.fetchPlaylistArtists();
    this.mergeArtists(playlistArtists); // merge playlist artists into existing list of artists, avoiding duplicates

    return this.artists;
  }

  async getPreviewUri(artistId: string): Promise<string | null> {
    const topTracksEnpoint = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`;
    var uri: string | null = null;
    return await axios.get(topTracksEnpoint, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    // .then((response: AxiosResponse): void => {
    //   uri = response.data.uri;
    // });

    return uri;
  }

  private async addPreviewUris(artists: artistInfo[]): Promise<artistInfo[]> {
    const previewPromises = artists.map((artist) => {
      const topTracksEnpoint = `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?country=US`;

      return axios.get(topTracksEnpoint, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
    });

    const previewUriResponses: AxiosResponse[] = await Promise.all(
      previewPromises
    );

    for (let i = 0; i < artists.length; i++) {
      const response: SpotifyTopTracksObject = previewUriResponses[i].data;
      artists[i].previewUri = response.tracks[0].uri;
    }

    return artists;
  }

  private getToken(): void {
    if (hashParamsExist()) this.token = getHashParams().access_token;
  }

  private async fetchSavedTracksArtists(): Promise<artistInfo[]> {
    const totalTracks = await this.getTotalTrackCount();
    const endpoints = this.generateEndpoints(
      'https://api.spotify.com/v1/me/tracks',
      totalTracks,
      50
    );

    // all batches at once
    const savedTrackBatchPromises = endpoints.map((endpoint) => {
      return axios.get(endpoint, {
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

    this.mergeArtists(artists);

    return this.artists;
  }

  private mergeArtists(artistsToMerge: artistInfo[]): void {
    artistsToMerge.forEach((artist: artistInfo) => {
      // add only unique artists
      if (
        this.artists.findIndex((item) => item.id === artist.id) === -1 &&
        artist.name
      ) {
        this.artists.push(artist);
      }
    });
  }

  private getArtistsFromTracksBatch(tracksBatch: AxiosResponse) {
    const artists: artistInfo[] = tracksBatch.data.items.map(
      (item: SpotifyTrackObject) =>
        item.track.artists.map(
          (artist): artistInfo => {
            return { name: artist.name, id: artist.id, previewUri: null };
          }
        )
    ); // grab all artists on each track

    return _.flatten(artists);
  }

  private async fetchPlaylistArtists(): Promise<artistInfo[]> {
    const playlistIds = await this.getPlaylistIds();
    const playlistArtists = await this.getAllPlaylistArtists(playlistIds);
    return playlistArtists;
  }

  private async getPlaylistIds(): Promise<string[]> {
    const userId = await this.getUserId(); // Spotify user ID so we can identify who created the playlist

    const playlistsEndpoint = 'https://api.spotify.com/v1/me/playlists';
    const playlistCount = await this.getPlaylistCount(playlistsEndpoint);

    const playlistEndpoints = this.generateEndpoints(
      playlistsEndpoint,
      playlistCount,
      50
    ); // we might need a batch of endpoints, if the user has over 50 playlists - need to make multiple simultaneous calls - paginated

    // all batches at once
    const playlistBatchPromises = playlistEndpoints.map((endpoint) => {
      return axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
    });

    const responses: AxiosResponse[] = await Promise.all(playlistBatchPromises); // all responses at once
    const playlistBatchIds = responses.map((response: AxiosResponse) => {
      const data: SpotifyPlaylistsObject = response.data;

      return data.items
        .filter(
          (item) =>
            item.owner.id === userId && // only include playlists made by the current user
            !item.collaborative && // don't include collab playlists because the user may not be familiar with all of these
            item.name !== 'Discover Weekly' &&
            item.name !== 'Liked from Radio'
        )
        .map((item) => item.id);
    });

    const playlistIds = _.flatten(playlistBatchIds);

    return playlistIds;
  }

  private async getPlaylistCount(endpoint: string): Promise<number> {
    const playlistResponse: AxiosResponse = await axios.get(
      `${endpoint}?limit=1`,
      {
        // small limit because we are only concerned with the total count info
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    const playlistObjects: SpotifyPlaylistsObject = playlistResponse.data;
    return playlistObjects.total;
  }

  private async getAllPlaylistArtists(
    playlistIds: string[]
  ): Promise<artistInfo[]> {
    // const playlistTracksEndpoint = `https://api.spotify.com/v1/playlists/{playlist_id}/tracks?market=US&fields=items(track(artists(name%2Cid)))`;

    const playlistTracksEndpoints = playlistIds.map(
      (id) => `https://api.spotify.com/v1/playlists/${id}/tracks`
    );

    let artists: artistInfo[] = [];
    for (let endpoint of playlistTracksEndpoints) {
      artists.push(...(await this.getArtistsFromPlaylist(endpoint)));
    }

    return artists;
  }

  private async getArtistsFromPlaylist(
    endpoint: string
  ): Promise<artistInfo[]> {
    const response: AxiosResponse = await axios.get(
      `${endpoint}?market=US&fields=total`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    const totalTrackCount = response.data.total;

    const tracksEndpoints = this.generateEndpoints(
      `${endpoint}`,
      totalTrackCount,
      100,
      {
        market: 'US',
        fields: 'items(track(artists(name,id)))',
      }
    ); // if playlist has over 100 songs, we'll need to process in batches

    // all batches at once
    const trackBatchPromises = tracksEndpoints.map((endpoint) => {
      return axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
    });

    const responses: AxiosResponse[] = await Promise.all(trackBatchPromises); // all responses at once
    const artistBatchInfo: artistInfo[] = _.flatten(
      responses.map((response: AxiosResponse) => {
        const data: SpotifyPlaylistTracksObject = response.data;

        return _.flatten(
          data.items.map((trackObj) => {
            const artists = trackObj.track.artists;
            const artistInfo: artistInfo[] = artists.map((item) => ({
              ...item,
              previewUri: null,
            }));
            return artistInfo;
          })
        );
      })
    );

    return artistBatchInfo;
  }
  // Spotify user ID
  private async getUserId(): Promise<string> {
    const userDetailsEndpont = 'https://api.spotify.com/v1/me';
    const userDetailsResponse: AxiosResponse = await axios.get(
      userDetailsEndpont,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    const userDetailsObj: SpotifyUserDetailsObject = userDetailsResponse.data;
    return userDetailsObj.id;
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
  private generateEndpoints(
    endpointUrl: string,
    totalCount: number,
    limitPerResponse: number,
    additionalParams?: { [key: string]: string }
  ): string[] {
    const numberOfCallsNeeded = Math.ceil(totalCount / limitPerResponse);

    let endpoints: string[] = [];
    for (let i = 0; i < numberOfCallsNeeded; i++) {
      let endpointBuilder = `${endpointUrl}?offset=${
        i * limitPerResponse
      }&limit=${limitPerResponse}`;

      if (additionalParams) {
        for (let [key, value] of Object.entries(additionalParams)) {
          endpointBuilder += `&${key}=${value}`;
        }
      }
      endpoints.push(endpointBuilder);
    }

    return endpoints;
  }

  // return a string of top artists
  async getTopArtists(
    limit: number
  ): Promise<{ name: string; image: string }[]> {
    const endpoint = `${topArtistsEndpoint}?limit=${limit}`;

    const topArtistsResponse: AxiosResponse = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const artistsResponse: SpotifyTopArtistsObject = topArtistsResponse.data;
    const topArtists = artistsResponse.items.map((item) => ({
      name: item.name,
      image: item.images.length ? item.images[0].url : '',
    }));

    return topArtists;
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
