export interface SpotifyTrackObject {
  track: {
    artists: [
      {
        name: string;
        id: string;
      }
    ];
  };
}

export interface SpotifyTopTracksObject {
  tracks: [
    {
      uri: string;
    }
  ];
}
