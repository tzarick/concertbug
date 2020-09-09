// export class Artist {
//   public songPreviewUri: string | null = null;
//   constructor(public name: string, private id: string) {}

//   private async fetchSongPreview(artistId: string): Promise<string> {
//     const uri = await this.userLibAggregator.getPreviewUri(artistId);
//     this.songPreviewUri = uri;
//     return uri;
//   }
// }

export type Artist = {
  name: string;
  id: string;
};
