import { mapStyles } from '../styles/mapStyles';
import bugMarkerPath from '../styles/images/BugMarker64.png';

// google map wrapper class
export class CustomMapModel {
  private googleMap: google.maps.Map;

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

  placeMarker(coords: google.maps.LatLng): void {
    var marker = new google.maps.Marker({
      position: coords,
      map: this.googleMap,
      icon: bugMarkerPath,
      animation: google.maps.Animation.BOUNCE,
    });

    this.attachInfoWindow(marker);

    setTimeout(() => {
      marker.setAnimation(null);
    }, 1500); // bounce for 1.5 seconds and then stop so it doesn't look like an overwhelming flood
  }

  private attachInfoWindow(marker: google.maps.Marker): void {
    const content = `
      <div>
        <h3>Mouthwatering Concert #1</h3>
        <p>details etc...</p>
      </div>
    `;

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

  private handleNewCoords(latLng: google.maps.LatLng): void {
    console.log(`lat: ${latLng.lat()}`);
    console.log(`lng: ${latLng.lng()}`);
    this.updateCenter(latLng);
  }
}
