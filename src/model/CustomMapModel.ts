import { mapStyles } from '../styles/mapStyles';
import bugMarkerPath from '../styles/images/BugMarker64.png';
import compassMarkerPath from '../styles/images/compass.png';
import { UniqueConcertLocation } from './concerts/ConcertCollection';
import { Concert } from './concerts/Concert';
import { UnknownVenueCoords } from './utils';

// google map wrapper class
export class CustomMapModel {
  private googleMap: google.maps.Map;
  private markers: google.maps.Marker[] = [];

  constructor(
    divId: string,
    center: google.maps.LatLng,
    private updateCenter: (center: google.maps.LatLng) => void
  ) {
    this.googleMap = new window.google.maps.Map(
      document.getElementById(divId) as HTMLElement,
      {
        center: center,
        zoom: 5,
        mapTypeId: 'roadmap',
        styles: mapStyles,
      }
    );
  }

  setZoom(zoom: number): void {
    this.googleMap.setZoom(zoom);
  }

  setCenter(center: google.maps.LatLng) {
    this.googleMap.setCenter(center);
  }

  attachCoordinateListener(): void {
    this.googleMap.addListener(
      'click',
      (mapsMouseEvent: google.maps.MouseEvent) => {
        this.handleNewCoords(mapsMouseEvent.latLng);
      }
    );
  }

  placeMarker(coords: google.maps.LatLng, concerts: Concert[]): void {
    const isUnknownVenue =
      concerts[0].venue.location.lat() === UnknownVenueCoords.lat &&
      concerts[0].venue.location.lng() === UnknownVenueCoords.lng;

    var marker = isUnknownVenue
      ? new google.maps.Marker({
          // compass marker with no animation
          position: coords,
          map: this.googleMap,
          icon: compassMarkerPath,
        })
      : new google.maps.Marker({
          // bug-microphone marker with a bounce animation
          position: coords,
          map: this.googleMap,
          icon: bugMarkerPath,
          animation: google.maps.Animation.BOUNCE,
        });

    this.attachInfoWindow(marker, concerts, coords);

    setTimeout(() => {
      marker.setAnimation(null);
    }, 1500); // bounce for 1.5 seconds and then stop so it doesn't look like an overwhelming bug infestation

    this.markers.push(marker);
  }

  placeMarkers(uniqueConcertLocations: UniqueConcertLocation[]) {
    for (let location of uniqueConcertLocations) {
      this.placeMarker(location.location, location.concerts);
    }
  }

  private getDateFormatted(date: Date | null): string {
    let displayDate = '?';
    if (date) {
      displayDate = date.toString().slice(0, 15);
    }

    return displayDate;
  }

  private getTimeFormatted(date: Date | null): string {
    let displayTime = '?';
    if (date) {
      const time = date.toTimeString().slice(0, 5);
      if (time !== '00:00') {
        displayTime = time;
      }
    }

    return displayTime;
  }

  private getBillFormatted(bill: string[]): string {
    let displayBill = '';
    if (bill && bill.length > 0) {
      displayBill = '<ul>';
      bill.forEach((artist) => {
        displayBill += `<li>${artist}</li>`;
      });
      displayBill += '</ul>';
    }

    return displayBill;
  }

  private attachInfoWindow(
    marker: google.maps.Marker,
    concerts: Concert[],
    location: google.maps.LatLng
  ): void {
    let content = '';
    const isKnownVenue =
      location.lat() !== UnknownVenueCoords.lat &&
      location.lng() !== UnknownVenueCoords.lng;

    const unknownLocationMarkerHeader = `
      <div height="50" text-align="center">
        <h3>&#128517; Concerts unable to be precisely placed:</h3>
      </div>
    `;

    if (!isKnownVenue) {
      content = unknownLocationMarkerHeader;
    }

    for (let concert of concerts) {
      const uniqueIframe = `
        <iframe 
          class="preview" 
          src="https://open.spotify.com/embed/artist/${concert.artist.streamingId}" 
          width="300" 
          height="80" 
          frameborder="0" 
          allowtransparency="true" 
          allow="encrypted-media">
        </iframe>`;

      const concertDetails = `
      <div style="background-color: #ffebee; padding: 5px; border-bottom: 3px solid #D4DBDD;">
        <h2>${concert.artist.name}</h2>
        <h4>${concert.displayName}</h4>
        <ul>
          <li><strong>When:</strong> ${this.getDateFormatted(
            concert.date
          )}, ${this.getTimeFormatted(concert.date)}</li>

          <li><strong>Where:</strong> ${concert.venue.name}</li>
          <li> 
            <details>
              <summary><strong>Other Artists On Bill:</strong></summary>
                <div>${this.getBillFormatted(concert.bill)}</div>
              </details>
          </li>
          <li>
            <a target="_blank" href=${concert.ticketLink}>
              <strong>Tickets + More Info</strong>
            </a>
          </li>
        </ul>
          ${isKnownVenue ? uniqueIframe : ''}
        </div>
        `;

      content += concertDetails;
    }

    const infoWindow = new google.maps.InfoWindow({
      content: content,
      maxWidth: 350,
    });

    infoWindow.set('openStatus', false); // not open yet

    marker.addListener('click', () => {
      const isOpen = infoWindow.get('openStatus');

      if (!isOpen) {
        infoWindow.open(this.googleMap, marker);
        infoWindow.set('openStatus', true);
      } else {
        infoWindow.close();
        infoWindow.set('openStatus', false);
      }
    });
  }

  clearMarkers(): void {
    for (let marker of this.markers) {
      marker.setMap(null);
    }
    this.markers = [];
  }

  private handleNewCoords(latLng: google.maps.LatLng): void {
    console.log(`lat: ${latLng.lat()}`);
    console.log(`lng: ${latLng.lng()}`);
    this.updateCenter(latLng);
  }
}
