import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

interface Props {
  buttonClassName: string;
}

export const ServiceSelectionMenu: React.FC<Props> = ({ buttonClassName }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
        <MenuItem onClick={handleClose}>Spotify</MenuItem>
        <MenuItem disabled={true} onClick={handleClose}>
          Apple Music
        </MenuItem>
      </Menu>
    </div>
  );
};
