import { Artist } from '../artists/Artist';

type ConcertArtist = {
  streamingServiceDetails: Artist;
  concertServiceId: string;
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
