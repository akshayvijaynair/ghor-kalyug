import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
} from '@mui/material';

const Overview: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: '#F8F9FE',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Quizzes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No quizzes generated yet
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: '#F8F9FE',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Statistics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start generating quizzes to see your statistics
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview;

