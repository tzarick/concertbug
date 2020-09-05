import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

export const gridStyles = makeStyles((theme: Theme) => {
  return createStyles({
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
