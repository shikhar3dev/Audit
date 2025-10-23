import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        gap: 2
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="text.secondary">
        Analyzing pages...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        This may take 30-60 seconds depending on page complexity
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
