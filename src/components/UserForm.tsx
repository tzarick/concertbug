import React, { Component, useState } from 'react';
import { TextField, Button, Grid, Drawer } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import { UserConstraints } from './Controller';
import { gridStyles } from '../styles/gridStyles';

interface Props {
  // drawerOpen: boolean;
  onSubmit: (values: UserConstraints) => void;
  // updateDrawer: (open: boolean) => void;
}

interface State {
  drawerOpen: boolean;
}

function FormDrawer(
  onSubmit: (values: UserConstraints) => void,
  updateDrawer: (open: boolean) => void
): JSX.Element {
  // const classes = gridStyles();

  return (
    <Formik
      initialValues={{
        distanceRadius: 500,
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
              // className={classes.root}
              spacing={3}
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Grid item>
                <TextField
                  // className={classes.filter}
                  size="small"
                  placeholder="Distance Radius"
                  name="distanceRadius"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="number"
                />
              </Grid>
              <Grid item>
                <TextField
                  // className={classes.filter}
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
                  // className={classes.filter}
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
                  color="secondary"
                >
                  Go
                </Button>
              </div>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
}

export class UserForm extends React.Component<Props, State> {
  // const [state, setState] = useState({ drawerOpen: false });
  constructor(props: Props) {
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
          variant="contained"
          color="primary"
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
          {FormDrawer(this.props.onSubmit, this.updateDrawer)}
        </Drawer>
      </div>
    );
  }
}
