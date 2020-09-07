import React, { Component } from 'react';
import { CustomMap } from './CustomMap';
import { CustomHeader } from './CustomHeader';
import { SpotifyReader } from '../model/aggregators/libraryReader/SpotifyReader';
import { MusicLibraryReader } from '../model/aggregators/libraryReader/MusicLibraryReader';

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
    this.state = {
      libraryReader: null,
      filterDrawerOpen: false,
      userConstraints: {
        distanceRadius: 500,
        startDate: new Date(), // now, as default start
        endDate: new Date('2100-01-01'), // far in the future, as default end
      },
    };
  }

  componentDidMount() {
    // const newConstraints = {
    //   distanceRadius: 50,
    //   dateStart: new Date(),
    //   dateEnd: new Date(),
    // };
    // setTimeout(() => {
    //   this.setState({ userConstraints: newConstraints });
    // }, 5000);
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

  public render(): JSX.Element {
    if (this.state.libraryReader) {
      // user has already logged in successfully
      console.log('asdf');
      console.log('logged in');
    } else {
      console.log(MusicLibraryReader.getHashParams());
      console.log('not logged in');
    }
    return (
      <div className="controller">
        <CustomHeader
          onFilterConstraintsSubmit={(constraints: UserConstraints): void => {
            console.log(constraints);
            this.updateUserContstraints(constraints);
          }}
          onStreamingServiceSelect={this.onStreamingServiceSelect}
        />
        <CustomMap divId="map" />
      </div>
    );
  }
}
