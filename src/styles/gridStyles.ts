import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

export const gridStyles = makeStyles((theme: Theme) => {
  return createStyles({
    headerContainer: {
      flexGrow: 1,
      backgroundColor: '#000000',
    },
    headerItem: {
      padding: theme.spacing(2),
      // backgroundColor: '#ffebee',
    },
    formContainer: {
      flexGrow: 1,
    },
    filter: {
      padding: theme.spacing(2),
    },
    filterHeader: {
      backgroundColor: '#ffebee',
      padding: theme.spacing(1),
      borderRadius: 15,
    },
    filterHeaderItem: {
      padding: theme.spacing(1),
    },
  });
});
