import React from 'react';
import '../styles/CustomMap.css';
import { CustomMapModel } from '../model/CustomMapModel';
import { UniqueConcertLocation } from '../model/concerts/ConcertCollection';

interface Props {
  divId: string;
  getConcertLocations: (
    centerPoint: google.maps.LatLng
  ) => UniqueConcertLocation[] | null;
}

interface State {
  mapCenter: google.maps.LatLng;
  notLoggedInAlert: boolean;
}

const DefaultStartCoords = {
  // Columbus
  lat: 39.9612,
  lng: -82.9988,
};

export class CustomMap extends React.Component<Props, State> {
  map: CustomMapModel | null = null; // add value once component mounts

  constructor(props: Props) {
    super(props);

    const center: google.maps.LatLng = new google.maps.LatLng(
      DefaultStartCoords.lat,
      DefaultStartCoords.lng
    );
    this.state = { mapCenter: center, notLoggedInAlert: false };
  }

  componentDidMount(): void {
    this.map = new CustomMapModel(
      this.props.divId,
      this.state.mapCenter,
      this.updateCenter
    );
    this.map.attachCoordinateListener();
  }

  private updateCenter = (center: google.maps.LatLng): void => {
    this.setState({ ...this.state, mapCenter: center });
  };

  private centerHasBeenSet(): boolean {
    return (
      this.state.mapCenter.lat() !== DefaultStartCoords.lat &&
      this.state.mapCenter.lng() !== DefaultStartCoords.lng
    );
  }

  render(): JSX.Element {
    if (this.map && this.centerHasBeenSet()) {
      this.map.clearMarkers();

      // get the new list of concerts / generate new markers based on the changed inputs
      const uniqueLocations = this.props.getConcertLocations(
        this.state.mapCenter
      );
      console.log(uniqueLocations);
      if (uniqueLocations === null) {
        alert('Try selecting a streaming service first');
      } else {
        this.map.placeMarkers(uniqueLocations);
      }
    }

    console.log('renderoo');

    return <div className="googlemap" id={this.props.divId} />;
  }
}
