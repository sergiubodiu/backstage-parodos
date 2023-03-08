import React from 'react';
import { ObjectFieldTemplateProps } from '@rjsf/core';
import { Box, Grid } from '@material-ui/core';

export function FluidLayout(props: ObjectFieldTemplateProps): JSX.Element {
  const { properties, description, title } = props;
  return (
    <Box marginBottom={5}>
      <h1>{title}</h1>
      <Grid container spacing={3}>
        {properties.map(prop => (
          <Grid item xs={12} md={6} lg={4} key={prop.content.key}>
            {prop.content}
          </Grid>
        ))}
      </Grid>
      {description}
    </Box>
  );
}
