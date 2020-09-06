import { MusicLibraryReader } from './MusicLibraryReader';

type UrlParam = {
  [key: string]: string;
};

export class SpotifyReader extends MusicLibraryReader {
  private redirectUri = 'http://localhost:3000/'; // TODO: change this to real prod URL

  public authenticate(): boolean {
    const stateKey = this.generateRandomString(16);
    const scope = 'user-library-read playlist-read-private user-top-read'; // add more scopes here if needed
    const spotifyAuthUrl = 'https://accounts.spotify.com/authorize';

    const fullUrl = this.buildFullUrl(spotifyAuthUrl, [
      { response_type: 'token' },
      { client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID as string },
      { scope: scope },
      { redirect_uri: this.redirectUri },
      { state: stateKey },
      { show_dialog: 'true' },
    ]);

    return true;
  }

  public fetchArtists(): string[] {
    return [];
  }

  private buildFullUrl(baseUrl: string, params: UrlParam[]): string {
    params.forEach((param, i) => {
      const [key] = Object.keys(param);
      const [value] = Object.values(param);

      baseUrl += i === 0 ? '?' : '&';
      baseUrl += `${key}=${encodeURIComponent(value)}`;
    });

    return baseUrl;
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
}
