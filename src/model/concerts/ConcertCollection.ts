import { ArtistCollection } from '../artists/ArtistCollection';
import { Concert } from './Concert';
import axios, { AxiosResponse, AxiosError } from 'axios';
import {
  ConcertDataReader,
  ConcertInfo,
  RawConcertObj,
} from '../aggregators/concertReader/ConcertDataReader';
import { Artist } from '../artists/Artist';

export class ConcertCollection {
  private concerts: Concert[] = [];
  constructor(
    private artistCollection: ArtistCollection,
    private concertReader: ConcertDataReader
  ) {}

  async fetchConcerts(artists: Artist[]): Promise<Concert[]> {
    const concertInfo = this.concertReader.fetchConcertData(artists);

    return [];
  }

  getElligibleConcerts(): Concert[] {
    return [];
  }

  private distanceAway(
    center: google.maps.LatLng,
    concert: { lat: number; lng: number }
  ): number {
    if (concert.lat === -1) {
      // unknown venue location
      return 0;
    }

    // calc dist
    return 0;
  }

  private buildConcertsForArtist(
    concertInfo: RawConcertObj,
    center: google.maps.LatLng
  ): Concert[] {
    const artistName = concertInfo.concertArtistInfo.name;

    return concertInfo.concertInfo.map((concert) => ({
      artist: artistName,
      date: concert.date,
      ticketLink: concert.uri,
      ticketsAvailable: true, // todo
      songPreviewUri: null, // fill later
      venue: {
        name: concert.venue.name,
        location:
          concert.venue.lat > 0
            ? new google.maps.LatLng(concert.venue.lat, concert.venue.lng)
            : new google.maps.LatLng(36.2392423, -72.4949963), // atlantic ocean
      },
      distanceAway: this.distanceAway(center, {
        lat: concert.venue.lat,
        lng: concert.venue.lng,
      }),
    }));
  }
}
