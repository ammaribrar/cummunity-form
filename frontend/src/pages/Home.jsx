import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  Avatar,
  Skeleton,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  Grid,
  IconButton,
  Paper,
  Fade,
  Grow,
  useScrollTrigger,
  Fab,
  Zoom,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ChatBubbleOutline as ChatIcon,
  Visibility as VisibilityIcon,
  RocketLaunch as RocketIcon,
  ArrowForward as ArrowForwardIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  NewReleases as NewReleasesIcon,
  Whatshot as WhatshotIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';

// Floating blob background component
const BlobBackground = () => {
  // Add the keyframes to the global styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0% { transform: translate(0, 0) rotate(0deg); }
        50% { transform: translate(20px, 20px) rotate(5deg); }
        100% { transform: translate(0, 0) rotate(0deg); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      overflow: 'hidden',
      opacity: 0.5,
    }}>
      <Box sx={{
        position: 'absolute',
        width: '60vw',
        height: '60vw',
        minWidth: '500px',
        minHeight: '500px',
        top: '20%',
        left: '-10%',
        borderRadius: '50%',
        background: 'linear-gradient(45deg, #818CF8, #EC4899)',
        filter: 'blur(100px)',
        opacity: 0.3,
        animation: 'float 15s ease-in-out infinite',
      }} />
      <Box sx={{
        position: 'absolute',
        width: '50vw',
        height: '50vw',
        minWidth: '400px',
        minHeight: '400px',
        bottom: '10%',
        right: '-10%',
        borderRadius: '50%',
        background: 'linear-gradient(-45deg, #34D399, #3B82F6)',
        filter: 'blur(120px)',
        opacity: 0.3,
        animation: 'float 20s ease-in-out infinite',
        animationDelay: '5s',
      }} />
    </Box>
  );
};

// Scroll to top button component
function ScrollTop(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Fade in={value === index} timeout={500}>
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      </Fade>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, color }) => (
  <motion.div
    whileHover={{ y: -8, transition: { duration: 0.2 } }}
    style={{ height: '100%' }}
  >
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: color,
        boxShadow: `0 8px 20px -5px ${color}40`,
      },
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{
          width: 60,
          height: 60,
          borderRadius: '16px',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}>
          {icon}
        </Box>
        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  </motion.div>
);

