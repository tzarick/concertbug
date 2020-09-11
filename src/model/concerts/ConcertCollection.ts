import { ArtistCollection } from '../artists/ArtistCollection';
import { Concert } from './Concert';
import axios, { AxiosResponse, AxiosError } from 'axios';

export class ConcertCollection {
  private concerts: Concert[] = [];
  constructor(private artistCollection: ArtistCollection) {}

  async fetchConcerts(): Promise<Concert[]> {
    return [];
  }

  getElligibleConcerts(): Concert[] {
    return [];
  }

  private distanceAway(center: { lat: number; lng: number }): number {
    return 0;
  }
}
