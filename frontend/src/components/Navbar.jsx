import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import {
  AppBar,
  Toolbar,
  Container,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useScrollTrigger,
  Slide,
  Divider,
  alpha,
  InputBase,
  styled,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  DarkModeOutlined,
  LightModeOutlined,
  Add as AddIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';
import Logo from './Logo';

// Styled components
const StyledAppBar = styled(AppBar)(({ theme, scrolled }) => {
  const isScrolled = scrolled === 'true';
  return {
    background: isScrolled 
      ? alpha(theme.palette.background.paper, 0.8) 
      : theme.palette.background.paper,
    backdropFilter: isScrolled ? 'blur(12px)' : 'none',
    WebkitBackdropFilter: isScrolled ? 'blur(12px)' : 'none',
    boxShadow: isScrolled 
      ? '0 2px 20px -4px rgba(0, 0, 0, 0.05)' 
      : '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    transition: 'all 0.3s ease',
  };
});

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.action.hover, 0.1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.hover, 0.15),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
  transition: 'all 0.3s ease',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

const Navbar = () => {
  const theme = useTheme();
  const location = useLocation();
  const { toggleTheme, mode } = useCustomTheme();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSignOut = () => {
    // Handle sign out logic here
    navigate('/login');
  };

  // Navigation items
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Posts', path: '/posts' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'About', path: '/about' }
  ];
  

  const drawer = (
    <Box
      sx={{
        width: 250,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <Logo variant="default" size="medium" />
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              onClick={handleDrawerToggle}
              sx={{
                '&.Mui-selected': {
                  color: 'primary.main',
                  backgroundColor: 'action.selected',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                },
              }}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to="/create-post"
            onClick={handleDrawerToggle}
            sx={{
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemText primary="Post" primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider sx={{ mt: 'auto' }} />
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/login"
          sx={{ mb: 1 }}
        >
          Sign In
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          component={RouterLink}
          to="/register"
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <Slide appear={false} direction="down" in={!useScrollTrigger({ threshold: 100 })}>
        <StyledAppBar position="fixed" elevation={0} scrolled={scrolled.toString()}>
          <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ minHeight: 70 }}>
              {/* Mobile menu button */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
                <IconButton
                  size="large"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  color="inherit"
                  sx={{ color: 'text.primary' }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>

              {/* Logo */}
              <Box 
                component={RouterLink}
                to="/"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  mr: { xs: 1, md: 3 },
                }}
              >
                <Logo variant={isMobile ? 'icon' : 'default'} size={isMobile ? 'medium' : 'medium'} />
              </Box>

              {/* Desktop Navigation */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, ml: 4 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.name}
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      mx: 0.5,
                      color: 'text.primary',
                      '&:hover': {
                        color: 'primary.main',
                        backgroundColor: 'transparent',
                      },
                      '&.active': {
                        color: 'primary.main',
                        fontWeight: 600,
                      },
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
              </Box>

              {/* Search Bar */}
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </Search>
              </Box>

              {/* Create Post Button - Only show when user is logged in */}
              {currentUser && (
                <Button
                  component={RouterLink}
                  to="/post/new"
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  sx={{
                    ml: 2,
                    textTransform: 'none',
                    borderRadius: 2,
                    fontWeight: 500,
                    display: { xs: 'none', md: 'flex' },
                    '&:hover': {
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  Create Post
                </Button>
              )}

              {/* Auth Buttons and Theme Toggle */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  size="small"
                  sx={{
                    color: 'text.primary',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  size="small"
                  disableElevation
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                >
                  Sign Up
                </Button>
                <IconButton
                  onClick={toggleTheme}
                  color="inherit"
                  sx={{ 
                    color: 'text.secondary',
                    ml: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  {mode === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </StyledAppBar>
      </Slide>

      {/* Mobile Drawer */}
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

    </>
  );
};

export default Navbar;
