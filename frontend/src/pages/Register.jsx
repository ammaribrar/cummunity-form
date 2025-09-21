import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert as MuiAlert,
  Slide,
  Fade,
} from '@mui/material';
import { Visibility, VisibilityOff, CheckCircleOutline, ErrorOutline } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .matches(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores'
    )
    .required('Username is required'),
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

// Custom Alert component for notifications
const CustomAlert = React.forwardRef(function CustomAlert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success', // 'success', 'error', 'warning', 'info'
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  // Handle notification close
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  // Show success notification
  const showSuccess = (message) => {
    console.log('Showing success notification:', message);
    setNotification({
      open: true,
      message: message || 'Operation completed successfully!',
      severity: 'success',
    });  
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, open: false }));
    }, 5000);
  };

  // Show error notification
  const showError = (message) => {
    console.log('Showing error notification:', message);
    setNotification({
      open: true,
      message: message || 'An error occurred. Please try again.',
      severity: 'error',
    });
    // Auto-hide after 7 seconds for errors
    setTimeout(() => {
      setNotification(prev => ({ ...prev, open: false }));
    }, 7000);
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError, resetForm }) => {
      try {
        // Reset error state
        setError('');
        setLoading(true);
        
        console.log('Submitting registration form with values:', {
          ...values,
          password: '••••••' // Don't log actual password
        });
        
        // Call the register API
        const result = await register({
          username: values.username.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password,
        });
        
        console.log('Registration result:', result);
        
        if (result.success) {
          // Show success message
          const successMessage = result.message || 'Registration successful! Redirecting to login...';
          showSuccess(successMessage);
          
          // Reset form
          resetForm();
          
          // Redirect to login after a short delay
          setTimeout(() => {
            navigate('/login', { 
              state: { 
                registered: true,
                email: values.email
              } 
            });
          }, 2000);
          
        } else {
          // Handle validation errors
          if (result.errors) {
            console.log('Validation errors:', result.errors);
            
            // Map backend field names to form field names if needed
            const fieldMap = {
              'username': 'username',
              'email': 'email',
              'password': 'password'
            };
            
            // Set field errors
            Object.entries(result.errors).forEach(([field, messages]) => {
              const formField = fieldMap[field] || field;
              if (Array.isArray(messages)) {
                setFieldError(formField, messages[0]); // Show first error message
              } else if (typeof messages === 'string') {
                setFieldError(formField, messages);
              } else if (messages && typeof messages === 'object') {
                setFieldError(formField, Object.values(messages)[0]);
              }
            });
            
            // Show general error message
            showError('Please fix the errors in the form.');
            
          } else {
            // Handle other types of errors
            const errorMessage = result.message || 'Registration failed. Please try again.';
            setError(errorMessage);
            showError(errorMessage);
          }
        }
        
      } catch (error) {
        console.error('Registration error:', error);
        
        // Handle different types of errors
        let errorMessage = 'An unexpected error occurred. Please try again.';
        
        if (error.message) {
          errorMessage = error.message;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.errors) {
          errorMessage = Object.values(error.errors)[0];
        }
        
        setError(errorMessage);
        showError(errorMessage);
        
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Container component="main" maxWidth="sm">
      {/* Success/Error Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Slide}
      >
        <CustomAlert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          icon={notification.severity === 'success' ? 
            <CheckCircleOutline fontSize="inherit" /> : 
            <ErrorOutline fontSize="inherit" />
          }
          sx={{
            minWidth: '300px',
            '& .MuiAlert-message': {
              display: 'flex',
              alignItems: 'center',
            },
          }}
        >
          {notification.message}
        </CustomAlert>
      </Snackbar>

      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Typography component="h1" variant="h5">
          Create your account
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{ mt: 1, width: '100%' }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="new-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            autoComplete="new-password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.confirmPassword &&
              Boolean(formik.errors.confirmPassword)
            }
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" variant="body2">
                Sign In
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
