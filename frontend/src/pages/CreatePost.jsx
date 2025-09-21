import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  useTheme,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  useMediaQuery,
  Snackbar,
  Alert,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import postsApi from '../api/posts';

const CreatePost = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      tags: [],
      type: 'discussion',
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required('Title is required')
        .max(200, 'Title must be less than 200 characters'),
      content: Yup.string()
        .required('Content is required')
        .min(30, 'Content must be at least 30 characters'),
      type: Yup.string()
        .required('Please select a post type'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setIsSubmitting(true);
        setError('');
        
        // Create post data with required fields
        const postData = {
          title: values.title,
          content: values.content,
          tags: values.tags,
          type: values.type,
          // Add any additional fields your API requires
        };
        
        // Call the API to create the post
        const response = await postsApi.createPost(postData);
        
        // Show success message
        setSuccess('Post created successfully!');
        
        // Reset form
        resetForm();
        
        // Redirect to the new post or home page after a short delay
        setTimeout(() => {
          if (response?.data?._id) {
            navigate(`/post/${response.data._id}`);
          } else {
            navigate('/');
          }
        }, 1500);
        
      } catch (error) {
        console.error('Error creating post:', error);
        setError(error.message || 'Failed to create post. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Handle snackbar close
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError('');
    setSuccess('');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={isMobile ? 0 : 1} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Create a New Post
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Success/Error Messages */}
        <Snackbar 
          open={!!error || !!success} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={error ? 'error' : 'success'}
            sx={{ width: '100%' }}
          >
            {error || success}
          </Alert>
        </Snackbar>
        
        <form onSubmit={formik.handleSubmit} noValidate>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="post-type-label">Post Type</InputLabel>
            <Select
              labelId="post-type-label"
              id="type"
              name="type"
              value={formik.values.type}
              onChange={formik.handleChange}
              error={formik.touched.type && Boolean(formik.errors.type)}
              label="Post Type"
            >
              <MenuItem value="discussion">Discussion</MenuItem>
              <MenuItem value="question">Question</MenuItem>
              <MenuItem value="article">Article</MenuItem>
            </Select>
            {formik.touched.type && formik.errors.type && (
              <FormHelperText error>{formik.errors.type}</FormHelperText>
            )}
          </FormControl>
          
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Title"
            placeholder="What's your question or topic?"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            sx={{ mb: 3 }}
          />
          
          <TextField
            fullWidth
            id="content"
            name="content"
            label="Content"
            placeholder="Write your post here..."
            multiline
            rows={8}
            value={formik.values.content}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.content && Boolean(formik.errors.content)}
            helperText={
              formik.touched.content && formik.errors.content
                ? formik.errors.content
                : 'Be clear and descriptive. Markdown is supported.'
            }
            sx={{ mb: 3 }}
          />
          
          <TextField
            fullWidth
            id="tags"
            name="tags"
            label="Tags"
            placeholder="Add tags separated by commas"
            value={formik.values.tags.join(', ')}
            onChange={(e) => {
              const tags = e.target.value
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);
              formik.setFieldValue('tags', tags);
            }}
            sx={{ mb: 3 }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            {formik.values.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => {
                  const newTags = [...formik.values.tags];
                  newTags.splice(index, 1);
                  formik.setFieldValue('tags', newTags);
                }}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting || !formik.isValid}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreatePost;
