import React from "react";
import { Grid, Button, Link } from "@mui/material";

export default function Error404() {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <h1>404 Not Found</h1>
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" to="/" component={Link}>
          Back to Home
        </Button>
      </Grid>
    </Grid>
  );
}
