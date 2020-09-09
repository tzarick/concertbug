// export class Concert {}
export type Concert = {
  artistName: string;
  date: Date;
  ticketLink: string;
  ticketsAvailable: boolean;
  songPreviewUri: string;
  location: google.maps.LatLng;
  distanceAway: number;
};
