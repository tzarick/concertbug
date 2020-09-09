import { ArtistCollection } from '../artists/ArtistCollection';
import { Concert } from './Concert';

export class ConcertCollection {
  private concerts: Concert[] = [];
  constructor(private artistCollection: ArtistCollection) {}

  fetchConcerts(): Concert[] {
    return [];
  }

  getElligibleConcerts(): Concert[] {
    return [];
  }

  private distanceAway(center: { lat: number; lng: number }): number {
    return 0;
  }
}
