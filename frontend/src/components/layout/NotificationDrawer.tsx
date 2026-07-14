import React, { useEffect, useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  IconButton,
  Box,
  Divider,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setNotificationDrawerOpen } from '../../store/uiSlice';
import api from '../../api/axiosInstance';
import { format } from 'date-fns';

const NotificationDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isNotificationDrawerOpen } = useAppSelector((state) => state.ui);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (isNotificationDrawerOpen) {
      fetchNotifications();
    }
  }, [isNotificationDrawerOpen]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications/');
      setNotifications(response.data.results);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/read/`);
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, is_read: true } : notif))
      );
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isNotificationDrawerOpen}
      onClose={() => dispatch(setNotificationDrawerOpen(false))}
      sx={{
        '& .MuiDrawer-paper': { width: 350, bgcolor: 'background.paper' }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NotificationsIcon color="primary" />
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <IconButton onClick={() => dispatch(setNotificationDrawerOpen(false))}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ p: 0 }}>
        {notifications.length === 0 ? (
          <ListItem>
            <ListItemText primary="No new notifications." secondary="You're all caught up!" />
          </ListItem>
        ) : (
          notifications.map((notif) => (
            <ListItem
              key={notif.id}
              alignItems="flex-start"
              sx={{
                bgcolor: notif.is_read ? 'transparent' : 'rgba(99, 102, 241, 0.08)',
                cursor: 'pointer',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
              }}
              onClick={() => !notif.is_read && markAsRead(notif.id)}
            >
              <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                <WarningAmberIcon color={notif.type === 'budget_alert' ? 'warning' : 'info'} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: notif.is_read ? 400 : 600 }}>
                    {notif.message}
                  </Typography>
                }
                secondary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(notif.created_at), 'MMM dd, yyyy h:mm a')}
                    </Typography>
                    {!notif.is_read && <Chip size="small" label="New" color="primary" sx={{ height: 16, fontSize: '0.65rem' }} />}
                  </Box>
                }
              />
            </ListItem>
          ))
        )}
      </List>
    </Drawer>
  );
};

export default NotificationDrawer;
