import { Artist } from '../artists/Artist';

type ConcertArtist = {
  streamingServiceDetails: Artist;
  concertServiceId: string;
};

export interface Concert {
  displayName: string;
  artist: {
    name: string;
    streamingId: string;
  };
  date: Date | null;
  ticketLink: string;
  ticketsAvailable: boolean;
  songPreviewUri: string | null;
  venue: {
    name: string;
    location: google.maps.LatLng;
  };
  bill: string[];
}
