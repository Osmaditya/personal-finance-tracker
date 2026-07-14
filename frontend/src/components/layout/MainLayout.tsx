import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import NotificationDrawer from './NotificationDrawer';

const MainLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Topbar />
      <Sidebar />
      <NotificationDrawer />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { xs: '100%', md: `calc(100% - 240px)` },
          mt: 8 // Space for topbar
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
