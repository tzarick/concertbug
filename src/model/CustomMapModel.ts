export class CustomMapModel {
  private googleMap: google.maps.Map;

  constructor(divId: string) {
    const center: google.maps.LatLngLiteral = {
      lat: 39.9612, // Columbus
      lng: 82.9988,
    };
    this.googleMap = new window.google.maps.Map(
      document.getElementById(divId) as HTMLElement,
      {
        zoom: 5,
        center: center,
      }
    );
  }
}
