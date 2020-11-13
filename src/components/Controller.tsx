import React from 'react';
import LoadingOverlay from 'react-loading-overlay';
import { CustomMap } from './CustomMap';
import { CustomHeader } from './CustomHeader';
import { SpotifyReader } from '../model/aggregators/libraryReader/SpotifyReader';
import { MusicLibraryReader } from '../model/aggregators/libraryReader/MusicLibraryReader';
import { ArtistCollection } from '../model/artists/ArtistCollection';
import {
  ConcertCollection,
  UniqueConcertLocation,
} from '../model/concerts/ConcertCollection';
import { SongkickReader } from '../model/aggregators/concertReader/SongkickReader';

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
  loaderActive: boolean;
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
      loaderActive: false,
      userConstraints: {
        distanceRadius: 300, // 300 mi default
        startDate: new Date(), // now, as default start
        endDate: new Date('2100-01-01'), // far in the future, as default end
      },
    };
  }

  componentDidMount() {
    // this is necessary because of the uri redirect after auth - our state gets wiped
    const streamingService = MusicLibraryReader.getStreamingService();

    if (streamingService === StreamingService.Spotify) {
      const libraryReader = new SpotifyReader();

      this.setState({
        ...this.state,
        libraryReader: libraryReader,
      });

      const artistsCollection = new ArtistCollection(libraryReader);

      this.updateLoader(true);
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
          this.updateLoader(false);
        });
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
  ): UniqueConcertLocation[] | null => {
    let concertLocations: UniqueConcertLocation[] | null = null;
    if (this.state.concertCollection) {
      const { distanceRadius, startDate, endDate } = this.state.userConstraints;

      concertLocations = this.state.concertCollection.getElligibleConcertLocations(
        distanceRadius,
        startDate,
        endDate,
        centerPoint
      );
    }

    return concertLocations;
  };

  updateLoader = (loaderState: boolean) => {
    console.log('loader change: ' + loaderState);
    this.setState({
      ...this.state,
      loaderActive: loaderState,
    });
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
          userConstraints={this.state.userConstraints}
        />
        <LoadingOverlay
          active={this.state.loaderActive}
          spinner
          styles={{
            spinner: (base: any) => ({
              ...base,
              width: '100px',
              '& svg circle': {
                stroke: 'rgba(255, 0, 0, 0.5)',
              },
            }),
            content: (base: any) => ({
              ...base,
              color: '#E31D1A',
            }),
          }}
          text="Beep Boop...Analyzing your music brain..."
        ></LoadingOverlay>
        <CustomMap divId="map" getConcertLocations={this.getConcertLocations} />
      </div>
    );
  }
}
