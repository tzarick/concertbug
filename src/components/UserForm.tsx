import React, { Component, useState } from 'react';
import { TextField, Button, Grid, Drawer } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import { UserConstraints } from './Controller';

interface Props {
  drawerOpen: boolean;
  onSubmit: (values: UserConstraints) => void;
  updateDrawer: (open: boolean) => void;
}

interface State {}

function FormDrawer(onSubmit: (values: UserConstraints) => void): JSX.Element {
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
              direction="row"
              justify="flex-start"
              alignItems="baseline"
            >
              <div>
                <TextField
                  size="small"
                  placeholder="Distance Radius"
                  name="distanceRadius"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="number"
                />
              </div>
              <div>
                <TextField
                  helperText="Date Range Start"
                  placeholder="Date Range Start"
                  name="startDate"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="date"
                />
              </div>
              <div>
                <TextField
                  helperText="Date Range End"
                  placeholder="Date Range End"
                  name="endDate"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="date"
                />
              </div>
              <div>
                <Button type="submit" variant="contained" color="secondary">
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

// const toggleDrawer = (set, state, open) => (event) => {
//   if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
//     return;
//   }

//   set({ ...state, drawerOpen: open });
// };

export const UserForm: React.FC<Props> = ({
  onSubmit,
  drawerOpen,
  updateDrawer,
}) => {
  // const [state, setState] = useState({ drawerOpen: false });
  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          updateDrawer(true);
        }}
      >
        Add Filters
      </Button>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => {
          updateDrawer(false);
        }}
      >
        Helloooooo
      </Drawer>
    </div>
  );

  // <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
  //   {list(anchor)}
  // </Drawer>
  // FormDrawer(onSubmit);
};
