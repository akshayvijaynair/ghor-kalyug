import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {AppBar, Toolbar, Typography, Box,} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
}));

const Header: React.FC = () => {


  return (
    <StyledAppBar position="sticky" elevation={0}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          Ghor Kalyug
        </Typography>
        <Box>
          <Typography
              variant="body1"
              component={RouterLink}
              to="/home"
              sx={{
                flexGrow: 1,
                textDecoration: 'none',
                color: 'white',
                fontWeight: 'bold',
                marginRight: 2
              }}
          >
            Generate Quiz
          </Typography>
          <Typography
              variant="body1"
              component={RouterLink}
              to="/"
              sx={{
                flexGrow: 1,
                textDecoration: 'none',
                color: 'white',
                fontWeight: 'bold',
              }}
          >
            Login
          </Typography>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;

