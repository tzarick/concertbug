import { mapStyles } from '../styles/mapStyles';
import bugMarkerPath from '../styles/images/BugMarker64.png';
import { UniqueConcertLocation } from './concerts/ConcertCollection';
import { Concert } from './concerts/Concert';
import { MusicLibraryReader } from './aggregators/libraryReader/MusicLibraryReader';

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
    concerts: Concert[]
  ): void {
    let content = '';
    for (let concert of concerts) {
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
        <iframe class="preview" id="${
          concert.artist.streamingId
        }" src="" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        </div>
        `;

      content += concertDetails;
    }

    const infoWindow = new google.maps.InfoWindow({
      content: content,
    });

    infoWindow.set('openStatus', false); // not open yet

    marker.addListener('click', () => {
      const isOpen = infoWindow.get('openStatus');

      if (!isOpen) {
        if (!content.toString().includes('spotify:track')) {
          // add song preview iframe
          // open window -> load uri preview from spotify -> put it into the window once it arrives. So we don't freeze everything up while waiting
          let content = infoWindow.getContent();
          const newContent = this.getPreviewUris(content.toString()).then(
            (response) => {
              infoWindow.setContent(response);
            }
          );
        }
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

  private async getPreviewUris(content: string): Promise<string> {
    const html = document.createElement('div');
    html.innerHTML = content;
    const iframes = html.getElementsByClassName('preview');
    console.log(iframes.item(0)?.getAttribute('id'));
    let i = 0;
    let item = iframes.item(i);
    while (item && i < 15) {
      const uri = await this.getUri(item.getAttribute('id'));
      if (uri) item.setAttribute('src', uri);

      i++;
      item = iframes.item(i);
    }
    return '';
  }

  private async getUri(artistId: string | null): Promise<string | null> {
    let uri: string | null = '';
    if (artistId) {
      // uri = await this.libraryReader.getPreviewUri(artistId);
    }
    return uri || '';
  }

  private handleNewCoords(latLng: google.maps.LatLng): void {
    console.log(`lat: ${latLng.lat()}`);
    console.log(`lng: ${latLng.lng()}`);
    this.updateCenter(latLng);
  }
}
