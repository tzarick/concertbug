import React, { Component } from 'react';
import { TextField, Button } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import { UserConstraints } from './Controller';

interface Props {
  onSubmit: (values: UserConstraints) => void;
}

export const UserForm: React.FC<Props> = ({ onSubmit }) => {
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
              <Button type="submit" variant="contained" color="primary">
                Go
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
