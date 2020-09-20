import React, { Component } from 'react';
import '../styles/CustomMap.css';
import { CustomMapModel } from '../model/CustomMapModel';
import { MusicLibraryReader } from '../model/aggregators/libraryReader/MusicLibraryReader';
import { UserConstraints } from './Controller';
import { ArtistCollection } from '../model/artists/ArtistCollection';
import {
  ConcertCollection,
  UniqueConcertLocation,
} from '../model/concerts/ConcertCollection';
import { ConcertDataReader } from '../model/aggregators/concertReader/ConcertDataReader';
import { SongkickReader } from '../model/aggregators/concertReader/SongkickReader';
import { Artist } from '../model/artists/Artist';
import { AxiosResponse } from 'axios';

// import { Map, GoogleApiWrapper, GoogleAPI } from 'google-maps-react';
// import { CustomMapModel } from '../model/CustomMapModel';

interface Props {
  divId: string;
  // libraryReader: MusicLibraryReader | null;
  // userConstraints: UserConstraints;
  // artists: Artist[];
  getConcertLocations: () => UniqueConcertLocation[];
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
    // if (this.map && this.props.libraryReader && this.props.artists.length > 0) {
    if (this.map) {
      this.map.clearMarkers();
      // Artists and Concerts are both stored in controller's state - filled here *usually*
      // this.map.setCenter(this.state.mapCenter); // instead of re-centering here we would get the new list of concerts / generate new markers based on the changed inputs

      // const concertCollection = new ConcertCollection(new SongkickReader());
      // concertCollection.fetchConcerts(this.props.artists).then((concerts) => {
      //   console.log(concerts);
      // });
      const uniqueLocations = this.props.getConcertLocations();
      console.log(uniqueLocations);

      this.map.placeMarker(this.state.mapCenter);
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
