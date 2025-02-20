import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { signInWithEmailAndPassword, sendPasswordResetEmail, fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setError(location.state.message);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
  
    // Add input validation
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }
  
    try {
      // Log the attempt (without password)
      console.log('Attempting sign in with email:', formData.email);
  
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        formData.email.trim(), // Trim whitespace
        formData.password
      );
  
      console.log('Sign in successful:', userCredential.user.email);
      setSuccess(true);
      navigate(location.state?.from || '/');
  
    } catch (error) {
      console.error('Sign in error:', error.code, error.message);
      
      // Provide user-friendly error messages
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Please enter a valid email address');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later');
          break;
        default:
          setError('Failed to sign in. Please check your credentials and try again');
      }
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = async () => {
    if (!resetEmail) return;
    
    setResetLoading(true);
    try {
      // First check if the email exists
      const methods = await fetchSignInMethodsForEmail(auth, resetEmail);
      
      if (!methods || methods.length === 0) {
        // Email is not registered
        setSnackbarMessage('This email is not registered. Please sign up first.');
        setSnackbarOpen(true);
        setResetDialogOpen(false);
        setResetEmail('');
        setResetLoading(false);
        return;
      }

      // Only if email exists, try to send reset link
      try {
        await sendPasswordResetEmail(auth, resetEmail);
        setSnackbarMessage('Password reset email sent! Check your inbox.');
        setSnackbarOpen(true);
        setResetDialogOpen(false);
        setResetEmail('');
      } catch (resetError) {
        setSnackbarMessage('Failed to send reset email. Please try again.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'An error occurred. Please try again.';
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'This email is not registered. Please sign up first.';
          break;
        default:
          errorMessage = 'An error occurred. Please try again.';
      }
      
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setResetLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, mb: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <Typography component="h1" variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 600, color: 'primary.main' }}>
            Sign In
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>Successfully logged in! Redirecting...</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Link component={RouterLink} to="/register" variant="body2" color="primary">Don't have an account? Sign Up</Link>
              <Link component="button" variant="body2" color="primary" onClick={() => setResetDialogOpen(true)}>Forgot password?</Link>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Enter your email"
            type="email"
            fullWidth
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleForgotPassword} disabled={resetLoading}>Send Reset Email</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default Login;
