import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
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
  Divider,
  CircularProgress,
  Fade,
  Zoom,
  Slide,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Google as GoogleIcon, 
  Facebook as FacebookIcon,
  GitHub as GitHubIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { login, currentUser } = useAuth();
  
  // Get the intended destination or default to home
  const from = location.state?.from?.pathname || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate(from, { replace: true });
    }
    setIsMounted(true);
    return () => setIsMounted(false);
  }, [currentUser, navigate, from]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        setError('');
        setSuccess('');
        setIsLoading(true);
        
        // Call the login function from AuthContext
        const result = await login(values.email, values.password);
        
        if (result.success) {
          setSuccess('Login successful! Redirecting...');
          
          // If remember me is checked, save to localStorage
          if (values.rememberMe) {
            localStorage.setItem('rememberedEmail', values.email);
          } else {
            localStorage.removeItem('rememberedEmail');
          }
          
          // Get the intended destination or default to home
          const redirectTo = location.state?.from?.pathname || '/';
          
          // Redirect to the intended destination or home page
          setTimeout(() => {
            navigate(redirectTo, { replace: true });
          }, 1000);
        } else {
          setError(result.message || 'Login failed. Please try again.');
          if (result.errors) {
            // Set field-specific errors if available
            Object.entries(result.errors).forEach(([field, msg]) => {
              setFieldError(field, msg);
            });
          }
        }
      } catch (err) {
        console.error('Login error:', err);
        setError(err.response?.data?.message || 
                err.message || 
                'An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
        setSubmitting(false);
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Load remembered email if exists
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail && isMounted) {
      formik.setFieldValue('email', rememberedEmail);
      formik.setFieldValue('rememberMe', true);
    }
  }, [isMounted]);

  const handleSocialLogin = (provider) => {
    // Handle social login logic here
    console.log(`Logging in with ${provider}`);
    // You would typically redirect to your backend's OAuth endpoint
    // window.location.href = `/api/auth/${provider}`;
  };

  if (!isMounted) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container 
      component="main" 
      maxWidth="sm"
      sx={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: 4
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ width: '100%' }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 2,
            width: '100%',
            background: theme.palette.background.paper,
            boxShadow: theme.shadows[3],
          }}
          component={motion.div}
          layoutId="login-form"
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to continue to your account
            </Typography>
          </Box>
          
          {error && (
            <Fade in={!!error}>
              <Alert 
                severity="error" 
                sx={{ 
                  width: '100%', 
                  mb: 3,
                  '& .MuiAlert-message': { width: '100%' }
                }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            </Fade>
          )}
          
          {success && (
            <Fade in={!!success}>
              <Alert 
                severity="success" 
                sx={{ 
                  width: '100%', 
                  mb: 3,
                  '& .MuiAlert-message': { width: '100%' }
                }}
              >
                {success}
              </Alert>
            </Fade>
          )}

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{ width: '100%' }}
          >
            <motion.div variants={itemVariants}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                sx={{ mb: 2 }}
                variant="outlined"
                InputProps={{
                  style: {
                    borderRadius: 12,
                  },
                }}
              />
              </motion.div>

              <motion.div variants={itemVariants}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  sx={{ mb: 1 }}
                  variant="outlined"
                  InputProps={{
                    style: { borderRadius: 12 },
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
              </motion.div>

              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                  mt: 1
                }}
                component={motion.div}
                variants={itemVariants}
              >
                <Box display="flex" alignItems="center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formik.values.rememberMe}
                    onChange={formik.handleChange}
                    style={{
                      width: 16,
                      height: 16,
                      marginRight: 8,
                      cursor: 'pointer',
                    }}
                  />
                  <Typography variant="body2" component="label" htmlFor="rememberMe" sx={{ cursor: 'pointer' }}>
                    Remember me
                  </Typography>
                </Box>
                <Link 
                  component={RouterLink} 
                  to="/forgot-password" 
                  variant="body2"
                  sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  Forgot password?
                </Link>
              </Box>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                  sx={{
                    mt: 2,
                    mb: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                    },
                  }}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </motion.div>

              <Box sx={{ textAlign: 'center', mb: 3 }} component={motion.div} variants={itemVariants}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link 
                    component={RouterLink} 
                    to="/register" 
                    sx={{ 
                      fontWeight: 600, 
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' } 
                    }}
                  >
                    Sign up
                  </Link>
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">OR</Typography>
              </Divider>

              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 2,
                  flexDirection: isMobile ? 'column' : 'row',
                  mb: 2
                }}
                component={motion.div}
                variants={itemVariants}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  onClick={() => handleSocialLogin('google')}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'text.primary',
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  Google
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GitHubIcon />}
                  onClick={() => handleSocialLogin('github')}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'text.primary',
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  GitHub
                </Button>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Container>
  );
};

export default Login;