import React, { Component } from 'react';
import { CustomMap } from './CustomMap';

export class Controller extends React.Component {
  public render() {
    return <CustomMap divId="map" />;
  }
}
