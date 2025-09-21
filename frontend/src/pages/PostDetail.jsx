import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Divider,
  Button,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Reply as ReplyIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const [postRes, commentsRes] = await Promise.all([
          axios.get(`/api/posts/${id}`),
          axios.get(`/api/posts/${id}/comments`),
        ]);
        setPost(postRes.data);
        setComments(commentsRes.data);
      } catch (err) {
        setError('Failed to fetch post');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleVote = async (type, id, isComment = false) => {
    try {
      const endpoint = isComment 
        ? `/api/comments/${id}/vote` 
        : `/api/posts/${id}/vote`;
      
      await axios.post(endpoint, { voteType: type });
      
      if (isComment) {
        setComments(comments.map(comment => 
          comment._id === id 
            ? { 
                ...comment, 
                votes: type === 'upvote' ? comment.votes + 1 : comment.votes - 1,
                userVote: type === 'upvote' ? 1 : -1 
              } 
            : comment
        ));
      } else {
        setPost(prev => ({
          ...prev,
          votes: type === 'upvote' ? prev.votes + 1 : prev.votes - 1,
          userVote: type === 'upvote' ? 1 : -1
        }));
      }
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`/api/posts/${id}/comments`, {
        content: newComment,
        parentId: replyingTo,
      });

      setComments([response.data, ...comments]);
      setNewComment('');
      setReplyingTo(null);
      
      // Update comment count
      setPost(prev => ({
        ...prev,
        commentCount: (prev.commentCount || 0) + 1
      }));
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await axios.delete(`/api/comments/${commentId}`);
        setComments(comments.filter(comment => comment._id !== commentId));
        
        // Update comment count
        setPost(prev => ({
          ...prev,
          commentCount: Math.max(0, (prev.commentCount || 1) - 1)
        }));
      } catch (err) {
        console.error('Error deleting comment:', err);
      }
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editCommentContent.trim()) return;

    try {
      const response = await axios.put(`/api/comments/${commentId}`, {
        content: editCommentContent,
      });

      setComments(comments.map(comment => 
        comment._id === commentId 
          ? { ...comment, content: editCommentContent }
          : comment
      ));
      
      setEditingComment(null);
      setEditCommentContent('');
    } catch (err) {
      console.error('Error updating comment:', err);
    }
  };

  const startEditingComment = (comment) => {
    setEditingComment(comment._id);
    setEditCommentContent(comment.content);
  };

  const renderComments = (commentList, level = 0) => {
    return commentList.map((comment) => (
      <Box key={comment._id} sx={{ ml: level * 3, mb: 2 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            bgcolor: level % 2 === 0 ? 'background.paper' : 'grey.50',
            borderLeft: level > 0 ? `2px solid ${theme.palette.divider}` : 'none',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Avatar 
              src={comment.author.avatar} 
              alt={comment.author.username}
              component={RouterLink}
              to={`/profile/${comment.author.username}`}
              sx={{ 
                width: 32, 
                height: 32, 
                mt: 0.5,
                textDecoration: 'none',
              }}
            />
            
            <Box sx={{ ml: 1, flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Typography 
                  component={RouterLink}
                  to={`/profile/${comment.author.username}`}
                  sx={{ 
                    fontWeight: 500, 
                    textDecoration: 'none',
                    color: 'inherit',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {comment.author.username}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ ml: 1 }}
                >
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </Typography>
                
                {comment.isEdited && (
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ ml: 1, fontStyle: 'italic' }}
                  >
                    (edited)
                  </Typography>
                )}
              </Box>
              
              {editingComment === comment._id ? (
                <Box sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={editCommentContent}
                    onChange={(e) => setEditCommentContent(e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      variant="contained" 
                      size="small"
                      onClick={() => handleUpdateComment(comment._id)}
                    >
                      Save
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => {
                        setEditingComment(null);
                        setEditCommentContent('');
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
                  <ReactMarkdown>{comment.content}</ReactMarkdown>
                </Typography>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <IconButton 
                  size="small" 
                  color={comment.userVote === 1 ? 'primary' : 'default'}
                  onClick={() => handleVote('upvote', comment._id, true)}
                >
                  <ThumbUpIcon fontSize="small" />
                </IconButton>
                <Typography variant="body2" sx={{ mx: 0.5 }}>
                  {comment.votes}
                </Typography>
                <IconButton 
                  size="small" 
                  color={comment.userVote === -1 ? 'error' : 'default'}
                  onClick={() => handleVote('downvote', comment._id, true)}
                >
                  <ThumbDownIcon fontSize="small" />
                </IconButton>
                
                <Button 
                  size="small" 
                  startIcon={<ReplyIcon />}
                  onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                  sx={{ ml: 1 }}
                >
                  Reply
                </Button>
                
                {currentUser && currentUser._id === comment.author._id && (
                  <>
                    <Button 
                      size="small" 
                      startIcon={<EditIcon />}
                      onClick={() => startEditingComment(comment)}
                      sx={{ ml: 1 }}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteComment(comment._id)}
                      color="error"
                      sx={{ ml: 1 }}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </Box>
              
              {replyingTo === comment._id && (
                <Box sx={{ mt: 2, ml: 2 }}>
                  <form onSubmit={handleCommentSubmit}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Write your reply..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      variant="outlined"
                      size="small"
                      required
                      sx={{ mb: 1 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        size="small"
                      >
                        Reply
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => setReplyingTo(null)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </form>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
        
        {comment.replies && comment.replies.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {renderComments(comment.replies, level + 1)}
          </Box>
        )}
      </Box>
    ));
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>Post not found</Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      
      {/* Post Content */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {post.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar 
            src={post.author.avatar} 
            alt={post.author.username}
            component={RouterLink}
            to={`/profile/${post.author.username}`}
            sx={{ textDecoration: 'none' }}
          />
          <Box sx={{ ml: 1.5 }}>
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
              {post.isEdited && ' • Edited'}
            </Typography>
          </Box>
          
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            <IconButton 
              color={post.userVote === 1 ? 'primary' : 'default'}
              onClick={() => handleVote('upvote', post._id)}
            >
              <ThumbUpIcon />
            </IconButton>
            <Typography variant="h6" sx={{ mx: 1 }}>
              {post.votes}
            </Typography>
            <IconButton 
              color={post.userVote === -1 ? 'error' : 'default'}
              onClick={() => handleVote('downvote', post._id)}
            >
              <ThumbDownIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {post.tags.map((tag) => (
              <Chip 
                key={tag} 
                label={tag} 
                component={RouterLink}
                to={`/tags/${tag}`}
                clickable
              />
            ))}
          </Box>
          
          <Box sx={{ 
            '& img': { 
              maxWidth: '100%', 
              height: 'auto',
              borderRadius: 1,
              my: 2,
            },
            '& pre': {
              backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
              padding: theme.spacing(2),
              borderRadius: 1,
              overflowX: 'auto',
            },
            '& code': {
              fontFamily: 'monospace',
              backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
              padding: '0.2em 0.4em',
              borderRadius: 3,
              fontSize: '0.9em',
            },
            '& blockquote': {
              borderLeft: `4px solid ${theme.palette.divider}`,
              paddingLeft: theme.spacing(2),
              marginLeft: 0,
              fontStyle: 'italic',
              color: theme.palette.text.secondary,
            },
            '& table': {
              borderCollapse: 'collapse',
              width: '100%',
              margin: '1em 0',
              '& th, & td': {
              border: `1px solid ${theme.palette.divider}`,
              padding: theme.spacing(1, 2),
              textAlign: 'left',
              },
              '& th': {
              backgroundColor: theme.palette.action.hover,
              },
            },
          }}>
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </Box>
          
          {post.author._id === currentUser?._id && (
            <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined" 
                component={RouterLink}
                to={`/posts/${post._id}/edit`}
                startIcon={<EditIcon />}
              >
                Edit Post
              </Button>
              <Button 
                variant="outlined" 
                color="error"
                startIcon={<DeleteIcon />}
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this post?')) {
                    try {
                      await axios.delete(`/api/posts/${post._id}`);
                      navigate('/');
                    } catch (err) {
                      console.error('Error deleting post:', err);
                    }
                  }
                }}
              >
                Delete Post
              </Button>
            </Box>
          )}
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Comment Form */}
        <Box id="comments" sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </Typography>
          
          {currentUser ? (
            <form onSubmit={handleCommentSubmit}>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                variant="outlined"
                required
                sx={{ mb: 2 }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                disabled={!newComment.trim()}
              >
                Post Comment
              </Button>
            </form>
          ) : (
            <Box 
              sx={{ 
                p: 3, 
                bgcolor: 'background.paper', 
                borderRadius: 1,
                textAlign: 'center',
              }}
            >
              <Typography variant="body1" sx={{ mb: 2 }}>
                Please sign in to leave a comment
              </Typography>
              <Button 
                variant="contained" 
                component={RouterLink}
                to="/login"
                state={{ from: window.location.pathname }}
              >
                Sign In
              </Button>
            </Box>
          )}
        </Box>
        
        {/* Comments List */}
        <Box sx={{ mt: 4 }}>
          {comments.length > 0 ? (
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {renderComments(comments)}
            </List>
          ) : (
            <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
              No comments yet. Be the first to comment!
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default PostDetail;
