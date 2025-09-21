import { useEffect, useState, useMemo } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Container, Box, ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider as CustomThemeProvider, useTheme } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import About from './pages/About';
import Post from './pages/Post';
import PostPage from './pages/PostPage';
import { useAuth } from './contexts/AuthContext';
import { lightTheme, darkTheme } from './theme/theme';

// Custom scrollbar styles
import './styles/global.css';

// Animation variants for page transitions
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  out: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

// Component to handle page transitions
const PageTransition = ({ children }) => {
  const location = useLocation();
  
  // Create a stable key that won't cause issues with history state
  const pathname = typeof location.pathname === 'string' ? location.pathname : '';
  const search = typeof location.search === 'string' ? location.search : '';
  const key = `${pathname}${search}`;

  return (
    <motion.div
      key={key}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
};

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Create a simple location state object instead of passing the entire location
    const loginRedirect = {
      pathname: location.pathname,
      search: location.search,
    };
    return <Navigate to="/login" state={{ from: loginRedirect }} replace />;
  }
  return children;
};

// Theme wrapper component
const ThemeWrapper = ({ children }) => {
  const { mode } = useTheme();
  const theme = useMemo(() => (mode === 'dark' ? darkTheme : lightTheme), [mode]);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || (prefersDarkMode ? 'dark' : 'light');
  });

  const currentTheme = useMemo(() => 
    theme === 'dark' ? darkTheme : lightTheme
  , [theme]);

  return (
    <CustomThemeProvider>
      <ThemeWrapper>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            bgcolor: 'background.default',
            color: 'text.primary',
            transition: 'background-color 0.3s, color 0.3s',
          }}
        >
          <Navbar />
          <Box 
            component="main" 
            sx={{ 
              flex: 1,
              py: { xs: 2, md: 4 },
            px: { xs: 2, sm: 0 },
          }}
        >
          <Container maxWidth="lg">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route 
                  path="/" 
                  element={
                    <PageTransition>
                      <Home />
                    </PageTransition>
                  } 
                />
                <Route 
                  path="/login" 
                  element={
                    <PageTransition>
                      <Login />
                    </PageTransition>
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    <PageTransition>
                      <Register />
                    </PageTransition>
                  } 
                />
                <Route 
                  path="/post/:id" 
                  element={
                    <PageTransition>
                      <PostDetail />
                    </PageTransition>
                  } 
                />
                <Route 
                  path="/posts" 
                  element={
                    <PageTransition>
                      <PostPage />
                    </PageTransition>
                  } 
                />
                <Route 
                  path="/post/:postId" 
                  element={
                    <PageTransition>
                      <ErrorBoundary>
                        <Post />
                      </ErrorBoundary>
                    </PageTransition>
                  } 
                />
                <Route 
                  path="/leaderboard" 
                  element={
                    <PageTransition>
                      <Leaderboard />
                    </PageTransition>
                  } 
                />
                <Route 
                  path="/about" 
                  element={
                    <PageTransition>
                      <About />
                    </PageTransition>
                  } 
                />
                <Route
                  path="/post/new"
                  element={
                    <ProtectedRoute>
                      <PageTransition>
                        <ErrorBoundary>
                          <Post isNewPost={true} />
                        </ErrorBoundary>
                      </PageTransition>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-post"
                  element={
                    <PageTransition>
                      <CreatePost />
                    </PageTransition>
                  }
                />
                <Route
                  path="/profile/:username"
                  element={
                    <ProtectedRoute>
                      <PageTransition>
                        <Profile />
                      </PageTransition>
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path="*" 
                  element={
                    <PageTransition>
                      <Navigate to="/" replace />
                    </PageTransition>
                  } 
                />
              </Routes>
            </AnimatePresence>
          </Container>
        </Box>
          <Footer />
        </Box>
      </ThemeWrapper>
    </CustomThemeProvider>
  );
}

export default App;
