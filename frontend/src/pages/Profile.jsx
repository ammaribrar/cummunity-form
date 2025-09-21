import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Paper,
  Tabs,
  Tab,
  Divider,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Settings as SettingsIcon,
  ThumbUp as ThumbUpIcon,
  ChatBubbleOutline as CommentIcon,
  Article as ArticleIcon,
  Person as PersonIcon,
  Cake as CakeIcon,
  Email as EmailIcon,
  Link as LinkIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { username } = useParams();
  const { currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isCurrentUser = currentUser && user && currentUser._id === user._id;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [userRes, postsRes, commentsRes] = await Promise.all([
          axios.get(`/api/users/${username}`),
          axios.get(`/api/users/${username}/posts`),
          axios.get(`/api/users/${username}/comments`),
        ]);
        
        setUser(userRes.data);
        setPosts(postsRes.data);
        setComments(commentsRes.data);
      } catch (err) {
        setError('Failed to load user profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Posts
        return (
          <Box>
            {posts.length > 0 ? (
              posts.map((post) => (
                <Paper 
                  key={post._id} 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    mb: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                  component={RouterLink}
                  to={`/posts/${post._id}`}
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <Typography variant="h6" component="h3" gutterBottom>
                    {post.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip 
                      label={post.type} 
                      size="small" 
                      color="primary"
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      <ThumbUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">{post.votes}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CommentIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">{post.commentCount || 0}</Typography>
                    </Box>
                  </Box>
                </Paper>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <ArticleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  No posts yet
                </Typography>
                {isCurrentUser && (
                  <Button 
                    variant="contained" 
                    component={RouterLink}
                    to="/create-post"
                    sx={{ mt: 2 }}
                  >
                    Create your first post
                  </Button>
                )}
              </Box>
            )}
          </Box>
        );
      
      case 1: // Comments
        return (
          <Box>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Paper 
                  key={comment._id} 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    mb: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                  component={RouterLink}
                  to={`/posts/${comment.post._id}#comment-${comment._id}`}
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography 
                      variant="body1" 
                      component="span" 
                      sx={{ fontWeight: 500 }}
                    >
                      On {comment.post.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ ml: 'auto' }}
                    >
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {comment.content.replace(/<[^>]*>/g, '')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: 'text.secondary' }}>
                    <ThumbUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">{comment.votes}</Typography>
                  </Box>
                </Paper>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CommentIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  No comments yet
                </Typography>
              </Box>
            )}
          </Box>
        );
      
      case 2: // About
        return (
          <Box>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                mb: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
              }}
            >
              <Typography variant="h6" gutterBottom>
                About
              </Typography>
              
              {user.bio ? (
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {user.bio}
                </Typography>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  {isCurrentUser 
                    ? "You haven't added a bio yet. Click the edit button to add one!" 
                    : "This user hasn't added a bio yet."}
                </Typography>
              )}
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ '& > *:not(:last-child)': { mb: 1 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon color="action" sx={{ mr: 2 }} />
                  <Typography variant="body2">
                    {user.role === 'admin' ? 'Admin' : 'Member'} since{' '}
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </Typography>
                </Box>
                
                {user.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon color="action" sx={{ mr: 2 }} />
                    <Typography variant="body2">
                      {user.location}
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CakeIcon color="action" sx={{ mr: 2 }} />
                  <Typography variant="body2">
                    Member for {formatDistanceToNow(new Date(user.createdAt))}
                  </Typography>
                </Box>
                
                {user.website && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LinkIcon color="action" sx={{ mr: 2 }} />
                    <a 
                      href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: theme.palette.primary.main }}
                    >
                      {user.website}
                    </a>
                  </Box>
                )}
              </Box>
            </Paper>
            
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Stats
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="primary">
                    {user.postCount || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Posts
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="primary">
                    {user.commentCount || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Comments
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="primary">
                    {user.reputation || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Reputation
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="primary">
                    {user.votesReceived || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Votes
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'User not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box 
          sx={{ 
            height: 120, 
            bgcolor: 'primary.main',
            borderRadius: 1,
            mb: 8,
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              bottom: -64,
              left: 24,
              display: 'flex',
              alignItems: 'flex-end',
              gap: 3,
              width: '100%',
            }}
          >
            <Avatar
              src={user.avatar}
              alt={user.username}
              sx={{
                width: 128,
                height: 128,
                border: '4px solid',
                borderColor: 'background.paper',
                bgcolor: 'background.default',
              }}
            />
            
            <Box sx={{ flex: 1, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h4" component="h1">
                  {user.username}
                </Typography>
                
                {user.role === 'admin' && (
                  <Chip 
                    label="Admin" 
                    color="secondary" 
                    size="small" 
                    sx={{ ml: 1 }}
                  />
                )}
                
                {isCurrentUser && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    component={RouterLink}
                    to="/settings/profile"
                    sx={{ ml: 'auto' }}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
              
              <Typography variant="subtitle1" color="text.secondary">
                {user.name || ''}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                {user.skills && user.skills.slice(0, 3).map((skill) => (
                  <Chip 
                    key={skill} 
                    label={skill} 
                    size="small" 
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab label="Posts" icon={<ArticleIcon />} iconPosition="start" />
            <Tab label="Comments" icon={<CommentIcon />} iconPosition="start" />
            <Tab label="About" icon={<PersonIcon />} iconPosition="start" />
          </Tabs>
        </Box>
        
        {renderTabContent()}
      </Box>
    </Container>
  );
};

export default Profile;
