import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {AppBar, Toolbar, Typography, Button, Box,} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  marginLeft: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
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
          <NavButton component={RouterLink} to="/home">
            Home
          </NavButton>
          <NavButton component={RouterLink} to="/">
            Login
          </NavButton>
          <NavButton component={RouterLink} to="/register">
            Register
          </NavButton>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;

