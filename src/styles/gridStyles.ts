import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// concert bug theme colors:
enum themeColors {
  red = '#E31D1A',
  grey = '#D4DBDD',
  black = '#000000',
  accent = '#ffebee',
}

export const gridStyles = makeStyles((theme: Theme) => {
  return createStyles({
    headerContainer: {
      flexGrow: 1,
      backgroundColor: themeColors.black,
      display: 'flex',
      // flexWrap: 'wrap',
      // justifyContent: 'space-around',
    },
    headerItem: {
      padding: theme.spacing(2),
      // flexWrap: 'nowrap',
      // transform: 'translateZ(0)',
      // backgroundColor: '#ffebee',
    },
    headerButton: {
      // marginLeft: theme.spacing(5),
      color: themeColors.grey,
    },
    formContainer: {
      flexGrow: 1,
    },
    filter: {
      padding: theme.spacing(2),
    },
    filterHeader: {
      backgroundColor: red[200],
      padding: theme.spacing(1),
      borderRadius: 15,
    },
    filterHeaderItem: {
      padding: theme.spacing(1),
    },
    menuButton: {
      color: themeColors.grey,
      // backgroundColor: themeColors.grey,
    },
  });
});
