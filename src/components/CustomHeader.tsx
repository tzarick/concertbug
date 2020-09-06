import React from 'react';
import { ServiceSelectionMenu } from './ServiceSelectionMenu';
import { UserConstraints } from './Controller';
import { Grid } from '@material-ui/core';
import BugBannerPath from '../styles/images/CBLogo.png';
import { FilterForm } from './FilterForm';
import { gridStyles } from '../styles/gridStyles';

interface Props {
  onFilterConstraintsSubmit: (constraints: UserConstraints) => void;
}

export const CustomHeader: React.FC<Props> = ({
  onFilterConstraintsSubmit,
}) => {
  const classes = gridStyles();

  return (
    <div className={classes.headerContainer}>
      <img
        className={classes.headerItem}
        src={BugBannerPath}
        alt="Concert Bug"
        height="45"
        onClick={() => {
          console.log('logo click');
        }}
      />
      <Grid
        container
        spacing={2}
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item>
          <ServiceSelectionMenu
            buttonClassName={`${classes.headerItem} ${classes.menuButton}`}
          />
        </Grid>
        <Grid className={classes.headerItem} item>
          <FilterForm
            filterButtonClass={classes.headerButton}
            onSubmit={onFilterConstraintsSubmit}
          />
        </Grid>
      </Grid>
    </div>
  );
};
