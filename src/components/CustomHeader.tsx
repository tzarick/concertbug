import { Grid, Button } from '@material-ui/core';
import React from 'react';
import BugBannerPath from '../styles/images/CBLogo.png';
import { FilterForm } from './UserForm';
import { UserConstraints } from './Controller';
import { gridStyles } from '../styles/gridStyles';

interface Props {
  // updateDrawer: (open: boolean) => void;
  onFilterConstraintsSubmit: (constraints: UserConstraints) => void;
}

export const CustomHeader: React.FC<Props> = ({
  onFilterConstraintsSubmit,
}) => {
  const classes = gridStyles();

  return (
    <Grid
      container
      spacing={2}
      direction="row"
      justify="flex-start"
      alignItems="center"
      className={classes.headerContainer}
    >
      <Grid item>
        <img
          className={classes.headerItem}
          src={BugBannerPath}
          alt="Concert Bug"
          height="45"
        />
      </Grid>
      <Grid item>
        <Button className={classes.headerItem} variant="contained">
          Spotify
        </Button>
      </Grid>
      <Grid className={classes.headerItem} item>
        <FilterForm onSubmit={onFilterConstraintsSubmit} />
      </Grid>
    </Grid>
  );
};
