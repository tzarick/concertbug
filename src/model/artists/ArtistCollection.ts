import { MusicLibraryReader } from '../aggregators/libraryReader/MusicLibraryReader';
import { Artist } from './Artist';

export class ArtistCollection {
  artists: Artist[] = [];
  constructor(private userLibAggregator: MusicLibraryReader) {}

  async fillArtists(): Promise<Artist[]> {
    this.artists = await this.userLibAggregator.fetchArtists();

    return this.artists;
  }

  async getTopArtists(
    limit: number
  ): Promise<{ name: string; image: string }[]> {
    const topArtists = await this.userLibAggregator.getTopArtists(limit);

    return topArtists;
  }
  // an alternative: this static method could work but seems a little less flexible
  // static async newArtistCollection(
  //   userLibAggregator: MusicLibraryReader
  // ): Promise<ArtistCollection> {
  //   const collection = new ArtistCollection(userLibAggregator);
  //   await collection.fillArtists();
  //   return collection;
  // }

  // private async fetchArtistNames(): Promise<string[]> {
  //   const artists = await this.userLibAggregator.fetchArtists();
  //   return artists.map((item) => item.name);
  //   // return [];
  // }
  // private async fetchSongPreview(artistId: string): Promise<string | null> {
  //   return await this.userLibAggregator.getPreviewUri(artistId);
  //   // return `<iframe
  //   //   src=${uri}
  //   //   width="300"
  //   //   height="80"
  //   //   frameborder="0"
  //   //   allowtransparency="true"
  //   //   allow="encrypted-media"
  //   // ></iframe>`;
  // }
}
