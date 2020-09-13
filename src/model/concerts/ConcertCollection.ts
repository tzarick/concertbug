import { ArtistCollection } from '../artists/ArtistCollection';
import { Concert } from './Concert';
import {
  ConcertDataReader,
  RawConcertObj,
} from '../aggregators/concertReader/ConcertDataReader';
import { Artist } from '../artists/Artist';
import { getDistance } from 'geolib';

export class ConcertCollection {
  private concerts: Concert[] = [];
  constructor(private concertReader: ConcertDataReader) {}

  async fetchConcerts(artists: Artist[]): Promise<Concert[]> {
    const concertInfo = await this.concertReader.fetchConcertData(artists);
    concertInfo.forEach((concert) => {
      this.concerts.push(
        ...this.buildConcertsForArtist(
          concert,
          new google.maps.LatLng(39.9612, -82.9988)
        )
      );
    });

    return this.concerts;
  }

  getElligibleConcerts(): Concert[] {
    return [];
  }

  private distanceAway(
    center: google.maps.LatLng,
    concert: { lat: number; lng: number }
  ): number {
    if (concert.lat === -1) {
      // unknown venue location --> will be added to a special "unknown" marker in the atlantic ocean
      return 0;
    }

    let distance = 100000000000; // don't display if getDistance fails
    try {
      distance = getDistance(concert, {
        lat: center.lat(),
        lng: center.lng(),
      });
    } catch {
      console.log('getDistance between 2 points failed');
    }

    const metersInAMile = 1609.34;
    return distance / metersInAMile;
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
