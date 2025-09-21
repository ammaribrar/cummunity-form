import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  IconButton,
  Divider,
  TextField,
  Paper,
  useTheme,
  Chip,
  CircularProgress,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Menu,
  MenuItem,
  Alert,
  Skeleton,
  Tooltip,
  Snackbar,
  styled
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  FavoriteBorder as LikeIcon,
  Favorite as LikedIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkedIcon,
  Share as ShareIcon,
  MoreVert as MoreIcon,
  Comment as CommentIcon,
  Send as SendIcon,
  Visibility as ViewIcon,
  Reply as ReplyIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const Post = ({ isNewPost = false }) => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Handle like post
  const handleLikePost = async () => {
    if (!currentUser) {
      setSnackbar({
        open: true,
        message: 'Please log in to like posts',
        severity: 'info'
      });
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    
    try {
      // Simulate API call
      setPost(prev => ({
        ...prev,
        isLiked: !prev.isLiked,
        likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
      }));
      
      // In a real app, you would make an API call here
      // await api.likePost(postId, currentUser.id);
      
    } catch (error) {
      console.error('Error liking post:', error);
      setSnackbar({
        open: true,
        message: 'Failed to like post. Please try again.',
        severity: 'error'
      });
    }
  };
  
  // Handle like comment
  const handleLikeComment = (commentId) => {
    if (!currentUser) {
      setSnackbar({
        open: true,
        message: 'Please log in to like comments',
        severity: 'info'
      });
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    
    setComments(prev => 
      prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          };
        }
        return comment;
      })
    );
  };
  
  // Handle submit comment
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setSnackbar({
        open: true,
        message: 'Please log in to comment',
        severity: 'info'
      });
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    
    if (!newComment.trim()) return;
    
    try {
      // In a real app, you would make an API call here
      // const newCommentData = await api.addComment(postId, newComment);
      
      const newCommentObj = {
        id: `comment-${Date.now()}`,
        author: {
          id: currentUser.id,
          name: currentUser.name,
          username: currentUser.username,
          avatar: currentUser.avatar || 'https://i.pravatar.cc/150?img=60'
        },
        content: newComment,
        createdAt: new Date(),
        likes: 0,
        isLiked: false,
        replies: []
      };
      
      setComments(prev => [newCommentObj, ...prev]);
      setPost(prev => ({
        ...prev,
        comments: prev.comments + 1
      }));
      setNewComment('');
      setReplyingTo(null);
      
      setSnackbar({
        open: true,
        message: 'Comment added!',
        severity: 'success'
      });
      
    } catch (error) {
      console.error('Error adding comment:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add comment. Please try again.',
        severity: 'error'
      });
    }
  };
  
  // Toggle replies visibility
  const toggleReplies = (commentId) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };
  
  // Format date
  const formatDate = (date, relative = false) => {
    if (relative) {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    }
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Format time since
  const formatTimeSince = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(date);
  };
  
  // If this is a new post, redirect to CreatePost component
  if (isNewPost) {
    navigate('/create-post', { replace: true });
    return null;
  }

  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState({
    id: postId,
    title: 'Building Modern React Applications with Hooks',
    content: `# Building Modern React Applications with Hooks

React Hooks have revolutionized the way we build React applications. They provide a more direct API to the React concepts you already know: props, state, context, refs, and lifecycle.

## What are React Hooks?

Hooks are functions that let you use state and other React features without writing a class.`,
    author: {
      id: 'user123',
      name: 'Sarah Johnson',
      username: 'sarahdev',
      avatar: 'https://i.pravatar.cc/150?img=32',
    },
    tags: ['react', 'javascript', 'webdev', 'hooks', 'frontend'],
    likes: 124,
    isLiked: false,
    comments: 8,
    createdAt: new Date('2023-09-20T10:30:00'),
  });

  const [comments, setComments] = useState([
    {
      id: '1',
      author: {
        id: 'user456',
        name: 'Jane Smith',
        username: 'janesmith',
        avatar: 'https://i.pravatar.cc/150?img=24'
      },
      content: 'Great post! Really helped me understand hooks better.',
      createdAt: new Date('2023-09-20T11:30:00'),
      likes: 5,
      isLiked: false,
      replies: []
    },
    {
      id: '2',
      author: {
        id: 'user789',
        name: 'Mike Johnson',
        username: 'mikej',
        avatar: 'https://i.pravatar.cc/150?img=45'
      },
      content: 'Thanks for the clear examples. Do you have any tips for testing components with hooks?',
      createdAt: new Date('2023-09-20T12:45:00'),
      likes: 2,
      isLiked: false,
      replies: []
    },
  ]);
  
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReplies, setShowReplies] = useState({});
  const [submittingComment, setSubmittingComment] = useState(false);

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    // Simulate fetching post data
    const fetchPost = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, you would fetch the post and comments from your API
        // const postData = await api.getPost(postId);
        // const commentsData = await api.getPostComments(postId);
        // setPost(postData);
        // setComments(commentsData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [postId]);

  const handleLike = () => {
    setPost(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
    }));
  };

  const handleBookmark = () => {
    setPost(prev => ({
      ...prev,
      isBookmarked: !prev.isBookmarked,
    }));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      author: 'Current User',
      avatar: 'https://i.pravatar.cc/150?img=1',
      content: comment,
      createdAt: new Date(),
      likes: 0,
    };

    setComments(prev => [newComment, ...prev]);
    setComment('');
  };


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>Post not found</Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          startIcon={<ArrowBackIcon />}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2, color: 'text.secondary' }}
        >
          Back
        </Button>
      </Box>

      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 2,
          mb: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              src={post.author.avatar}
              alt={post.author.name}
              component={RouterLink}
              to={`/profile/${post.author.username}`}
              sx={{ width: 48, height: 48, mr: 2, cursor: 'pointer' }}
            />
            <Box>
              <Typography
                variant="subtitle1"
                component={RouterLink}
                to={`/profile/${post.author.username}`}
                sx={{
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: 'text.primary',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {post.author.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(post.createdAt, true)}
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton>
              <MoreIcon />
            </IconButton>
          </Box>

          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 3,
              lineHeight: 1.3,
            }}
          >
            {post.title}
          </Typography>

          <Box
            sx={{
              mb: 4,
              '& h2': {
                fontSize: '1.75rem',
                fontWeight: 600,
                mt: 4,
                mb: 2,
              },
              '& h3': {
                fontSize: '1.5rem',
                fontWeight: 600,
                mt: 3,
                mb: 1.5,
              },
              '& p': {
                fontSize: '1.1rem',
                lineHeight: 1.7,
                mb: 2,
                color: 'text.primary',
              },
              '& pre': {
                backgroundColor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#f5f5f5',
                borderRadius: 1,
                p: 2,
                overflowX: 'auto',
                mb: 3,
              },
              '& code': {
                fontFamily: 'monospace',
                fontSize: '0.9em',
              },
              '& a': {
                color: theme.palette.primary.main,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              },
              '& ul, & ol': {
                pl: 4,
                mb: 2,
              },
              '& li': {
                mb: 1,
              },
            }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: post.content
                  .replace(/\n\n/g, '</p><p>')
                  .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
                  .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
                  .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
                  .replace(/`([^`]+)`/g, '<code>$1</code>')
                  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*([^*]+)\*/g, '<em>$1</em>')
                  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {post.tags.map((tag) => (
              <Chip
                key={tag}
                label={`#${tag}`}
                component={RouterLink}
                to={`/tags/${tag}`}
                clickable
                size="small"
                sx={{
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              />
            ))}
          </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4, lineHeight: 1.7 }}>
          {post.content}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={post.isLiked ? 'Unlike' : 'Like'} arrow>
              <IconButton
                onClick={handleLikePost}
                color={post.isLiked ? 'error' : 'default'}
                sx={{
                  color: post.isLiked ? 'error.main' : 'text.secondary',
                  '&:hover': {
                    backgroundColor: post.isLiked ? 'rgba(244, 67, 54, 0.1)' : 'action.hover',
                  }
                }}
              >
                {post.isLiked ? <LikedIcon /> : <LikeIcon />}
              </IconButton>
            </Tooltip>
            <Typography variant="body2" sx={{ mr: 2, minWidth: 20, textAlign: 'center' }}>
              {post.likes}
            </Typography>

            <Tooltip title="Comment" arrow>
              <IconButton
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  }
                }}
              >
                <CommentIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {post.comments}
            </Typography>

            <Tooltip title="Share" arrow>
              <IconButton
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setSnackbar({
                    open: true,
                    message: 'Link copied to clipboard!',
                    severity: 'success'
                  });
                }}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  }
                }}
              >
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Comments Section */}
      <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2, mb: 4 }}>
        <Box>
          <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </Typography>

          {/* Comment Form */}
          <Box
            component="form"
            onSubmit={handleSubmitComment}
            sx={{ mb: 4 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Avatar
                src={currentUser?.avatar || 'https://i.pravatar.cc/150?img=60'}
                alt={currentUser?.name || 'User'}
                sx={{ width: 40, height: 40, mr: 2, mt: 0.5 }}
              />
              <Box sx={{ flex: 1, position: 'relative' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder={replyingTo ? `Replying to @${replyingTo}` : 'Write a comment...'}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  multiline
                  rows={3}
                  disabled={!currentUser}
                  onClick={() => !currentUser && navigate('/login')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'background.paper',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'divider',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: 1,
                      },
                    },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  {replyingTo && (
                    <Button
                      size="small"
                      onClick={() => setReplyingTo(null)}
                      sx={{ mr: 1 }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!newComment.trim() || !currentUser}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 2,
                      py: 0.8,
                      fontWeight: 500,
                      '&:disabled': {
                        opacity: 0.7,
                      },
                    }}
                  >
                    {submittingComment ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      'Post Comment'
                    )}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Comments List */}
        <Box>
          {comments.map((comment) => (
            <Box key={comment.id} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Avatar
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  component="a"
                  href={`/profile/${comment.author.username}`}
                  sx={{
                    width: 40,
                    height: 40,
                    mr: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.9,
                    }
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, flexWrap: 'wrap' }}>
                    <Typography
                      component="a"
                      href={`/profile/${comment.author.username}`}
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.9375rem',
                        color: 'text.primary',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        }
                      }}
                    >
                      {comment.author.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: 1, fontSize: '0.75rem' }}
                    >
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1, whiteSpace: 'pre-line' }}>
                    {comment.content}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Tooltip title={comment.isLiked ? 'Unlike' : 'Like'} arrow>
                      <IconButton
                        size="small"
                        onClick={() => handleLikeComment(comment.id)}
                        sx={{
                          color: comment.isLiked ? 'error.main' : 'text.secondary',
                          '&:hover': {
                            backgroundColor: comment.isLiked ? 'rgba(244, 67, 54, 0.1)' : 'action.hover',
                          }
                        }}
                      >
                        {comment.isLiked ? <LikedIcon fontSize="small" /> : <LikeIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mr: 2, minWidth: 20, textAlign: 'center' }}
                    >
                      {comment.likes > 0 ? comment.likes : ''}
                    </Typography>

                    <Button
                      size="small"
                      startIcon={<ReplyIcon fontSize="small" />}
                      onClick={() => {
                        setReplyingTo(comment.author.username);
                        setNewComment(`@${comment.author.username} `);
                        document.querySelector('textarea')?.focus();
                      }}
                      sx={{
                        textTransform: 'none',
                        color: 'text.secondary',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        }
                      }}
                    >
                      Reply
                    </Button>

                    {comment.replies && comment.replies.length > 0 && (
                      <Button
                        size="small"
                        onClick={() => toggleReplies(comment.id)}
                        sx={{
                          ml: 'auto',
                          textTransform: 'none',
                          color: 'text.secondary',
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          }
                        }}
                      >
                        {showReplies[comment.id] ? 'Hide replies' : `View ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`}
                      </Button>
                    )}
                  </Box>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && showReplies[comment.id] && (
                    <Box sx={{ mt: 2, ml: 4, pl: 2, borderLeft: '2px solid', borderColor: 'divider' }}>
                      {comment.replies.map((reply) => (
                        <Box key={reply.id} sx={{ mb: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                          <Box sx={{ display: 'flex', mb: 0.5 }}>
                            <Avatar
                              src={reply.author.avatar}
                              alt={reply.author.name}
                              sx={{ width: 32, height: 32, mr: 1.5 }}
                            />
                            <Box>
                              <Typography variant="caption" fontWeight={500}>
                                {reply.author.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="body2" sx={{ ml: 5, mb: 1 }}>
                            {reply.content}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', ml: 5 }}>
                            <Tooltip title={reply.isLiked ? 'Unlike' : 'Like'} arrow>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  // Handle like reply
                                  const updatedReplies = comment.replies.map(r =>
                                    r.id === reply.id
                                      ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 }
                                      : r
                                  );
                                  setComments(prev =>
                                    prev.map(c =>
                                      c.id === comment.id
                                        ? { ...c, replies: updatedReplies }
                                        : c
                                    )
                                  );
                                }}
                                sx={{
                                  color: reply.isLiked ? 'error.main' : 'text.secondary',
                                  '&:hover': {
                                    backgroundColor: reply.isLiked ? 'rgba(244, 67, 54, 0.1)' : 'action.hover',
                                  }
                                }}
                              >
                                {reply.isLiked ?
                                  <LikedIcon fontSize="small" /> :
                                  <LikeIcon fontSize="small" />
                                }
                              </IconButton>
                            </Tooltip>
                            <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                              {reply.likes > 0 ? reply.likes : ''}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {comments.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CommentIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body1" color="text.secondary">
              No comments yet. Be the first to share your thoughts!
            </Typography>
          </Box>
        )}
      </Paper>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Post;
