import React from 'react';
import { Typography, Container } from '@mui/material';

const ErrorPage = () => (
  <Container>
    <Typography variant="h3" color="error">Something went wrong</Typography>
    <Typography>Please try again later.</Typography>
  </Container>
);

export default ErrorPage;
