import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { StreamingService } from './Controller';
import { MusicLibraryReader } from '../model/aggregators/libraryReader/MusicLibraryReader';
import { SpotifyReader } from '../model/aggregators/libraryReader/SpotifyReader';

interface Props {
  buttonClassName: string;
  onStreamingServiceSelect: (reader: MusicLibraryReader) => void;
}

export const ServiceSelectionMenu: React.FC<Props> = ({
  buttonClassName,
  onStreamingServiceSelect,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleServiceSelection = (service: StreamingService) => {
    handleClose();
    if (service === StreamingService.Spotify) {
      const spotifyReader = new SpotifyReader();
      spotifyReader.authenticate();

      onStreamingServiceSelect(spotifyReader);
      window.location.href = spotifyReader.authorizeUrl;
    } else if (service === StreamingService.AppleMusic) {
      // todo
    }
  };

  return (
    <div className="serviceSelectionMenu">
      <Button
        className={buttonClassName}
        variant="outlined"
        color="secondary"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        Choose Streaming Service
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            handleServiceSelection(StreamingService.Spotify);
          }}
        >
          Spotify
        </MenuItem>
        <MenuItem
          disabled={true}
          onClick={() => {
            handleServiceSelection(StreamingService.AppleMusic);
          }}
        >
          Apple Music
        </MenuItem>
      </Menu>
    </div>
  );
};
