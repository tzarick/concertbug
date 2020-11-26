import { SpotifyReader } from './SpotifyReader';
import { StreamingService } from '../../../components/Controller';

type UrlParam = {
  [key: string]: string;
};

export interface artistInfo {
  name: string;
  id: string;
  previewUri: string | null;
}

export abstract class MusicLibraryReader {
  public authorizeUrl: string = '';
  abstract authenticate(): boolean;
  abstract async fetchArtists(): Promise<artistInfo[]>;
  abstract async getPreviewUri(artistId: string): Promise<string | null>;
  abstract async getTopArtists(
    limit: number
  ): Promise<{ name: string; image: string }[]>;

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