const Home = (props) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const features = [
    {
      icon: <RocketIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />,
      title: 'Lightning Fast',
      description: 'Experience blazing fast performance with our optimized platform that loads in the blink of an eye.',
      color: theme.palette.primary.main,
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 32, color: theme.palette.success.main }} />,
      title: 'Trending Content',
      description: 'Stay ahead with trending topics and discover what\'s popular in the community right now.',
      color: theme.palette.success.main,
    },
    {
      icon: <NewReleasesIcon sx={{ fontSize: 32, color: theme.palette.warning.main }} />,
      title: 'Latest Updates',
      description: 'Get instant access to the most recent and relevant content as soon as it\'s published.',
      color: theme.palette.warning.main,
    },
    {
      icon: <WhatshotIcon sx={{ fontSize: 32, color: theme.palette.error.main }} />,
      title: 'Hot Topics',
      description: 'Dive into the most engaging and discussed topics that are making waves in the community.',
      color: theme.palette.error.main,
    },
  ];
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const sortBy = tabValue === 0 ? 'newest' : 'popular';
        
        // For now, using mock data since we don't have a backend
        // In a real app, you would use: 
        // try {
        //   const response = await axios.get(`/api/posts?sort=${sortBy}`);
        //   setPosts(response.data);
        // } catch (err) {
        //   setError('Failed to fetch posts. Please try again later.');
        //   console.error('Error fetching posts:', err);
        // }
        
        // Mock data for demonstration
        const mockPosts = [
          {
            _id: '1',
            title: 'Welcome to AI Community Forum',
            content: 'This is a sample post to demonstrate the UI. In a real app, this would be loaded from your backend.',
            author: {
              username: 'admin',
              avatar: 'https://i.pravatar.cc/150?img=1'
            },
            votes: 10,
            commentCount: 3,
            createdAt: new Date().toISOString(),
            tags: ['welcome', 'introduction']
          },
          {
            _id: '2',
            title: 'Getting Started with React',
            content: 'Learn how to build amazing web applications with React and Material-UI.',
            author: {
              username: 'reactfan',
              avatar: 'https://i.pravatar.cc/150?img=2'
            },
            votes: 15,
            commentCount: 5,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            tags: ['react', 'tutorial']
          }
        ];
        setPosts(mockPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [tabValue]);

  const handleVote = async (postId, voteType) => {
    try {
      await axios.post(`/api/posts/${postId}/vote`, { voteType });
      setPosts(posts.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              votes: voteType === 'upvote' ? post.votes + 1 : post.votes - 1,
              userVote: voteType === 'upvote' ? 1 : -1 
            } 
          : post
      ));
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const PostSkeleton = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ ml: 1 }}>
            <Skeleton width={120} height={24} />
            <Skeleton width={80} height={20} />
          </Box>
        </Box>
        <Skeleton height={28} width="80%" />
        <Skeleton height={20} width="60%" />
        <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
          <Skeleton width={60} height={24} />
          <Skeleton width={60} height={24} />
        </Box>
      </CardContent>
      <CardActions>
        <Skeleton width={80} height={36} />
        <Skeleton width={80} height={36} sx={{ ml: 1 }} />
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
        {/* Hero Section */}
        <Box sx={{ 
          textAlign: 'center', 
          py: 8, 
          background: `linear-gradient(135deg, ${theme.palette.primary.light}10 0%, ${theme.palette.primary.dark}05 100%)`,
          borderRadius: 2,
          mb: 4,
          border: `1px solid ${theme.palette.divider}`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '300px',
            height: '300px',
            background: `radial-gradient(circle, ${theme.palette.primary.light}20 0%, transparent 70%)`,
            top: '-150px',
            right: '-150px',
            borderRadius: '50%',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '200px',
            height: '200px',
            background: `radial-gradient(circle, ${theme.palette.secondary.light}20 0%, transparent 70%)`,
            bottom: '-100px',
            left: '-100px',
            borderRadius: '50%',
          },
        }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to AI Community Forum
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Connect, share, and learn with AI enthusiasts around the world
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            color="primary"
            onClick={() => navigate('/create-post')}
            sx={{
              mt: 3,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: `0 4px 14px 0 ${theme.palette.primary.light}40`,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 6px 20px 0 ${theme.palette.primary.light}60`,
              },
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '5px',
                height: '5px',
                background: 'rgba(255, 255, 255, 0.5)',
                opacity: '0',
                borderRadius: '100%',
                transform: 'scale(1, 1) translate(-50%, -50%)',
                transformOrigin: '50% 50%',
              },
              '&:focus:not(:active)::after': {
                animation: 'ripple 1s ease-out',
              },
              '@keyframes ripple': {
                '0%': {
                  transform: 'scale(0, 0)',
                  opacity: '.5',
                },
                '100%': {
                  transform: 'scale(24, 24)',
                  opacity: '0',
                },
              },
            }}
            startIcon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20M4 12H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          >
            Create Post
          </Button>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard 
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
              />
            </Grid>
          ))}
        </Grid>

        {/* Posts Section */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="post sort tabs"
            variant={isMobile ? 'fullWidth' : 'standard'}
          >
            <Tab label="Newest" id="tab-0" />
            <Tab label="Popular" id="tab-1" />
          </Tabs>
        </Box>

        {error ? (
          <Box sx={{ 
            textAlign: 'center', 
            p: 4, 
            backgroundColor: theme.palette.error.light,
            color: theme.palette.error.contrastText,
            borderRadius: 1,
            mb: 3
          }}>
            <Typography>{error}</Typography>
          </Box>
        ) : (
          <TabPanel value={tabValue} index={0}>
            {loading ? (
              Array.from(new Array(3)).map((_, index) => (
                <PostSkeleton key={`skeleton-${index}`} />
              ))
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <Card key={post._id} sx={{ mb: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        src={post.author.avatar} 
                        alt={post.author.username}
                        component={RouterLink}
                        to={`/profile/${post.author.username}`}
                        sx={{ textDecoration: 'none' }}
                      />
                      <Box sx={{ ml: 1 }}>
                        <Typography 
                          component={RouterLink} 
                          to={`/profile/${post.author.username}`}
                          sx={{ 
                            fontWeight: 500, 
                            textDecoration: 'none',
                            color: 'inherit',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {post.author.username}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography 
                      component={RouterLink}
                      to={`/posts/${post._id}`}
                      variant="h6" 
                      sx={{ 
                        mb: 1, 
                        display: 'block',
                        textDecoration: 'none',
                        color: 'inherit',
                        '&:hover': {
                          color: 'primary.main',
                        },
                      }}
                    >
                      {post.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {post.tags.map((tag) => (
                        <Chip 
                          key={tag} 
                          label={tag} 
                          size="small" 
                          component={RouterLink}
                          to={`/tags/${tag}`}
                          clickable
                        />
                      ))}
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <ThumbUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">{post.votes}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <ChatIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">{post.commentCount || 0}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <VisibilityIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">{post.views || 0}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  
                  <Divider />
                  
                  <CardActions>
                    <Button 
                      size="small" 
                      startIcon={<ThumbUpIcon />}
                      onClick={() => handleVote(post._id, 'upvote')}
                      color={post.userVote === 1 ? 'primary' : 'inherit'}
                    >
                      Upvote
                    </Button>
                    <Button 
                      size="small" 
                      component={RouterLink}
                      to={`/posts/${post._id}#comments`}
                      startIcon={<ChatIcon />}
                    >
                      Comment
                    </Button>
                  </CardActions>
                </Card>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No posts found.
                </Typography>
              </Box>
            )}
          </TabPanel>
        )}
      </Container>
      
      <BlobBackground />
      <ScrollTop {...props}>
        <Fab 
          color="primary" 
          size="medium" 
          aria-label="scroll back to top"
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </Box>
  );
};

export default Home;
