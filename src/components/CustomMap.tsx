import React, { Component } from 'react';
import '../styles/CustomMap.css';
import { mapStyles } from '../styles/mapStyles';

// import { Map, GoogleApiWrapper, GoogleAPI } from 'google-maps-react';
// import { CustomMapModel } from '../model/CustomMapModel';

interface Props {
  divId: string;
  // onMapLoad: (map: google.maps.Map) => void;
  // apiKey: string;
}

export class CustomMap extends React.Component<Props> {
  componentDidMount(): void {
    const center: google.maps.LatLngLiteral = {
      lat: 39.9612, // Columbus
      lng: -82.9988,
    };
    const map = new window.google.maps.Map(
      document.getElementById(this.props.divId) as Element,
      {
        center: center,
        zoom: 5,
        mapTypeId: 'roadmap',
        styles: mapStyles,
      }
    );
  }

  render() {
    return (
      <div
        // style={{ height: 500, width: 500 }}
        className="googlemap"
        id={this.props.divId}
      />
    );
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
