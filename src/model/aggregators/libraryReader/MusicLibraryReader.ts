import { SpotifyReader } from './SpotifyReader';
import { StreamingService } from '../../../components/Controller';

type UrlParam = {
  [key: string]: string;
};

export abstract class MusicLibraryReader {
  public authorizeUrl: string = '';
  abstract authenticate(): boolean;
  abstract async fetchArtists(): Promise<boolean>;

  protected buildFullUrl(baseUrl: string, params: UrlParam[]): string {
    params.forEach((param, i) => {
      const [key] = Object.keys(param);
      const [value] = Object.values(param);

      baseUrl += i === 0 ? '?' : '&';
      baseUrl += `${key}=${encodeURIComponent(value)}`;
    });

    return baseUrl;
  }

  static getStreamingService(): StreamingService | null {
    if (SpotifyReader.spotifyUserIsLoggedIn()) {
      return StreamingService.Spotify;
    }
    // else if (AppleMusicReader.appleUserIsLoggedIn()) { // todo
    //  return StreamingService.AppleMusic;
    // }

    return null;
  }
}
