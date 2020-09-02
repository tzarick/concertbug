import React, { Component } from 'react';
import { CustomMap } from './CustomMap';

interface UserContraints {
  distanceRadius: number; // miles
  dateStart: Date;
  dateEnd: Date;
}

interface Props {}

interface State {
  userConstraints: UserContraints;
}

export class Controller extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      userConstraints: {
        distanceRadius: 50,
        dateStart: new Date(),
        dateEnd: new Date(),
      },
    };
  }

  componentDidMount() {
    const newConstraints = {
      distanceRadius: 50,
      dateStart: new Date(),
      dateEnd: new Date(),
    };
    setTimeout(() => {
      this.setState({ userConstraints: newConstraints });
    }, 5000);
  }

  public render(): JSX.Element {
    return <CustomMap divId="map" />;
  }
}
