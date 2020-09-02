import { mapStyles } from '../styles/mapStyles';

// google map wrapper class
export class CustomMapModel {
  private googleMap: google.maps.Map;

  constructor(divId: string, private updateCenter: Function) {
    const center: google.maps.LatLngLiteral = {
      lat: 39.9612, // Columbus
      lng: -82.9988,
    };
    this.googleMap = new window.google.maps.Map(
      document.getElementById(divId) as HTMLElement,
      {
        center: center,
        zoom: 5,
        mapTypeId: 'roadmap',
        styles: mapStyles,
      }
    );

    updateCenter(this.googleMap.getCenter());
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

  private handleNewCoords(latLng: google.maps.LatLng): void {
    console.log(`lat: ${latLng.lat()}`);
    console.log(`lng: ${latLng.lng()}`);
    this.updateCenter(latLng);
  }
}
