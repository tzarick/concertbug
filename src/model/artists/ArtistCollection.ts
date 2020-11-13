import { MusicLibraryReader } from '../aggregators/libraryReader/MusicLibraryReader';
import { Artist } from './Artist';

export class ArtistCollection {
  artists: Artist[] = [];
  constructor(private userLibAggregator: MusicLibraryReader) {}

  async fillArtists(): Promise<Artist[]> {
    this.artists = await this.userLibAggregator.fetchArtists();
    // for (let artist of artists) {
    //   // const uri = await this.userLibAggregator.getPreviewUri(artist.id);
    //   this.artists.push({
    //     name: artist.name,
    //     songPreviewUri: null, // we hit the max request limit if we do this now. fill later
    //   });
    // }
    return this.artists;
  }

  async displayTopArtists(limit: number): Promise<void> {
    const topArtists = await this.userLibAggregator.getTopArtists(limit);

    let displayMessage = '💘 Your top artists over the last 6 months: 💘 \n\n';
    const emojis = ['🤩', '😍', '😘', '😀', '🙂']; // most excited faces -> slightly less excited faces

    topArtists.forEach((artist, i) => {
      displayMessage += `${i + 1}) ${artist} ${emojis[i]}\n`;
    });

    window.alert(displayMessage);
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
