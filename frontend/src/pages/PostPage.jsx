import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Divider,
  Button,
  TextField,
  CircularProgress,
  useTheme,
  CardMedia,
  Chip,
  Stack,
} from '@mui/material';
import { 
  ArrowBack, 
  Favorite, 
  FavoriteBorder, 
  Comment, 
  Share as ShareIcon, 
  MoreVert,
  BookmarkBorder,
  Bookmark,
  Send,
  TagFaces,
  EmojiEmotions,
  Image,
  Download as DownloadIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { styled } from '@mui/material/styles';

// Styled components
const StyledCardMedia = styled(CardMedia)({
  width: '100%',
  maxHeight: '500px',
  objectFit: 'cover',
  borderTop: '1px solid rgba(0, 0, 0, 0.12)',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
});

const StyledAvatar = styled(Avatar)({
  width: 40,
  height: 40,
  marginRight: 12,
  border: '2px solid #fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
});

const ActionButton = styled(IconButton)({
  padding: 8,
  margin: '0 4px',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
});

const PostPage = () => {
  const { currentUser } = useAuth();
  const { postId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Replace with your actual API call
        // const response = await api.get(`/posts/${postId}`);
        // setPost(response.data);
        
        // Mock data for now
        setTimeout(() => {
          setPost({
            id: postId,
            title: 'Beautiful Sunset at the Beach',
            content: 'Captured this amazing sunset during my evening walk. The colors were absolutely breathtaking! Nature never fails to amaze me with its beauty. #sunset #beach #nature',
            author: {
              name: 'John Doe',
              avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
              username: 'johndoe',
            },
            createdAt: new Date().toISOString(),
            image: 'https://source.unsplash.com/random/800x600?nature',
            tags: ['nature', 'photography', 'outdoors'],
            location: 'Malibu Beach, California',
          });
          setLikeCount(42);
          setComments([
            { 
              id: 1, 
              author: {
                name: 'Jane Smith',
                avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                username: 'janesmith'
              }, 
              text: 'Great post! The colors in this photo are amazing. 😍', 
              createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
              likes: 5
            },
            { 
              id: 2, 
              author: {
                name: 'Mike Johnson',
                avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
                username: 'mikej'
              },
              text: 'Thanks for sharing! Where was this taken?', 
              createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
              likes: 2
            },
          ]);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching post:', error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    const newComment = {
      id: Date.now(),
      author: 'Current User', // Replace with actual user data
      text: comment,
      createdAt: new Date().toISOString(),
    };
    
    setComments([newComment, ...comments]);
    setComment('');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" color="textSecondary">
          Post not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, textTransform: 'none' }}
      >
        Back to Feed
      </Button>
      
      <Card elevation={0} sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        {/* Author Info */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <StyledAvatar 
            src={post.author.avatar} 
            alt={post.author.name} 
            onClick={() => navigate(`/profile/${post.author.username}`)}
            sx={{ cursor: 'pointer' }}
          />
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {post.author.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              {post.location && ` • ${post.location}`}
            </Typography>
          </Box>
          <Box flexGrow={1} />
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>
        
        {/* Post Image */}
        <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: 'background.paper' }}>
          {post.image ? (
            <Box
              component="img"
              src={post.image}
              alt="Post"
              sx={{
                width: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                display: 'block',
                mx: 'auto',
                cursor: 'zoom-in',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
              onClick={(e) => {
                // Toggle fullscreen on click
                if (!document.fullscreenElement) {
                  e.target.requestFullscreen().catch(err => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`);
                  });
                } else {
                  document.exitFullscreen();
                }
              }}
            />
          ) : (
            <Box 
              sx={{ 
                width: '100%', 
                height: '300px', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'action.hover',
                color: 'text.secondary'
              }}
            >
              <Typography>No image available</Typography>
            </Box>
          )}
          
          {/* Image actions overlay */}
          <Box 
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              display: 'flex',
              gap: 1,
              opacity: 0,
              transition: 'opacity 0.3s ease',
              '&:hover': {
                opacity: 1
              }
            }}
          >
            <IconButton 
              size="small" 
              sx={{ 
                bgcolor: 'rgba(0,0,0,0.6)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.8)'
                }
              }}
              onClick={() => {
                // Download image functionality
                const link = document.createElement('a');
                link.href = post.image;
                link.download = `post-${postId}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              sx={{ 
                bgcolor: 'rgba(0,0,0,0.6)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.8)'
                }
              }}
              onClick={() => {
                // Share image functionality
                if (navigator.share) {
                  navigator.share({
                    title: 'Check out this post',
                    text: post.content.substring(0, 100) + '...',
                    url: window.location.href,
                  }).catch(console.error);
                } else {
                  // Fallback for browsers that don't support Web Share API
                  navigator.clipboard.writeText(window.location.href);
                  // You might want to show a snackbar or toast here
                  console.log('Link copied to clipboard');
                }
              }}
            >
              <ShareIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        <CardContent sx={{ p: 0 }}>
          {/* Post Actions */}
          <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <Box>
              <ActionButton onClick={handleLike}>
                {isLiked ? 
                  <Favorite sx={{ color: 'error.main' }} /> : 
                  <FavoriteBorder />
                }
              </ActionButton>
              <ActionButton>
                <Comment />
              </ActionButton>
              <ActionButton>
                <Send />
              </ActionButton>
            </Box>
            <ActionButton onClick={() => setIsBookmarked(!isBookmarked)}>
              {isBookmarked ? 
                <Bookmark sx={{ color: 'primary.main' }} /> : 
                <BookmarkBorder />
              }
            </ActionButton>
          </Box>
          
          {/* Likes and Caption */}
          <Box sx={{ px: 2, pt: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              {likeCount} {likeCount === 1 ? 'like' : 'likes'}
            </Typography>
            
            <Typography variant="body1" paragraph>
              <Box component="span" fontWeight={600} sx={{ mr: 1 }}>
                {post.author.username}
              </Box>
              {post.content}
            </Typography>
            
            {post.tags && post.tags.length > 0 && (
              <Box sx={{ mb: 2 }}>
                {post.tags.map((tag, index) => (
                  <Chip 
                    key={index}
                    label={`#${tag}`} 
                    size="small" 
                    sx={{ mr: 0.5, mb: 0.5, cursor: 'pointer' }}
                    onClick={() => navigate(`/explore/tags/${tag}`)}
                  />
                ))}
              </Box>
            )}

            {/* Comments Section */}
            <Box sx={{ mt: 3 }}>
              {/* Comments Count */}
              <Typography 
                variant="subtitle2" 
                color="text.secondary" 
                sx={{ mb: 2, cursor: 'pointer' }}
                onClick={() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
              </Typography>

              {/* Add Comment */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  src={currentUser?.photoURL || '/default-avatar.png'} 
                  alt={currentUser?.displayName || 'User'}
                  sx={{ width: 40, height: 40, mr: 2 }}
                />
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', bgcolor: 'action.hover', borderRadius: 4, px: 2, py: 0.5 }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    InputProps={{
                      disableUnderline: true,
                      sx: { 
                        '& .MuiInputBase-input': {
                          py: 1.5,
                        }
                      },
                    }}
                    sx={{ flexGrow: 1 }}
                  />
                  {comment.trim() && (
                    <IconButton 
                      onClick={handleCommentSubmit}
                      color="primary"
                      size="small"
                    >
                      <Send fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Box>

              {/* Comments List */}
              <Box id="comments-section" sx={{ maxHeight: '400px', overflowY: 'auto', pr: 1 }}>
                {comments.map((comment) => (
                  <Box key={comment.id} sx={{ display: 'flex', mb: 3 }}>
                    <Avatar 
                      src={comment.author.avatar} 
                      alt={comment.author.name}
                      sx={{ width: 32, height: 32, mr: 1.5, mt: 0.5 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ 
                        backgroundColor: 'action.hover', 
                        p: 1.5, 
                        borderRadius: 2,
                        display: 'inline-block',
                        maxWidth: '100%'
                      }}>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                          {comment.author.name}
                        </Typography>
                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                          {comment.text}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, ml: 1.5 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </Typography>
                        <Typography variant="caption" fontWeight={600} sx={{ mr: 2, cursor: 'pointer' }}>
                          Like
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {comment.likes || 0} {comment.likes === 1 ? 'like' : 'likes'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PostPage;
