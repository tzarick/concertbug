import { Grid } from '@material-ui/core';
import React from 'react';

interface Props {}

export const CustomHeader: React.FC<Props> = ({}) => {
  return (
    <Grid container direction="row" justify="flex-start" alignItems="baseline">
      <div>HELLO</div>
      <div>OK</div>
    </Grid>
  );
};
