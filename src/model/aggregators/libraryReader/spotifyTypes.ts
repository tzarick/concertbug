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

export interface SpotifyTopArtistsObject {
  items: [
    {
      images: {
        url: string;
      }[];
      name: string;
    }
  ];
}

// export type TopArtists = {
//   name: string;
//   image: string;
// };
