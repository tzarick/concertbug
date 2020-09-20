import React, { Component } from 'react';
import { CustomMap } from './CustomMap';
import { CustomHeader } from './CustomHeader';
import { SpotifyReader } from '../model/aggregators/libraryReader/SpotifyReader';
import {
  MusicLibraryReader,
  artistInfo,
} from '../model/aggregators/libraryReader/MusicLibraryReader';
import { ArtistCollection } from '../model/artists/ArtistCollection';
import {
  ConcertCollection,
  UniqueConcertLocation,
} from '../model/concerts/ConcertCollection';
import { SongkickReader } from '../model/aggregators/concertReader/SongkickReader';
import { Artist } from '../model/artists/Artist';
import { Concert } from '../model/concerts/Concert';

export interface UserConstraints {
  distanceRadius: number; // miles
  startDate: Date;
  endDate: Date;
}

export enum StreamingService {
  Spotify,
  AppleMusic,
}

interface Props {}

interface State {
  userConstraints: UserConstraints;
  filterDrawerOpen: boolean;
  libraryReader: MusicLibraryReader | null;
  concertCollection: ConcertCollection | null;
  artistCollection: ArtistCollection | null;
  // artists: Artist[];
}

export class Controller extends React.Component<Props, State> {
  // libraryReader: MusicLibraryReader | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      artistCollection: null,
      libraryReader: null,
      concertCollection: null,
      filterDrawerOpen: false,
      userConstraints: {
        distanceRadius: 2000,
        startDate: new Date(), // now, as default start
        endDate: new Date('2100-01-01'), // far in the future, as default end
      },
    };
  }

  componentDidMount() {
    // this is necessary because of the uri redirect after auth - our state gets wiped
    const streamingService = MusicLibraryReader.getStreamingService();
    // var libraryReader = null;
    // var artistsCollection = null;
    if (streamingService === StreamingService.Spotify) {
      const libraryReader = new SpotifyReader();
      libraryReader.getPreviewUri('2JFljHPanIjYy2QqfNYvC0').then((uri) => {
        console.log(uri);
      });
      // this.state = { ...this.state, libraryReader: libraryReader };
      this.setState({
        ...this.state,
        libraryReader: libraryReader,
      });
      // libraryReader
      //   .fetchArtists()
      //   .then((response: artistInfo[]) => console.log(response));

      // libraryReader.fetchArtists();
      const artistsCollection = new ArtistCollection(libraryReader);
      // artistsCollection.fillArtists().then((response) => {
      //   console.log(artistsCollection.artists);
      // });
      artistsCollection.fillArtists().then((artists) => {
        this.setState({
          ...this.state,
          artistCollection: artistsCollection,
        });
        const concertCollection = new ConcertCollection(new SongkickReader());
        concertCollection.fetchConcerts(artists).then((concerts) => {
          this.setState({
            ...this.state,
            concertCollection: concertCollection,
          });
        });
        // console.log(response);
        // const concertReader = new SongkickReader();
        // const concertCollection = new ConcertCollection(concertReader);
        // concertCollection.fetchConcerts(response).then((response) => {
        //   console.log(response);
        // });
      });
    } else if (streamingService === StreamingService.AppleMusic) {
      // todo
    } else {
      console.log('Not logged in');
    }
  }

  updateUserContstraints(newConstraints: UserConstraints) {
    this.setState({
      ...this.state,
      userConstraints: newConstraints,
    });
  }

  onStreamingServiceSelect = (reader: MusicLibraryReader): void => {
    this.setState({
      ...this.state,
      libraryReader: reader,
    });
  };

  getConcertLocations = (
    centerPoint: google.maps.LatLng
  ): UniqueConcertLocation[] => {
    let concertLocations: UniqueConcertLocation[] = [];
    if (this.state.concertCollection) {
      const { distanceRadius, startDate, endDate } = this.state.userConstraints;
      console.log(distanceRadius);
      concertLocations = this.state.concertCollection.getElligibleConcertLocations(
        distanceRadius,
        startDate,
        endDate,
        centerPoint
      );
    }

    return concertLocations;
  };

  public render(): JSX.Element {
    return (
      <div className="controller">
        <CustomHeader
          onFilterConstraintsSubmit={(constraints: UserConstraints): void => {
            console.log(constraints);
            this.updateUserContstraints(constraints);
          }}
          onStreamingServiceSelect={this.onStreamingServiceSelect}
        />
        <CustomMap
          // libraryReader={this.state.libraryReader}
          divId="map"
          // userConstraints={this.state.userConstraints}
          // artists={this.state.artists}
          getConcertLocations={this.getConcertLocations}
        />
      </div>
    );
  }
}
