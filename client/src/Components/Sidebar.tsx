import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  ListItemButton,
  Divider,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored user session data
    localStorage.removeItem('token'); 
    sessionStorage.clear();

    navigate('/');
  };

  return (
    <Box
      sx={{
        width: 250,
        bgcolor: '#7C4DFF',
        height: '100vh',
        color: 'white',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Top Section */}
      <Box>
        <Box sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            Ghor Kalyug
          </Typography>
          <Box
            component="img"
            src="/icon.png" // Path to your image
            alt="Logo"
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%', // Optional: Makes the image circular
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Adds a subtle shadow
            }}
          />
        </Box>

        <List>
          <ListItem disablePadding>
            <ListItemButton
              selected={activeTab === 'overview'}
              onClick={() => onTabChange('overview')}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Overview" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={activeTab === 'generate'}
              onClick={() => onTabChange('generate')}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <AddCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Generate Quiz" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Bottom Section - Logout */}
      <Box>
        <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );
};

export default Sidebar;
