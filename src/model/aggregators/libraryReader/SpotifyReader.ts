import { MusicLibraryReader } from './MusicLibraryReader';
import { hashParamsExist, getHashParams } from '../../utils';
import axios, { AxiosResponse } from 'axios';

const savedTracksEndpoint = 'https://api.spotify.com/v1/me/tracks';

export class SpotifyReader extends MusicLibraryReader {
  private redirectUri = 'http://localhost:3000/'; // TODO: change this to real prod URL
  private token = '';
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

  fetchArtists(): string[] {
    this.fetchSavedTracksArtists();
    return [];
  }

  private getToken(): void {
    if (hashParamsExist()) this.token = getHashParams().access_token;
  }

  private fetchSavedTracksArtists(): string[] {
    console.log('get request');
    axios
      .get(savedTracksEndpoint, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then((response: AxiosResponse): void => {
        console.log(response.data);
      });

    return [];
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
