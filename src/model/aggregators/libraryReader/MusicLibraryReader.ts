export abstract class MusicLibraryReader {
  abstract authenticate(): boolean;
  abstract fetchArtists(): string[];
}
