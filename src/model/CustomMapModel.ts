import { mapStyles } from '../styles/mapStyles';
import bugMarkerPath from '../styles/images/BugMarker64.png';
import { UniqueConcertLocation } from './concerts/ConcertCollection';
import { Concert } from './concerts/Concert';

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
    var marker = new google.maps.Marker({
      position: coords,
      map: this.googleMap,
      icon: bugMarkerPath,
      animation: google.maps.Animation.BOUNCE,
    });

    this.attachInfoWindow(marker, concerts);

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

  private attachInfoWindow(
    marker: google.maps.Marker,
    concerts: Concert[]
  ): void {
    // const content = `
    //   <div>
    //     <h3>Mouthwatering Concert #1</h3>
    //     <p>details etc...</p>
    //   </div>
    // `;

    let content = '';
    for (let concert of concerts) {
      const concertDetails = `
      <div style="background-color: #ffebee">
        <h3>${concert.displayName}</h3>
        <h4>${concert.artist}</h5>
        <ul>
          <li><strong>Date:</strong> xx-xx-xxxx</li>
          <li><strong>Time:</strong> xx:xx</li>
          <li><strong>Venue:</strong> ${concert.venue.name}</li>
          <li><strong>Other Artists On Bill:</strong> ${concert.bill}</li>
          <li><a target="_blank" href=${concert.ticketLink}><strong>Tickets + More Info</strong></a></li>
        </ul>

      </div>
        `;
      //   <li>Date: ${concert.date ? concert.date.getMonth() + 1 : '00'}-${
      //   concert.date ? concert.date?.getDay() + 1 : '00'
      // }-${concert.date?.getFullYear()}</p>

      content += concertDetails;
    }

    const infoWindow = new google.maps.InfoWindow({
      content: content,
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
