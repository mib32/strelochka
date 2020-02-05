import React from 'react';
import { Paper, Typography, Button, Grid } from '@material-ui/core';

export default function GoogleFormButton(props) {
  return(<Button
    {...props}
    variant="contained"
    href="https://docs.google.com/forms/d/e/1FAIpQLSc2OCsJC3OXN7Yih5bOdAT4gzAJE_jZIvvMyMcNAgvBBcMWow/viewform?usp=sf_link"
    rel="noopener noreferrer"
    target="_blank"
  >{props.children}</Button>)
}
