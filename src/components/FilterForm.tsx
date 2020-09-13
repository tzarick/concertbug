import React from 'react';
import { Form, Formik } from 'formik';
import { UserConstraints } from './Controller';
import { gridStyles } from '../styles/gridStyles';
import { Button, Drawer, Grid, TextField } from '@material-ui/core';
import FilterTiltShiftRoundedIcon from '@material-ui/icons/FilterTiltShiftRounded';
import RefreshRoundedIcon from '@material-ui/icons/RefreshRounded';

interface FilterFormProps {
  onSubmit: (values: UserConstraints) => void;
  filterButtonClass: string;
}

interface DrawerProps {
  onSubmit: (values: UserConstraints) => void;
  updateDrawer: (open: boolean) => void;
}

interface FilterFormState {
  drawerOpen: boolean;
}

const FormDrawer: React.FC<DrawerProps> = ({
  onSubmit,
  updateDrawer,
}): JSX.Element => {
  const classes = gridStyles();

  return (
    <Formik
      initialValues={{
        distanceRadius: 2000,
        startDate: new Date(),
        endDate: new Date('2100-01-01'),
      }}
      onSubmit={(values) => {
        onSubmit(values);
      }}
    >
      {({ values, handleChange, handleBlur }) => {
        return (
          <Form>
            <Grid
              container
              className={classes.formContainer}
              spacing={4}
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Grid item>
                <Grid
                  container
                  className={classes.filterHeader}
                  justify="center"
                  alignItems="center"
                  spacing={3}
                >
                  <h3 className={classes.filterHeaderItem}>Custom Filters</h3>
                  <FilterTiltShiftRoundedIcon
                    className={classes.filterHeaderItem}
                  />
                </Grid>
              </Grid>
              <Grid item>
                <TextField
                  className={classes.filter}
                  size="small"
                  placeholder="Distance Radius (mi)"
                  name="distanceRadius"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="number"
                />
              </Grid>
              <Grid item>
                <TextField
                  className={classes.filter}
                  helperText="Date Range Start"
                  placeholder="Date Range Start"
                  name="startDate"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="date"
                />
              </Grid>
              <Grid item>
                <TextField
                  className={classes.filter}
                  helperText="Date Range End"
                  placeholder="Date Range End"
                  name="endDate"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="date"
                />
              </Grid>
              <div>
                <Button
                  onClick={() => {
                    updateDrawer(false);
                  }}
                  type="submit"
                  variant="contained"
                  endIcon={<RefreshRoundedIcon />}
                >
                  Update
                </Button>
              </div>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export class FilterForm extends React.Component<
  FilterFormProps,
  FilterFormState
> {
  constructor(props: FilterFormProps) {
    super(props);
    this.state = {
      drawerOpen: false,
    };
  }

  updateDrawer = (open: boolean): void => {
    this.setState({
      drawerOpen: open,
    });
  };

  render(): JSX.Element {
    return (
      <div>
        <Button
          className={this.props.filterButtonClass}
          variant="outlined"
          color="secondary"
          onClick={() => {
            this.updateDrawer(true);
          }}
        >
          Add Filters
        </Button>
        <Drawer
          anchor="left"
          open={this.state.drawerOpen}
          onClose={() => {
            this.updateDrawer(false);
          }}
        >
          <FormDrawer
            onSubmit={this.props.onSubmit}
            updateDrawer={this.updateDrawer}
          />
        </Drawer>
      </div>
    );
  }
}
