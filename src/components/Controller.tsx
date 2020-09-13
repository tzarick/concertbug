import React, { Component } from 'react';
import { CustomMap } from './CustomMap';
import { CustomHeader } from './CustomHeader';
import { SpotifyReader } from '../model/aggregators/libraryReader/SpotifyReader';
import {
  MusicLibraryReader,
  artistInfo,
} from '../model/aggregators/libraryReader/MusicLibraryReader';
import { ArtistCollection } from '../model/artists/ArtistCollection';
import { ConcertCollection } from '../model/concerts/ConcertCollection';
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
}

export class Controller extends React.Component<Props, State> {
  // libraryReader: MusicLibraryReader | null = null;

  constructor(props: Props) {
    super(props);
    // this is necessary because of the uri redirect after auth - our state gets wiped
    const streamingService = MusicLibraryReader.getStreamingService();
    var libraryReader = null;
    if (streamingService === StreamingService.Spotify) {
      libraryReader = new SpotifyReader();
      // libraryReader
      //   .fetchArtists()
      //   .then((response: artistInfo[]) => console.log(response));

      // libraryReader.fetchArtists();
      const artistsCollection = new ArtistCollection(libraryReader);
      // artistsCollection.fillArtists().then((response) => {
      //   console.log(artistsCollection.artists);
      // });
      artistsCollection.fillArtists().then((response) => {
        console.log(response);
        const concertReader = new SongkickReader();
        const concertCollection = new ConcertCollection(concertReader);
        concertCollection.fetchConcerts(response).then((response) => {
          console.log(response);
        });
      });
    } else if (streamingService === StreamingService.AppleMusic) {
      // todo
    } else {
      console.log('Not logged in');
    }

    this.state = {
      libraryReader: libraryReader,
      filterDrawerOpen: false,
      userConstraints: {
        distanceRadius: 2000,
        startDate: new Date(), // now, as default start
        endDate: new Date('2100-01-01'), // far in the future, as default end
      },
    };
  }

  componentDidMount() {}

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
        <CustomMap libraryReader={this.state.libraryReader} divId="map" />
      </div>
    );
  }
}
