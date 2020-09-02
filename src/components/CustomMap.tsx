import React, { Component } from 'react';
import '../styles/CustomMap.css';
import { CustomMapModel } from '../model/CustomMapModel';

// import { Map, GoogleApiWrapper, GoogleAPI } from 'google-maps-react';
// import { CustomMapModel } from '../model/CustomMapModel';

interface Props {
  divId: string;
  // onMapLoad: (map: google.maps.Map) => void;
  // apiKey: string;
}

interface State {
  mapCenter: google.maps.LatLng;
}

export class CustomMap extends React.Component<Props, State> {
  map: CustomMapModel | null = null; // add value once component mounts

  constructor(props: Props) {
    super(props);

    const center: google.maps.LatLng = new google.maps.LatLng(
      39.9612,
      -82.9988
    ); // Columbus
    this.state = { mapCenter: center };
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
    this.setState({ mapCenter: center });
  };

  render(): JSX.Element {
    if (this.map) {
      this.map.setCenter(this.state.mapCenter); // instead of re-centering here we would get the new list of concerts / generate new markers based on the changed inputs
    }
    console.log('renderoo');
    return <div className="googlemap" id={this.props.divId} />;
  }
}
// export class CustomMap extends React.Component<Props> {
//   constructor(props: Props) {
//     super(props);
//     this.onScriptLoad = this.onScriptLoad.bind(this);
//   }

//   onScriptLoad(): void {
// const center: google.maps.LatLngLiteral = {
//   lat: 39.9612, // Columbus
//   lng: 82.9988,
// };

//     const map: google.maps.Map = new window.google.maps.Map(
//       document.getElementById(this.props.divId),
//       {
//         center: center,
//         zoom: 5,
//       }
//     );

//     this.props.onMapLoad(map);
//   }

//   componentDidMount(): void {
//     if (!window.google) {
//       var script = document.createElement('script');
//       script.type = 'text/javascript';
//       script.src = `https://maps.googleapis.com/maps/api/js?key=${this.props.apiKey}`;
//       var x = document.insert
//     }
//   }
// }

// export class CustomMap extends React.Component<Props> {
//   render() {
//     return <Map google={this.props.google} zoom={5}></Map>;
//   }
// }

// export default GoogleApiWrapper({
//   apiKey: APIKEY,
// })(CustomMap);
