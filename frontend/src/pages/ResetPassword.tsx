import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, CircularProgress, Link as MuiLink } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../api/auth';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

const resetPasswordSchema = z.object({
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!uid || !token) {
      setMsg({ type: 'error', text: 'Invalid password reset link. Please request a new one.' });
      return;
    }
    
    setLoading(true);
    setMsg(null);
    try {
      await authService.confirmPasswordReset({
        uid,
        token,
        new_password: data.new_password
      });
      setMsg({ type: 'success', text: 'Password has been reset successfully! Redirecting...' });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.detail || 'Failed to reset password. The link may have expired.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Card sx={{ maxWidth: 400, width: '100%', p: 2, backdropFilter: 'blur(10px)', bgcolor: 'rgba(30, 41, 59, 0.7)' }}>
        <CardContent>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
              Reset Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your new password below.
            </Typography>
          </Box>
          
          {(!uid || !token) && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              Invalid or missing reset token in the URL.
            </Alert>
          )}
          
          {msg && <Alert severity={msg.type} sx={{ mb: 3 }}>{msg.text}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              variant="outlined"
              margin="normal"
              {...register('new_password')}
              error={!!errors.new_password}
              helperText={errors.new_password?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || !uid || !token}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Reset Password'}
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Remember your password?{' '}
                <MuiLink component={Link} to="/login" color="primary" sx={{ fontWeight: 600, textDecoration: 'none' }}>
                  Sign in
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResetPassword;
