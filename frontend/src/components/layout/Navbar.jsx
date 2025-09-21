import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Tooltip,
  Container,
  Badge,
  useScrollTrigger,
  Slide,
  alpha,
  Divider,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Home as HomeIcon,
  Add as AddIcon,
  Leaderboard as LeaderboardIcon,
  AccountCircle,
  ExitToApp,
  Person,
  Menu as MenuIcon,
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Hide app bar on scroll
export function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Track scroll position for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setAnchorEl(null);
  }, [location]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Leaderboard', path: '/leaderboard', icon: <LeaderboardIcon /> }
  ];

  return (
    <>
      <HideOnScroll>
        <AppBar 
          position="fixed" 
          elevation={scrolled ? 4 : 0}
          sx={{
            background: scrolled 
              ? alpha(theme.palette.background.paper, 0.8) 
              : 'transparent',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            borderBottom: scrolled 
              ? `1px solid ${theme.palette.divider}` 
              : '1px solid transparent',
          }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ minHeight: '70px' }}>
              {/* Logo/Brand */}
              <Box 
                component={RouterLink} 
                to="/"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  mr: { xs: 2, md: 4 },
                }}
              >
                <Box 
                  component="img"
                  src="/logo.png"
                  alt="Logo"
                  sx={{
                    height: 32,
                    width: 'auto',
                    mr: 1,
                    display: { xs: 'none', sm: 'block' },
                  }}
                />
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    mr: 2,
                    fontWeight: 700,
                    color: 'primary.main',
                    textDecoration: 'none',
                    background: theme.palette.mode === 'dark' 
                      ? 'linear-gradient(45deg, #4361ee, #4cc9f0)'
                      : 'linear-gradient(45deg, #3a0ca3, #4361ee)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    letterSpacing: '0.5px',
                  }}
                >
                  AI Community
                </Typography>
              </Box>

              {/* Desktop Navigation */}
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {navLinks.map((link) => (
                  <Button
                    key={link.path}
                    component={RouterLink}
                    to={link.path}
                    startIcon={link.icon}
                    sx={{
                      my: 2,
                      color: location.pathname === link.path 
                        ? 'primary.main' 
                        : 'text.primary',
                      fontWeight: location.pathname === link.path ? 600 : 400,
                      '&:hover': {
                        color: 'primary.main',
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      },
                      mx: 0.5,
                      borderRadius: 2,
                      px: 2,
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>

              {/* Desktop Auth Buttons */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                {isAuthenticated ? (
                  <>
                    <Tooltip title="Create Post">
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        component={RouterLink}
                        to="/create-post"
                        sx={{
                          borderRadius: 2,
                          px: 3,
                          py: 1,
                          textTransform: 'none',
                          fontWeight: 600,
                          boxShadow: '0 4px 14px 0 rgba(67, 97, 238, 0.3)',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px 0 rgba(67, 97, 238, 0.4)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        New Post
                      </Button>
                    </Tooltip>

                    <Tooltip title="Notifications">
                      <IconButton
                        size="large"
                        color="inherit"
                        sx={{
                          position: 'relative',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          },
                        }}
                      >
                        <Badge badgeContent={4} color="error">
                          <NotificationsIcon />
                        </Badge>
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Account">
                      <IconButton
                        onClick={handleMenu}
                        size="small"
                        sx={{
                          p: 0,
                          ml: 1,
                          border: `2px solid ${theme.palette.primary.main}`,
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Avatar 
                          alt={currentUser?.username || 'User'} 
                          src={currentUser?.avatar} 
                          sx={{ 
                            width: 36, 
                            height: 36,
                            border: `2px solid ${theme.palette.background.paper}`,
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Button
                      component={RouterLink}
                      to="/login"
                      sx={{
                        color: 'text.primary',
                        fontWeight: 500,
                        px: 2,
                        '&:hover': {
                          color: 'primary.main',
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        },
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/register"
                      variant="contained"
                      color="primary"
                      sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: '0 4px 14px 0 rgba(67, 97, 238, 0.3)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px 0 rgba(67, 97, 238, 0.4)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </Box>

              {/* Mobile menu button */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto' }}>
                <IconButton
                  size="large"
                  aria-label="menu"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={toggleMobileMenu}
                  color="inherit"
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    backgroundColor: mobileMenuOpen 
                      ? alpha(theme.palette.primary.main, 0.1) 
                      : 'transparent',
                  }}
                >
                  {mobileMenuOpen ? (
                    <CloseIcon />
                  ) : (
                    <MenuIcon />
                  )}
                </IconButton>
              </Box>
            </Toolbar>
          </Container>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
              >
                <Box 
                  sx={{ 
                    p: 2, 
                    borderTop: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  {navLinks.map((link) => (
                    <Button
                      key={link.path}
                      component={RouterLink}
                      to={link.path}
                      fullWidth
                      startIcon={link.icon}
                      sx={{
                        justifyContent: 'flex-start',
                        px: 3,
                        py: 1.5,
                        my: 0.5,
                        borderRadius: 2,
                        color: location.pathname === link.path 
                          ? 'primary.main' 
                          : 'text.primary',
                        fontWeight: location.pathname === link.path ? 600 : 400,
                        backgroundColor: location.pathname === link.path 
                          ? alpha(theme.palette.primary.main, 0.1) 
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        },
                      }}
                    >
                      {link.label}
                    </Button>
                  ))}

                  {isAuthenticated ? (
                    <>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        component={RouterLink}
                        to="/create-post"
                        sx={{
                          mt: 2,
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        New Post
                      </Button>
                      
                      <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                        <Button
                          fullWidth
                          component={RouterLink}
                          to={`/profile/${currentUser?.username}`}
                          startIcon={<Person />}
                          sx={{
                            justifyContent: 'flex-start',
                            px: 3,
                            py: 1.5,
                            my: 0.5,
                            borderRadius: 2,
                            color: 'text.primary',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            },
                          }}
                        >
                          My Profile
                        </Button>
                        
                        <Button
                          fullWidth
                          onClick={handleLogout}
                          startIcon={<ExitToApp />}
                          sx={{
                            justifyContent: 'flex-start',
                            px: 3,
                            py: 1.5,
                            my: 0.5,
                            borderRadius: 2,
                            color: 'error.main',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.error.main, 0.1),
                            },
                          }}
                        >
                          Logout
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        component={RouterLink}
                        to="/login"
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Sign In
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        component={RouterLink}
                        to="/register"
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Sign Up
                      </Button>
                    </Box>
                  )}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </AppBar>
      </HideOnScroll>

      {/* Account Menu */}
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            borderRadius: 2,
            minWidth: 220,
            overflow: 'visible',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
              boxShadow: theme.shadows[1],
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {currentUser?.username || 'User'}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {currentUser?.email || ''}
          </Typography>
        </Box>
        
        <MenuItem 
          component={RouterLink} 
          to={`/profile/${currentUser?.username}`}
          onClick={handleClose}
          sx={{
            py: 1.5,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        
        <MenuItem 
          component={RouterLink} 
          to="/settings"
          onClick={handleClose}
          sx={{
            py: 1.5,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>Account Settings</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem 
          onClick={handleLogout}
          sx={{
            py: 1.5,
            color: 'error.main',
            '&:hover': {
              backgroundColor: alpha(theme.palette.error.main, 0.08),
            },
          }}
        >
          <ListItemIcon sx={{ color: 'error.main' }}>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;
