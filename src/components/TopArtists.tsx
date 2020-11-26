import React from 'react';
import { Grid } from '@material-ui/core';

export const getTopArtistsDisplay = (
  artistInfo: { name: string; image: string }[]
): JSX.Element => {
  // add position value
  const artistInfoUpdated = artistInfo.map((item, i) => {
    return {
      ...item,
      position: i,
    };
  });
  const emojis = ['😍', '🤩', '😘', '😀', '🙂', '🙃', '⭐']; // most excited faces -> slightly less excited faces

  const middle = Math.floor(artistInfoUpdated.length / 2);
  const firstHalf = artistInfoUpdated.slice(0, middle);
  const secondHalf = artistInfoUpdated.slice(middle, artistInfoUpdated.length);
  return (
    <Grid
      container
      spacing={2}
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Grid
        container
        spacing={2}
        direction="row"
        justify="center"
        alignItems="center"
      >
        {firstHalf.map((item) =>
          TopArtist(
            item,
            item.position < emojis.length ? emojis[item.position] : ''
          )
        )}
      </Grid>
      <Grid
        container
        spacing={2}
        direction="row"
        justify="center"
        alignItems="center"
      >
        {secondHalf.map((item) =>
          TopArtist(
            item,
            item.position < emojis.length ? emojis[item.position] : ''
          )
        )}
      </Grid>
    </Grid>
  );
};

const TopArtist = (
  artistInfo: {
    name: string;
    image: string;
    position: number;
  },
  emoji: string
): JSX.Element => {
  return (
    <Grid key={artistInfo.position + 1} item>
      <h3>{`${artistInfo.position + 1}. ${emoji} ${artistInfo.name}`}</h3>
      <img
        src={artistInfo.image}
        alt={`Pictured: ${artistInfo.name}`}
        // width="500"
        height="200"
      ></img>
    </Grid>
  );
};
