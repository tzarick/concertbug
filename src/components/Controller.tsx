import React, { Component } from 'react';
import { CustomMap } from './CustomMap';
import { UserForm } from './UserForm';

export interface UserConstraints {
  distanceRadius: number; // miles
  startDate: Date;
  endDate: Date;
}

interface Props {}

interface State {
  userConstraints: UserConstraints;
}

export class Controller extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
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
      userConstraints: newConstraints,
    });
  }

  public render(): JSX.Element {
    return (
      <div className="controller">
        <UserForm
          onSubmit={(constraints: UserConstraints): void => {
            console.log(constraints);
            this.updateUserContstraints(constraints);
          }}
        />
        <CustomMap divId="map" />
      </div>
    );
  }
}
