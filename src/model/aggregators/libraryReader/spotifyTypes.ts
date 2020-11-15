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

export interface SpotifyPlaylistsObject {
  items: [
    {
      id: string;
      name: string;
      collaborative: boolean;
      owner: {
        id: string;
      };
    }
  ];
  total: number;
}

export interface SpotifyUserDetailsObject {
  id: string;
}

// export type TopArtists = {
//   name: string;
//   image: string;
// };
