import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const gridStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      flexGrow: 1,
    },
    filter: {
      padding: theme.spacing(8),
    },
  });
});
