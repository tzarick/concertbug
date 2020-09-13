import { Artist } from '../artists/Artist';

type ConcertArtist = {
  streamingServiceDetails: Artist;
  concertServiceId: string;
};

// export class Concert {}
export interface Concert {
  artist: string;
  date: Date;
  ticketLink: string;
  ticketsAvailable: boolean;
  songPreviewUri: string | null;
  venue: {
    name: string;
    location: google.maps.LatLng;
  };
  distanceAway: number;
}
