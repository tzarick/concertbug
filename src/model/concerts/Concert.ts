import { Artist } from '../artists/Artist';

type ConcertArtist = {
  spotifyDetails: Artist;
  songkickId: string;
};

// export class Concert {}
export type Concert = {
  artist: ConcertArtist;
  date: Date;
  ticketLink: string;
  ticketsAvailable: boolean;
  songPreviewUri: string;
  location: google.maps.LatLng;
  distanceAway: number;
};
