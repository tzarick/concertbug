import React from 'react';
import { ServiceSelectionMenu } from './ServiceSelectionMenu';
import { UserConstraints } from './Controller';
import { Grid, Button } from '@material-ui/core';
import BugBannerPath from '../styles/images/CBLogo.png';
import GitHubLogoPath from '../styles/images/GHLogo.png';
import { FilterForm } from './FilterForm';
import { gridStyles } from '../styles/gridStyles';
import { MusicLibraryReader } from '../model/aggregators/libraryReader/MusicLibraryReader';

interface Props {
  onFilterConstraintsSubmit: (constraints: UserConstraints) => void;
  onStreamingServiceSelect: (reader: MusicLibraryReader) => void;
  onStatsQuery: () => void;
  userConstraints: UserConstraints;
}

export const CustomHeader: React.FC<Props> = ({
  onFilterConstraintsSubmit,
  onStreamingServiceSelect,
  onStatsQuery,
  userConstraints,
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
          console.log('nice logo click');
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
            onStreamingServiceSelect={onStreamingServiceSelect}
          />
        </Grid>
        <Grid className={classes.headerItem} item>
          <FilterForm
            filterButtonClass={classes.headerButton}
            userConstraints={userConstraints}
            onSubmit={onFilterConstraintsSubmit}
          />
        </Grid>
        <Grid className={classes.headerItem} item>
          <Button
            className={classes.headerButton}
            variant="outlined"
            color="secondary"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={onStatsQuery}
          >
            Stats
          </Button>
        </Grid>
      </Grid>
      <a href="https://github.com/tzarick/concertbug" target="_blank">
        <img
          className={classes.headerItem}
          src={GitHubLogoPath}
          alt="GitHub"
          height="45"
        />
      </a>
    </div>
  );
};
