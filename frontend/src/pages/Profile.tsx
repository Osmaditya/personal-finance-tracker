import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Grid, Alert, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../api/auth';
import { useAppDispatch } from '../store/hooks';
import { setUserProfile } from '../store/authSlice';

const profileSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
});

const passwordSchema = z.object({
  old_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(8, 'New password must be at least 8 characters'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const { register: registerProfile, handleSubmit: handleProfileSubmit, reset: resetProfile, formState: { errors: profileErrors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { username: '', email: '' }
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: passwordErrors } } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
        dispatch(setUserProfile(data));
        resetProfile({ username: data.username, email: data.email });
      } catch (error) {
        console.error('Failed to load profile', error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchProfile();
  }, [dispatch, resetProfile]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    setLoading(true);
    setProfileMsg(null);
    try {
      const updated = await authService.updateProfile(data);
      dispatch(setUserProfile(updated));
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setProfileMsg({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setLoading(true);
    setPasswordMsg(null);
    try {
      await authService.changePassword(data);
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      resetPassword();
    } catch (error: any) {
      setPasswordMsg({ type: 'error', text: error.response?.data?.old_password?.[0] || 'Failed to change password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>Profile Settings</Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>Public Profile</Typography>
              
              {profileMsg && <Alert severity={profileMsg.type} sx={{ mb: 3 }}>{profileMsg.text}</Alert>}
              
              {isFetching ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box component="form" onSubmit={handleProfileSubmit(onProfileSubmit)}>
                  <TextField
                    fullWidth
                    label="Username"
                    margin="normal"
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...registerProfile('username')}
                    error={!!profileErrors.username}
                    helperText={profileErrors.username?.message}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    margin="normal"
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...registerProfile('email')}
                    error={!!profileErrors.email}
                    helperText={profileErrors.email?.message}
                  />
                  <Button 
                    type="submit" 
                    variant="contained" 
                    sx={{ mt: 2 }}
                    disabled={loading}
                  >
                    Save Profile
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>Change Password</Typography>
              
              {passwordMsg && <Alert severity={passwordMsg.type} sx={{ mb: 3 }}>{passwordMsg.text}</Alert>}
              
              <Box component="form" onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  margin="normal"
                  {...registerPassword('old_password')}
                  error={!!passwordErrors.old_password}
                  helperText={passwordErrors.old_password?.message}
                />
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  margin="normal"
                  {...registerPassword('new_password')}
                  error={!!passwordErrors.new_password}
                  helperText={passwordErrors.new_password?.message}
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="warning"
                  sx={{ mt: 2 }}
                  disabled={loading}
                >
                  Change Password
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
