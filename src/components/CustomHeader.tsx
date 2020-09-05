import { Grid, Button } from '@material-ui/core';
import React from 'react';
import BugBannerPath from '../styles/images/CBLogo.png';
import { FilterForm } from './UserForm';
import { UserConstraints } from './Controller';

interface Props {
  // updateDrawer: (open: boolean) => void;
  onFilterConstraintsSubmit: (constraints: UserConstraints) => void;
}

export const CustomHeader: React.FC<Props> = ({
  onFilterConstraintsSubmit,
}) => {
  return (
    <Grid container direction="row" justify="flex-start" alignItems="baseline">
      <Grid item>
        <img src={BugBannerPath} alt="Concert Bug" />
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary">
          Spotify
        </Button>
      </Grid>
      <Grid item>
        <FilterForm onSubmit={onFilterConstraintsSubmit} />
      </Grid>
    </Grid>
  );
};
