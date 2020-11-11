import { Concert } from './Concert';
import {
  ConcertDataReader,
  RawConcertObj,
} from '../aggregators/concertReader/ConcertDataReader';
import { Artist } from '../artists/Artist';
import { getDistance } from 'geolib';
import { UnknownVenueCoords } from '../utils';

export interface UniqueConcertLocation {
  location: google.maps.LatLng;
  concerts: Concert[];
}

export class ConcertCollection {
  private concerts: Concert[] = [];
  constructor(private concertReader: ConcertDataReader) {}

  async fetchConcerts(artists: Artist[]): Promise<Concert[]> {
    const concertInfo = await this.concertReader.fetchConcertData(artists);
    concertInfo.forEach((concert) => {
      this.concerts.push(
        ...this.buildConcertsForArtist(
          concert
          // new google.maps.LatLng(39.9612, -82.9988) // TODO change this to dynamic center point
        )
      );
    });

    return this.concerts;
  }

  getElligibleConcertLocations(
    maxDistance: number,
    startDate: Date,
    endDate: Date,
    centerPoint: google.maps.LatLng
  ): UniqueConcertLocation[] {
    const elligibleConcerts = this.concerts.filter((concert) => {
      const isUnknownVenue =
        concert.venue.location.lat() === UnknownVenueCoords.lat &&
        concert.venue.location.lng() === UnknownVenueCoords.lng;
      return (
        concert.date && // don't display concert if we don't know when it is -> maybe change this later?
        (this.distanceAway(centerPoint, concert.venue.location) < maxDistance ||
          isUnknownVenue) && // unknown locations will be put in a special spot
        concert.date > startDate &&
        concert.date < endDate
      );
    });

    return this.getUniqueConcertLocations(elligibleConcerts);
  }

  // put all concerts that are at the same location into the same marker so we can view each one still (stack info contents later)
  private getUniqueConcertLocations(
    elligibleConcerts: Concert[]
  ): UniqueConcertLocation[] {
    const uniqueLocations: UniqueConcertLocation[] = [];
    for (let concert of elligibleConcerts) {
      // have we already added this location
      const existingIndex = uniqueLocations.findIndex(
        (item) =>
          item.location.lat() === concert.venue.location.lat() &&
          item.location.lng() === concert.venue.location.lng()
      );
      if (existingIndex === -1) {
        uniqueLocations.push({
          location: concert.venue.location,
          concerts: [concert],
        });
      } else {
        uniqueLocations[existingIndex].concerts.push(concert);
      }
    }

    return uniqueLocations;
  }

  private distanceAway(
    center: google.maps.LatLng,
    concert: google.maps.LatLng
  ): number {
    if (concert.lat() === -1) {
      // unknown venue location --> will be added to a special "unknown" marker in the atlantic ocean
      return 0;
    }

    let distance = 100000000000; // don't display if getDistance fails
    try {
      distance = getDistance(
        {
          lat: concert.lat(),
          lng: concert.lng(),
        },
        {
          lat: center.lat(),
          lng: center.lng(),
        }
      );
    } catch {
      console.log('getDistance between 2 points failed');
    }

    const METERS_IN_MILE = 1609.34;
    return distance / METERS_IN_MILE;
  }

  private buildConcertsForArtist(concertInfo: RawConcertObj): Concert[] {
    const artistName = concertInfo.concertArtistInfo.name;
    const artistId = concertInfo.concertArtistInfo.streamingServiceId;
    const previewUri = concertInfo.concertArtistInfo.previewUri;

    return concertInfo.concertInfo.map((concert) => ({
      displayName: concert.title,
      artist: {
        name: artistName,
        streamingId: artistId,
      },
      date: concert.date,
      ticketLink: concert.uri,
      ticketsAvailable: true, // todo
      songPreviewUri: previewUri,
      venue: {
        name: concert.venue.name,
        location:
          concert.venue.lat > 0
            ? new google.maps.LatLng(concert.venue.lat, concert.venue.lng)
            : new google.maps.LatLng(
                UnknownVenueCoords.lat,
                UnknownVenueCoords.lng
              ), // atlantic ocean
      },
      // distanceAway: this.distanceAway(center, {
      //   lat: concert.venue.lat,
      //   lng: concert.venue.lng,
      // }),
      bill: concert.bill,
    }));
  }
}
