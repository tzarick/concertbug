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
import { getTopArtistsDisplay } from './TopArtists';
import { AlertDialogDispatcher } from './AlertDialogDispatcher';

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
  alerts: {
    doneReading: boolean;
    notLoggedIn: boolean;
    stats: boolean;
  };
  topArtistInfo: {
    name: string;
    image: string;
  }[];
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
      alerts: {
        // alert windows
        doneReading: false,
        notLoggedIn: false,
        stats: false,
      },
      topArtistInfo: [],
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
          this.setState({
            ...this.state,
            alerts: {
              ...this.state.alerts,
              doneReading: true,
            },
          });
        });
      });
    } else if (streamingService === StreamingService.AppleMusic) {
      // todo
    } else {
      console.log('Not logged in');
    }
  }

  getGreeting = (): string => {
    const greetings = [
      'Wow you have good taste.',
      'Lovely library you have there.',
      'Thanks for waiting.',
    ];

    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
  };

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

  displayTopArtists = async () => {
    if (this.state.artistCollection) {
      const topArtistInfo = await this.state.artistCollection.getTopArtists(5);
      console.log(topArtistInfo);
      this.setState({
        ...this.state,
        alerts: {
          ...this.state.alerts,
          stats: true,
        },
        topArtistInfo: topArtistInfo,
      });
    } else {
      window.alert('Try selecting a streaming service first');
    }
  };

  statsRequested = (requested: boolean) => {
    this.setState({
      ...this.state,
      alerts: {
        ...this.state.alerts,
        stats: requested,
      },
    });
  };

  isDoneReading = (done: boolean) => {
    this.setState({
      ...this.state,
      alerts: {
        ...this.state.alerts,
        doneReading: done,
      },
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
          onStatsQuery={this.displayTopArtists}
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
          text="...analyzing...beep boop..."
        ></LoadingOverlay>
        <AlertDialogDispatcher
          getGreeting={this.getGreeting}
          doneReading={this.state.alerts.doneReading}
          isDoneReading={this.isDoneReading}
          topArtistsDisplay={getTopArtistsDisplay(this.state.topArtistInfo)}
          statsState={this.state.alerts.stats}
          statsRequested={this.statsRequested}
        />
        <CustomMap divId="map" getConcertLocations={this.getConcertLocations} />
      </div>
    );
  }
}
